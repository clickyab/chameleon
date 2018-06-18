///<reference path="../../../../../node_modules/@types/react-router/index.d.ts"/>
import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import {
    ControllersApi,
    ControllersCampaignGetResponse,
    OrmCampaignProgress,
    UserResponseLoginOKAccount,
} from "../../../../api/api";
import {Form, Row, Col, Button, Tabs, Select, notification} from "antd";
import {setIsLogin, setUser} from "../../../../redux/app/actions/index";
import CONFIG from "../../../../constants/config";
import DataTableChartWrapper from "../../../../components/DataTableChartWrapper/index";
import {CAMPAIGN_STATUS} from "../../../Campaign/containers/Type";

const TabPane = Tabs.TabPane;
const Option = Select.Option;

import "./style.less";
import Translate from "../../../../components/i18n/Translate";
import Icon from "../../../../components/Icon";
import {setBreadcrumb} from "../../../../redux/app/actions";
import {currencyFormatter} from "../../../../services/Utils/CurrencyFormatter";
import DataTable from "../../../../components/DataTable";
import {Link} from "react-router-dom";
import Modal from "../../../../components/Modal";
import AAA from "../../../../services/AAA";

const FormItem = Form.Item;

interface IProps extends RouteComponentProps<void> {
    form: any;
    setBreadcrumb: (name: string, title: string, parent: string) => void;
}

interface IState {
    activeTab: string;
    progress?: OrmCampaignProgress;
    statusChange?: boolean;
    currentCampaign?: ControllersCampaignGetResponse;
}


@connect(mapStateToProps, mapDispatchToProps)
class Details extends React.Component<IProps, IState> {

    private i18n = I18n.getInstance();
    private campaignStatus: CAMPAIGN_STATUS;
    private controllerApi = new ControllersApi();

    constructor(props: IProps) {
        super(props);
        this.state = {
            activeTab: "GraphingStatistics",
            statusChange: false,
        };
        this.handleCampaignStatus = this.handleCampaignStatus.bind(this);
        this.submitCampaignStatus = this.submitCampaignStatus.bind(this);
    }

    public componentDidMount() {
        this.props.setBreadcrumb("details", this.i18n._t("Details").toString(), "campaigns");
        this.loadCampaign();
        this.loadProgress();
    }

    loadCampaign() {
        const api = new ControllersApi();
        api.campaignGetIdGet({id: this.props.match.params["id"]})
            .then((campaign) => {
                this.setState({
                    currentCampaign: campaign,
                    statusChange: false,
                    // allDay: !campaign.end_at,
                    // allTime: (timePeriods.length === 0 || timePeriods.length === 1 && timePeriods[0].from === 0 && timePeriods[0].to === 23),
                    // timePeriods,
                });
            });
    }

    loadProgress() {
        this.controllerApi.campaignProgressIdGet({id: this.props.match.params["id"]})
            .then(progress => {
                this.setState({progress});
            });
    }

    private handleTab(key): void {
        this.setState({
            activeTab: key,
        });
    }

    private campaignGraphDailyIdGet(config) {
        config.id = this.props.match.params["id"];
        return this.controllerApi.campaignGraphDailyIdGet(config);
    }

    private campaignDailyIdDefinitionGet(config) {
        config.id = this.props.match.params["id"];
        return this.controllerApi.campaignDailyIdDefinitionGet(config);
    }

    private campaignDailyIdGet(config) {
        config.id = this.props.match.params["id"];
        return this.controllerApi.campaignDailyIdGet(config);
    }

    private adCampaignIdGet(config) {
        config.id = this.props.match.params["id"];
        return this.controllerApi.adCampaignIdGet(config);
    }

    private adCampaignIdDefinitionGet(config) {
        config.id = this.props.match.params["id"];
        return this.controllerApi.adCampaignIdDefinitionGet(config);
    }

