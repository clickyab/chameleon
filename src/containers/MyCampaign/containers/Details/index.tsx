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

const numeral = require("numeral");
import "./style.less";

const FormItem = Form.Item;

interface IProps extends RouteComponentProps<void> {
  form: any;
}

interface IState {
  activeTab: string;
}


@connect(mapStateToProps, mapDispatchToProps)
class Details extends React.Component<IProps, IState> {

  private i18n = I18n.getInstance();
  private controllerApi = new ControllersApi();

  constructor(props: IProps) {
    super(props);
    this.state = {
      activeTab : "GraphingStatistics"
    };
  }

  public componentDidMount() {
    // empty
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
              <Col span={6}>
                <h5>حراج کمپین
                  <Button size={"small"} icon={"pencil"}>{this.i18n._t("Edit Campaign")}</Button>
                </h5>
                <table className={"details"}>
                  <tbody>
                  <tr>
                    <td>{this.i18n._t("Campaign Type")}</td>
                    <td>: وب</td>
                  </tr>
                  <tr>
                    <td>{this.i18n._t("Status")}</td>
                    <td>: وب</td>
                  </tr>
                  <tr>
                    <td>{this.i18n._t("Show Period")}</td>
                    <td>: وب</td>
                  </tr>
                  <tr>
                    <td>{this.i18n._t("Campaign Owner's Email")}</td>
                    <td>: وب</td>
                  </tr>
                  <tr>
                    <td>{this.i18n._t("Campaign Manager's Email")}</td>
                    <td>: وب</td>
                  </tr>
                  <tr>
                    <td>{this.i18n._t("CRM")}</td>
                    <td>: وب</td>
                  </tr>
                  </tbody>
                </table>
              </Col>
              <Col span={18}>
                <Row type={"flex"}>
                  <Col span={3}></Col>
                  <Col span={16}>
                    <div className={"dialog"}>
                      {this.i18n._t("Spent")}
                      <h6>{numeral(9500).format("0,0")} {this.i18n._t("_currency_")}</h6>
                    </div>
                  </Col>
                  <Col span={5}>
                  </Col>
                  <Col span={3}>{this.i18n._t("Spent")}</Col>
                  <Col span={16}>
                    <div style={{height: 20, backgroundColor: "#F7F7F8", borderRadius: 15, overflow: "hidden"}}>
                      <div style={{height: 201, width: "20%", backgroundColor: "#41B6E6"}}>
                      </div>
                    </div>
                  </Col>
                  <Col span={5}>
                    <small>{this.i18n._t("Campaign Budget")}</small>
                    <h6>{numeral(95000).format("0,0")} {this.i18n._t("_currency_")}</h6>
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
            <Row>
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
  };
}

export default Form.create()(withRouter(Details as any));
