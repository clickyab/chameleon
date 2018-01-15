///<reference path="../../../../../node_modules/@types/react-router/index.d.ts"/>
import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import {ControllersApi, UserResponseLoginOKAccount} from "../../../../api/api";
import {Form, Row, Col, Button, Tabs} from "antd";
import {setIsLogin, setUser} from "../../../../redux/app/actions/index";
import CONFIG from "../../../../constants/config";
import DataTableChartWrapper from "../../../../components/DataTableChartWrapper/index";
const TabPane = Tabs.TabPane;
import "./style.less";
import Translate from "../../../../components/i18n/Translate";
import Icon from "../../../../components/Icon";
import {setBreadcrumb} from "../../../../redux/app/actions";

const numeral = require("numeral");

const FormItem = Form.Item;

interface IProps extends RouteComponentProps<void> {
  form: any;
    setBreadcrumb: (name: string, title: string, parent: string) => void;
}

interface IState {
  activeTab: string;
  progress: number;
}


@connect(mapStateToProps, mapDispatchToProps)
class Details extends React.Component<IProps, IState> {

  private i18n = I18n.getInstance();
  private controllerApi = new ControllersApi();

  constructor(props: IProps) {
    super(props);
    this.state = {
      activeTab : "GraphingStatistics",
      progress: 20
    };
  }

  public componentDidMount() {
      this.props.setBreadcrumb("details", this.i18n._t("Details").toString(), "campaigns");
  }

  private handleTab(key): void {
    this.setState({
      activeTab: key,
    });
  }

  public render() {
    return (
      <Row className={"campaign-details"}>
        <Col>
          <div dir={CONFIG.DIR}>
            <Row type={"flex"} className={"content-container"}>
              <Col className="campaigns-title" span={6}>
                <h5>حراج کمپین
                    <Button size={"small"} className="add-customize-btn btn-margin">
                        <Icon name={"cif-edit"} className="custom-icon"/>
                        <Translate value={"Edit Campaign"}/>
                    </Button>
                </h5>
                <Row className={"details"}>
                  <Row type="flex">
                    <Col span={14}>{this.i18n._t("Campaign Type")}</Col>
                    <Col>: وب</Col>
                  </Row>
                  <Row type="flex">
                   <Col span={14}>{this.i18n._t("Status")}</Col>
                      <Col>: وب</Col>
                  </Row>
                  <Row type="flex">
                   <Col span={14}>{this.i18n._t("Show Period")}</Col>
                      <Col>: وب</Col>
                  </Row>
                  <Row type="flex">
                   <Col span={14}>{this.i18n._t("Owner's Email")}</Col>
                      <Col>: وب</Col>
                  </Row>
                  <Row type="flex">
                   <Col span={14}>{this.i18n._t("Manager's Email")}</Col>
                      <Col>: وب</Col>
                  </Row>
                  <Row type="flex">
                   <Col span={14}>{this.i18n._t("CRM")}</Col>
                      <Col>: وب</Col>
                  </Row>
                </Row>
              </Col>
              <Col span={18}>
                <Row type={"flex"}>
                  <Col span={3}></Col>
                  <Col span={16}>
                    <div className={"dialog-wrapper"} style={{marginRight: this.state.progress + "%" }}>
                      <div className={"dialog"}>
                      {this.i18n._t("Spent")}
                      <h6>{numeral(9500).format("0,0")} {this.i18n._t("_currency_")}</h6>
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
                      <div className="campaign-strip-bar" style={{width: "20%" }}>
                      </div>
                    </div>
                  </Col>
                  <Col span={5} className="progress-end-text-wrapper">
                    <div className="progress-end-text">
                    <div className="title"><Translate value={"Campaign Budget"}/></div>
                    <div className="description">{numeral(95000).format("0,0")} {this.i18n._t("_currency_")}</div>
                    </div>
                  </Col>
                  </Row>
                <Row type={"flex"}>
                  <Col span={3}></Col>
                  <Col span={16}>
                    <Row type={"flex"} className={"statistic"}>
                      <Col className={"stat"} span={4}>
                        <h5>{numeral(406937).format("0,0")}</h5>
                        <small>{this.i18n._t("visit")}</small>
                      </Col>
                      <Col className={"stat"} span={4}>
                        <h5>{numeral(406937).format("0,0")}</h5>
                        <small>{this.i18n._t("visit")}</small>
                      </Col>
                      <Col className={"stat"} span={4}>
                        <h5>{numeral(406937).format("0,0")}</h5>
                        <small>{this.i18n._t("visit")}</small>
                      </Col>
                      <Col className={"stat"} span={4}>
                        <h5>{numeral(406937).format("0,0")}</h5>
                        <small>{this.i18n._t("visit")}</small>
                      </Col>
                      <Col className={"stat"} span={4}>
                        <h5>{numeral(406937).format("0,0")}</h5>
                        <small>{this.i18n._t("visit")}</small>
                      </Col>
                      <Col className={"stat"} span={4}>
                        <h5>{numeral(406937).format("0,0")}</h5>
                        <small>{this.i18n._t("visit")}</small>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={5}></Col>
                </Row>
              </Col>
            </Row>
            <Row type="flex">
              <Tabs activeKey={this.state.activeTab}
                    onChange={this.handleTab.bind(this)}
                    type="editable-card"
                    hideAdd={true}
                    className="tabs-container mt-2 mr-4 ml-4">
                <TabPane tab={this.i18n._t("Graphing Statistics")} key="GraphingStatistics" closable={false}>
                  <DataTableChartWrapper
                  name="myCampaign"
                  chartDataFn={this.controllerApi.inventoryListGet}
                  chartDefinitionFn={this.controllerApi.inventoryListDefinitionGet}
                  dataTableDefinitionFn={this.controllerApi.inventoryListDefinitionGet}
                  dataTableDataFn={this.controllerApi.inventoryListGet}
                  />
                </TabPane>
                <TabPane tab={this.i18n._t("Daily Statistics")} key="DailyStatistics" closable={false}>
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