    private handleCampaignStatus(value) {
        this.campaignStatus = value;
    }
    private submitCampaignStatus() {
            this.controllerApi.campaignStatusIdPatch({
                id: this.state.currentCampaign.id.toString(),
                payloadData: {status: this.campaignStatus}
            }).then(respond => {
                notification.success({
                    message: this.i18n._t("Campaign status changed"),
                    className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                    description: "",
                });
                this.loadCampaign();
            }).catch(error => {
                notification.error({
                    message: this.i18n._t("Error occured").toString(),
                    className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                    description: error.message,
                });
            });
    }
    public render() {
        return (
            <Row className={"campaign-details"}>
                <Col>
                    <div dir={CONFIG.DIR}>
                        <Row type={"flex"} className={"mt-5"}>
                            <Col className="campaigns-title" span={10}>
                                {this.state.currentCampaign &&
                                <div>
                                    <h5>{this.state.currentCampaign.title}
                                    <Link to={`/campaign/check-publish/${this.props.match.params["id"]}`}>
                                        <Button size={"small"} className="add-customize-btn btn-margin">
                                            <Icon name={"cif-edit"} className="custom-icon"/>
                                            <Translate value={"Edit Campaign"}/>
                                        </Button>
                                    </Link>
                                    </h5>
                                    <Row className={"details"}>
                                        <Row type="flex">
                                            <Col span={6}>{this.i18n._t("Campaign Type")}</Col>
                                            <Col className={"info-detail"}>: {this.state.currentCampaign.kind === "web" ? this.i18n._t("Web") : this.i18n._t("app")}</Col>
                                        </Row>
                                        <Row type="flex">
                                            <Col span={6}>{this.i18n._t("Status")}</Col>
                                            {this.state.statusChange === false &&
                                            <Col className={"info-detail"}>:
                                                {this.state.currentCampaign.status === CAMPAIGN_STATUS.START &&
                                                <Translate className={"active-campaign"} value={"active"}/>
                                                }
                                                {this.state.currentCampaign.status === CAMPAIGN_STATUS.PAUSE &&
                                                <Translate className={"disable-campaign"} value={"disable"}/>
                                                }
                                                {this.state.currentCampaign.status === CAMPAIGN_STATUS.ARCHIVE &&
                                                <Icon className="campaign-archive" name={"cif-archive"}/>
                                                }
                                                {this.state.currentCampaign.status !== CAMPAIGN_STATUS.ARCHIVE && AAA.getInstance().hasPerm("change_campaign_status:self") &&
                                                <Icon onClick={() => this.setState({statusChange: true})} name="cif-edit"/>
                                                }
                                            </Col>
                                            }
                                            {this.state.statusChange === true &&
                                            <Col className={"info-detail"}>
                                                <div className="change-status-wrapper">:
                                                    <Select className={"select-input"}
                                                            defaultValue={this.state.currentCampaign.status}
                                                            dropdownClassName={"select-dropdown"}
                                                            onChange={(value) => this.handleCampaignStatus(value)}>
                                                        <Option value={CAMPAIGN_STATUS.START}><Translate
                                                            value={"Active"}/></Option>
                                                        <Option value={CAMPAIGN_STATUS.PAUSE}><Translate
                                                            value={"Disable"}/></Option>
                                                        <Option value={CAMPAIGN_STATUS.ARCHIVE}><Translate
                                                            value={"Archive"}/></Option>
                                                    </Select>
                                                    <Icon onClick={this.submitCampaignStatus} name="cif-checked"/>
                                                </div>
                                            </Col>
                                            }
                                        </Row>
                                        <Row type="flex">
                                            <Col span={6}>{this.i18n._t("Show Period")}</Col>
                                            <Col className={"info-detail"}>: {this.i18n._d(this.state.currentCampaign.start_at)} {this.state.currentCampaign.end_at && "- " + this.i18n._d(this.state.currentCampaign.end_at)}</Col>
                                        </Row>
                                        <Row type="flex">
                                            <Col span={6}>{this.i18n._t("CRM")}</Col>
                                            <Col className={"info-detail"}>: {this.state.currentCampaign.max_bid}</Col>
                                        </Row>
                                    </Row>
                                </div>
                                }
                            </Col>
                            <Col span={14}>
                                {this.state.progress && <div>
                                    <Row type={"flex"}>
                                        <Col span={3}></Col>
                                        <Col span={16}>
                                            <div className={"dialog-wrapper"}
                                                 style={{marginRight: ((this.state.progress.total_budget - this.state.progress.total_spend) / this.state.progress.total_budget) * 100 + "%"}}>
                                                <div className={"dialog"}>
                                                    {this.i18n._t("Spent")}
                                                    <h6>{currencyFormatter(this.state.progress.total_spend)} {this.i18n._t("_currency_")}</h6>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={5}>
                                        </Col>
                                    </Row>
                                    <Row type="flex">
                                        <Col span={3} className="progress-start-text"><Translate value={"Spent"}/></Col>
                                        <Col span={16}>
                                            <div className="campaign-strip-bar-wrapper">
                                                <div className={`campaign-strip-bar ${this.state.progress.total_spend === 0 && this.state.progress.total_budget !== 0 ? "border-strip-bar" : ""}`}
                                                     style={{width: (this.state.progress.total_budget) ? ((this.state.progress.total_budget - this.state.progress.total_spend) / this.state.progress.total_budget * 100) + "%" : "0"}}>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={5} className="progress-end-text-wrapper">
                                            <div className="progress-end-text">
                                                <div className="title"><Translate value={"Campaign Budget"}/></div>
                                                <div
                                                    className="description">{currencyFormatter(this.state.progress.total_budget)} {this.i18n._t("_currency_")}</div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row type={"flex"}>
                                        <Col span={3}></Col>
                                        <Col span={16}>
                                            <Row type={"flex"} className={"statistic"}>
                                                <Col className={"stat"} span={4}>
                                                    <h5>{currencyFormatter(this.state.progress.imp)}</h5>
                                                    <small>{this.i18n._t("Visit")}</small>
                                                </Col>
                                                <Col className={"stat"} span={4}>
                                                    <h5>{currencyFormatter(this.state.progress.click)}</h5>
                                                    <small>{this.i18n._t("Click")}</small>
                                                </Col>
                                                <Col className={"stat"} span={4}>
                                                    <h5>{currencyFormatter(this.state.progress.ctr)}%</h5>
                                                    <small>{this.i18n._t("CTR")}</small>
                                                </Col>
                                                <Col className={"stat"} span={4}>
                                                    <h5>{currencyFormatter(this.state.progress.avg_cpc)}</h5>
                                                    <small>{this.i18n._t("eCPC")}</small>
                                                </Col>
                                                <Col className={"stat"} span={4}>
                                                    <h5>{currencyFormatter(this.state.progress.daily_budget)}</h5>
                                                    <small>{this.i18n._t("Daily Budget")}</small>
                                                </Col>
                                                <Col className={"stat"} span={4}>
                                                    <h5>{currencyFormatter(406937)}</h5>
                                                    <small>{this.i18n._t("visit")}</small>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={5}></Col>
                                    </Row>
                                </div>}
                            </Col>
                        </Row>
                        <Row type="flex">
                            <Tabs activeKey={this.state.activeTab}
                                  onChange={this.handleTab.bind(this)}
                                  type="editable-card"
                                  hideAdd={true}
                                  className="tabs-container">
                                <TabPane tab={this.i18n._t("Creative list")} key="DailyStatistics" closable={false}>
                                    <DataTable
                                        name="campaignInventories"
                                        definitionFn={this.adCampaignIdDefinitionGet.bind(this)}
                                        dataFn={this.adCampaignIdGet.bind(this)}
                                    />
                                </TabPane>
                                <TabPane tab={this.i18n._t("Daily Statistics")} key="GraphingStatistics"
                                         closable={false}>
                                    <DataTableChartWrapper
                                        name="campaignDetails"
                                        chartDataFn={this.campaignGraphDailyIdGet.bind(this)}
                                        chartDefinitionFn={this.campaignDailyIdDefinitionGet.bind(this)}
                                        dataTableDefinitionFn={this.campaignDailyIdDefinitionGet.bind(this)}
                                        dataTableDataFn={this.campaignDailyIdGet.bind(this)}
                                        showRangePicker={true}
                                        dataTableCustomRenderColumns={{
                                            "date": (value: string, record): JSX.Element => {
                                                const date = value;
                                                return <Link to={`/my/campaign/details/${this.props.match.params["id"]}/daily/${date}/${date}`}>
                                                    <div>{this.i18n._d(value)}</div>
                                                </Link>;
                                            }
                                        }}
                                    />
                                </TabPane>
                            </Tabs>
                        </Row>
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

export default Form.create()(withRouter(Details as any));
