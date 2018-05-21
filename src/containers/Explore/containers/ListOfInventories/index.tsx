import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {RootState} from "../../../../redux/reducers/index";
import {Form, notification} from "antd";
import {Row, Switch, Col} from "antd";
import I18n from "../../../../services/i18n/index";
import {Select} from "antd";
import CONFIG from "../../../../constants/config";
import {
    ControllersApi, ControllersListInventoryResponseData
} from "../../../../api/api";
import DataTable from "../../../../components/DataTable/index";

import {setBreadcrumb} from "../../../../redux/app/actions/index";
import Modal from "../../../../components/Modal/index";
import Icon from "../../../../components/Icon/index";
import Translate from "../../../../components/i18n/Translate/index";
import {TextField} from "material-ui";

const Option = Select.Option;

const FormItem = Form.Item;

enum INVENTORY_STATUS {
    ENABLE = "enable",
    DISABLE = "disable",
}

interface IOwnProps {
    match?: any;
    history?: any;
    updatedRecord: any;
}

interface IProps {
    match: any;
    updatedRecord: any;
    history: any;
    setBreadcrumb: (name: string, title: string, parent: string) => void;
    onEditListClick?: (list) => void;
}

interface IState {
    listName: string;
    whiteList: boolean;
    listOFLists?: any;
    listID?: number;
    updateList: boolean;
    openArchiveModal: boolean;
    copyListName: string;
    copyListNameError: string;
}


@connect(mapStateToProps, mapDispatchToProps)
class ListOfInventories extends React.Component <IProps, IState> {

    private i18n = I18n.getInstance();
    private checkedItems = [];
    private controllerApi = new ControllersApi();
    private table: any;
    private openedInventories = {};
    private latestUpdatedRecord;

    constructor(props: IProps) {
        super(props);
        this.state = {
            openArchiveModal: false,
            listName: "",
            whiteList: true,
            listOFLists: [],
            updateList: false,
            copyListName: "",
            copyListNameError: null,
        };


        this.changeInventoryRecord = this.changeInventoryRecord.bind(this);
    }

    public componentDidMount() {
        this.props.setBreadcrumb("explore", this.i18n._t("Explore").toString(), "home");
    }

    public componentWillReceiveProps(newProps: IProps) {
        if (this.latestUpdatedRecord !== newProps.updatedRecord) {
            this.changeInventoryRecord(newProps.updatedRecord);
        }
    }


    /**
     * @func
     * @description handle select publisher list's items
     * @param {string[]} keys
     * @param {any[]} rows
     */
    onSelectRow(keys: string[], rows: any[]) {
        this.checkedItems = keys;
    }

    changeInventoryState(id: number, status: INVENTORY_STATUS, onerror: () => void) {
        this.controllerApi.inventoryInventoryIdPatch({
            id: id.toString(),
            payloadData: {
                status: status,
            }
        }).catch(error => {
            onerror();
            notification.error({
                message: this.i18n._t("Change Campaign ").toString(),
                className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                description: this.i18n._t(error.error.text).toString(),
            });
        });
    }

    private changeInventoryRecord(inventory) {
        this.table.changeRecordData(this.openedInventories[inventory.id], inventory);
    }

    public render() {
        return (
            <div dir={CONFIG.DIR}>
                <Row type="flex" align="middle">
                    <DataTable
                        ref={table => {
                            this.table = table;
                        }}
                        infinite={true}
                        name="publisherList"
                        onSelectRow={this.onSelectRow.bind(this)}
                        definitionFn={this.controllerApi.inventoryInventoryListDefinitionGet}
                        dataFn={this.controllerApi.inventoryInventoryListGet}
                        actionsFn={{
                            "edit": (v, r, i) => {
                                this.openedInventories[r.id] = i;
                                this.props.onEditListClick(r);
                            },
                            "archive": (v, r) => {
                                console.log(r);
                                this.setState({openArchiveModal: true});
                            }
                        }}
                        customRenderColumns={{
                            "status": (value: string, row: ControllersListInventoryResponseData, index: number): JSX.Element => {
                                let switchValue = value === INVENTORY_STATUS.ENABLE ? true : false;
                                return <div>
                                    <Switch
                                        checked={switchValue}
                                        className={CONFIG.DIR === "rtl" ? "switch-rtl" : "switch"}
                                        onChange={() => {
                                            switchValue = !switchValue;
                                            const newState = switchValue ? INVENTORY_STATUS.ENABLE : INVENTORY_STATUS.DISABLE;
                                            this.table.changeRecordData(index, {
                                                ...row,
                                                status: newState,
                                            });
                                            this.changeInventoryState(row.id, newState, () => {
                                                switchValue = !switchValue;
                                                const newState = switchValue ? INVENTORY_STATUS.ENABLE : INVENTORY_STATUS.DISABLE;
                                                this.table.changeRecordData(index, {
                                                    ...row,
                                                    status: newState,
                                                });
                                            });
                                        }}
                                    />
                                </div>;
                            }
                        }}
                    />
                </Row>
                <Modal title={null}
                       type={"prompt"}
                       okText={this.i18n._t("Yes").toString()}
                       okType={"danger"}
                       visible={this.state.openArchiveModal}
                       onOk={() => {
                           this.setState({openArchiveModal: false});
                       }}
                       onCancel={() => {
                           this.setState({openArchiveModal: false});
                       }}
                >
                    <Row>
                        <Col span={20}>
                            <div>
                                <Translate value={"Are you sure about remove <b>%s</b>?"} html={true}
                                           params={[1]}/>
                            </div>
                            <div>
                                <Translate value={"You can't undo this action after confirm."}/>
                            </div>
                        </Col>
                        <Col span={4}>
                            <Icon name={"cif-edit"} fontsize={30}/>
                        </Col>
                    </Row>
                </Modal>
                <Modal title={this.i18n._t("Create a copy from: %s", {params: ["1"]})}
                       okText={this.i18n._t("Save").toString()}
                       visible={this.state.openArchiveModal}
                       mask={true}
                       style={{maxWidth: "370px"}}
                       onOk={() => {

                           if (this.state.copyListName.length <= 8) {
                               this.setState({
                                   copyListNameError: this.i18n._t("The name is too short.").toString(),
                               });
                           } else {
                               this.setState({
                                   openArchiveModal: false,
                                   copyListNameError: null,
                                   copyListName: "",
                               });
                           }

                       }}
                       onCancel={() => {
                           this.setState({
                               openArchiveModal: false,
                               copyListNameError: null,
                               copyListName: "",
                           });
                       }}
                >
                    <Row>
                        <Col span={24} className={"mt-1"}>
                            <TextField
                                fullWidth={true}
                                errorText={this.state.copyListNameError}
                                hintText={this.i18n._t("Input a name for new list...")}
                                autoFocus={true}
                                onChange={(event, val) => {
                                    this.setState({
                                        copyListName: val,
                                    });
                                }}
                            />
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}


function mapStateToProps(state: RootState, ownProps: IOwnProps) {
    return {
        currentStep: state.campaign.currentStep,
        currentCampaign: state.campaign.currentCampaign,
        selectedCampaignId: state.campaign.selectedCampaignId,
        match: ownProps.match,
        history: ownProps.history,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
    };
}

export default withRouter(ListOfInventories as any);
