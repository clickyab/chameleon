import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {RootState} from "../../redux/reducers/index";
import {Form} from "antd";
import {Row, Col, notification, Spin, Tabs} from "antd";
import {MenuItem, RadioButton, SelectField, TextField, RadioButtonGroup, RaisedButton} from "material-ui";
import I18n from "../../services/i18n/index";
import Translate from "../../components/i18n/Translate/index";
import {Select} from "antd";
import Icon from "../../components/Icon";
import CONFIG from "../../constants/config";
import Tooltip from "../../components/Tooltip/index";
import {ControllersApi, OrmCampaign} from "../../api/api";
import DataTable from "../../components/DataTable/index";
import {setBreadcrumb} from "../../redux/app/actions/index";
import ListOfPublishers from "./containers/ListOfPublishers";
import "./style.less";


const TabPane = Tabs.TabPane;
enum COMP_TAB {
  PUBLISHER = "All publishers",
  MY_LISTS = "My lists",
}

interface IOwnProps {
  match?: any;
  history?: any;
}

interface IProps {
  match?: any;
  history?: any;
  setBreadcrumb: (name: string, title: string, parent: string) => void;
}

interface IState {
  tab: COMP_TAB;
}

@connect(mapStateToProps, mapDispatchToProps)
class Explore extends React.Component <IProps, IState> {
  private i18n = I18n.getInstance();

  constructor(props: IProps) {
    super(props);
    this.state = {
      tab: COMP_TAB.PUBLISHER,
    };
  }

  public componentDidMount() {
    this.props.setBreadcrumb("explore", this.i18n._t("Explore").toString(), "home");
  }

  private handleTab(key): void {
    return console.log("key", key);
  }

  public render() {
    return (
      <div dir={CONFIG.DIR} className={"content-container"}>
          <Row className="page-title">
            <h3 ><Translate value={"Explore"}/></h3>
          </Row>
          <Row type={"flex"} align={"middle"}>
            <Tabs onChange={() => this.handleTab} type="card" className="tabs-container">
              <TabPane tab={this.i18n._t("All publishers")} key="All publishers">
                  <ListOfPublishers/>
              </TabPane>
              <TabPane tab={this.i18n._t("My List")} key="My lists">
              </TabPane>
            </Tabs>
          </Row>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: IOwnProps) {
  return {
    match: ownProps.match,
    history: ownProps.history,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
  };
}
export default (withRouter(Explore));
