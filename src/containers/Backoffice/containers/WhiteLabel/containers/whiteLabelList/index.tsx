import * as React from "react";
import CONFIG from "../../../../../../constants/config";
import I18n from "../../../../../../services/i18n/index";
import "./style.less";
import DataTable from "../../../../../../components/DataTable";
import {
    ControllersApi,
    ControllersListCampaignsResponseData, ControllersListInventoryResponseData,
    UserApi, UserResponseLoginOK,
    UserResponseLoginOKAccount
} from "../../../../../../api/api";
import {withRouter, RouterProps} from "react-router";
import {notification, Switch} from "antd";
import {connect} from "react-redux";
import {RootState} from "../../../../../../redux/reducers";
import {setIsLogin, setUser} from "../../../../../../redux/app/actions";
import Translate from "../../../../../../components/i18n/Translate";
import Modal from "../../../../../../components/Modal";
import Icon from "../../../../../../components/Icon";

interface IProps {
    history?: any;
}


interface IState {
    showAlert: boolean;
}

const enum WHITELABEL_STATUS  {ENABLE = "enable" , DISABLE = "disable"}

class WhiteLabelList extends React.Component<IProps, IState> {
    private i18n = I18n.getInstance();
    userApi = new UserApi();
    private controllersApi = new ControllersApi();
    private table: any;
    private statusRow: any;
    private statusIndex: number;
    private statusValue: any;
    private statusSwitch: boolean;

    constructor(props: IProps) {
        super(props);
        this.state = {
            showAlert: false,
        };
    }

    componentDidMount() {
        // empty
    }

    /**
     * @func changeCampaignStatus
     * @desc this function will change campaign status on dataTable (will fire onOk of Modal)
     * @param row
     * @param index
     * @param statusSwitch
     */
    public changeCampaignStatus(row: any , index: number , statusSwitch) {
        statusSwitch = !statusSwitch;
        const newState = statusSwitch ? WHITELABEL_STATUS.ENABLE : WHITELABEL_STATUS.DISABLE;
        this.table.changeRecordData(index, {
            ...row,
            status: newState,
        });
        this.changeWhiteLabelStatusApi(row.id, newState, () => {
            statusSwitch = !statusSwitch;
            const newState = statusSwitch ? WHITELABEL_STATUS.ENABLE : WHITELABEL_STATUS.DISABLE;
            this.table.changeRecordData(index, {
                ...row,
                status: newState,
            });
        });
    }
    private changeWhiteLabelStatusApi(id: number, status: WHITELABEL_STATUS, onerror: () => void) {
        this.controllersApi.domainChangeDomainStatusIdPut({
            id: id.toString(),
            payloadData: {
                domain_status: status,
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
    public render() {
        return (
            <div dir={CONFIG.DIR} className="whitelabel-billing content-container">
                <div className="page-info-container mb-1">
                    <Translate className="page-title" value={"List of all of whitelabels"}/>
                    <Translate className="page-description" value={"You can view and manage whitelabels in this page"}/>
                </div>
                <DataTable
                    ref={(table) => (this.table = table)}
                    dataFn={this.controllersApi.domainListGet}
                    definitionFn={this.controllersApi.domainListDefinitionGet}
                    name={"WhiteLabel_List"}
                    customRenderColumns={{
                        "status": (value: string, row: ControllersListInventoryResponseData, index: number): JSX.Element => {
                            let switchValue = (value !== WHITELABEL_STATUS.DISABLE);
                            return <div>
                                <Switch
                                    checked={switchValue}
                                    className={CONFIG.DIR === "rtl" ? "switch-rtl" : "switch"}
                                    onChange={() => {
                                        this.setState({showAlert: true});
                                        this.statusRow = row;
                                        this.statusIndex = index;
                                        this.statusValue = value;
                                        this.statusSwitch = switchValue;
                                    }
                                    }
                                />
                                {/* Alert Modal for changing status of campaign*/}
                                <Modal visible={this.state.showAlert}
                                       closable={false}
                                       customClass="alert-modal"
                                       onOk={() => {this.changeCampaignStatus(this.statusRow, this.statusIndex, this.statusSwitch);
                                           this.setState({showAlert: false}); } }
                                       onCancel={() => {this.setState({showAlert: false}); }}
                                >
                                    <div className="alert-modal-container">
                                        <Icon name={"cif-alert"}/>
                                        <Translate
                                            className="alert-description"
                                            value={`Are you sure that you want to
                                                        ${this.statusSwitch ? "deactive" : "active"}
                                                        ${(this.statusRow) ?  (this.statusRow as any).title : ""}  ?`}/>
                                    </div>
                                </Modal>
                           </div>;
                       }
                   }}
                    actionsFn={{
                        "edit": (value, record, index) => {
                            this.props.history.push(`/backoffice/whitelabel/edit/${record.id}`);
                        },
                    }}
                />
            </div>
        );
    }
}


export default withRouter(WhiteLabelList);
