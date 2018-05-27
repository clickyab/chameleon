///<reference path="../../../../../node_modules/@types/react-router/index.d.ts"/>
import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import {ControllersApi, ControllersListInventoryResponseData, UserResponseLoginOKAccount} from "../../../../api/api";
import {Form, Row, Col, notification} from "antd";
import {setIsLogin, setUser} from "../../../../redux/app/actions/index";
import {Button} from "antd";
import CONFIG from "../../../../constants/config";
import DataTableChartWrapper from "../../../../components/DataTableChartWrapper/index";

import "./style.less";
import Translate from "../../../../components/i18n/Translate";
import {setBreadcrumb} from "../../../../redux/app/actions";
import Switch from "antd/es/switch";
import Icon from "../../../../components/Icon";

const FormItem = Form.Item;

interface IProps extends RouteComponentProps<void> {
    form: any;
    setBreadcrumb: (name: string, title: string, parent: string) => void;
}

interface IState {
}
enum CAMPAIGN_STATUS {
    ARCHIVE = "archive",
    PAUSE = "pause",
    START = "start",
}

@connect(mapStateToProps, mapDispatchToProps)
class List extends React.Component<IProps, IState> {

    private table: any;
    private i18n = I18n.getInstance();
    private openedInventories = {};
    private controllerApi = new ControllersApi();

    constructor(props: IProps) {
        super(props);
        this.state = {};
    }

    changeCampaignState(id: number, status: CAMPAIGN_STATUS, onerror: () => void) {
        this.controllerApi.campaignStatusIdPatch({
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

    public componentDidMount() {
        this.props.setBreadcrumb("campaigns", this.i18n._t("Campaigns").toString(), "home");
    }
    private changeCampaignRecord(inventory) {
        this.table.changeRecordData(this.openedInventories[inventory.id], inventory);
    }
    public render() {
        return (
            <Row className={"content-container"}>
                <Col>
                    <div dir={CONFIG.DIR}>
                        <Row className="mb-2">
                            <div className="page-title">
                              <h2><Translate value={"campaigns"}/></h2>
                              <p><Translate value={"You can view and edit your and your user campaigns in this page"}/></p>
                            </div>
                        </Row>
                        <DataTableChartWrapper
                            name="myCampaign"
                            infinitTable={true}
                            getTableRef={(table) => (this.table = table)}
                            chartDataFn={this.controllerApi.campaignGraphAllGet}
                            chartDefinitionFn={this.controllerApi.campaignListDefinitionGet}
                            dataTableDefinitionFn={this.controllerApi.campaignListDefinitionGet}
                            dataTableDataFn={this.controllerApi.campaignListGet}
                            showRangePicker={true}
                            dataTableCustomRenderColumns={{
                                "status": (value: string, row: ControllersListInventoryResponseData, index: number): JSX.Element => {
                                    let switchValue = (value !== CAMPAIGN_STATUS.PAUSE);
                                    return <div>
                                        {value === CAMPAIGN_STATUS.ARCHIVE &&
                                            <Icon className={"archive-datatable"} name={"cif-archive"}/>
                                        }
                                        {value !== CAMPAIGN_STATUS.ARCHIVE &&
                                        <Switch
                                            checked={switchValue}
                                            className={CONFIG.DIR === "rtl" ? "switch-rtl" : "switch"}
                                            onChange={() => {
                                                switchValue = !switchValue;
                                                const newState = switchValue ? CAMPAIGN_STATUS.START : CAMPAIGN_STATUS.PAUSE;
                                                this.table.changeRecordData(index, {
                                                    ...row,
                                                    status: newState,
                                                });
                                                this.changeCampaignState(row.id, newState, () => {
                                                    switchValue = !switchValue;
                                                    const newState = switchValue ? CAMPAIGN_STATUS.START : CAMPAIGN_STATUS.PAUSE;
                                                    this.table.changeRecordData(index, {
                                                        ...row,
                                                        status: newState,
                                                    });
                                                });
                                            }}
                                        />
                                        }
                                    </div>;
                                }
                            }}
                            dataTableActionsFn={{
                                "edit": (value, record) => {
                                    this.props.history.push(`/campaign/check-publish/${record.id}`);
                                },
                                "copy": (value, record) => {
                                    this.controllerApi.campaignCopyIdPatch({id: record.id})
                                        .then((data) => {
                                            this.props.history.push(`/campaign/check-publish/${data.id}`);
                                        }).catch((error) => {
                                        notification.error({
                                            message: this.i18n._t("Copy Failed").toString(),
                                            className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                                            description: this.i18n._t(error.text).toString(),
                                        });
                                    });
                                },
                                "archive": (value, record, index) => {
                                    this.controllerApi.campaignArchiveIdPatch({id: record.id})
                                        .then(() => {
                                            this.refs.dataTableChart["dataTableRemoveRecords"]([record.id]);
                                        })
                                        .catch((error) => {
                                            notification.error({
                                                message: this.i18n._t("Archive Failed").toString(),
                                                className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                                                description: this.i18n._t(error.text).toString(),
                                            });

                                        });
                                },
                                "detail": (value, record) => {
                                    this.props.history.push(`/my/campaign/details/${record.id}`);
                                }
                            }}
                        />
                    </div>
                </Col>
            </Row>
        );
    }
}

function mapStateToProps(state: RootState) {
    return {
        isLogin: state.app.isLogin,
        user: state.app.user,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setUser: (user: UserResponseLoginOKAccount) => dispatch(setUser(user)),
        setIsLogin: () => dispatch(setIsLogin()),
        setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
    };
}

export default Form.create()(withRouter(List as any));
