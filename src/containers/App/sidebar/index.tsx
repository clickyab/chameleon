import * as React from "react";
import {withRouter} from "react-router";
import {Badge, Button, Layout, Menu} from "antd";
import I18n from "../../../services/i18n/index";
import Icon from "../../../components/Icon/index";
import CONFIG from "../../../constants/config";


const {Sider}: any = Layout;

interface IProps {
  collapsed: boolean;
  history?: Array<Object>;
}

interface IState {
}

class SidebarMenu extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  private i18n = I18n.getInstance();

  private sideBarRouting(key) {
    switch (key) {
      case "createCampaign":
        return this.props.history.push("/Campaign/type");
      case "dashboard":
        return this.props.history.push("/");
      case "campaigns":
        return this.props.history.push("/my/campaign/list");
      case "media":
        return this.props.history.push("/media");
      case "explore":
        return this.props.history.push("/explore");
      case "reports":
        return this.props.history.push("/report");
      case "support":
        return this.props.history.push("/support");
    }
  }

  public render() {
    return (
      <div dir={CONFIG.DIR} className={this.props.collapsed ? "" : "menu-list"}>
        <Icon className="logo-sidebar" name={"cif-cylogo-without-typo"}/>
        <Menu theme="dark" mode="inline" className="sidebar" defaultSelectedKeys={["1"]}
              onClick={e => this.sideBarRouting(e.key)}>
          <Menu.Item key="createCampaign" className="campaignButton">
            <Button className="ghostButton" size="large" ghost>
                <Icon className="create-campaign-icon" name="cif-plusbold"/>
              <span className="create-campaign-text">{this.i18n._t("Create Campaign")}</span>
            </Button>
          </Menu.Item>
          <Menu.Item key="dashboard" className="campaign-menu-item">
            <Icon className="sidbar-menu-icon" name="cif-dashboard"/>
            <span>{this.i18n._t("Dashboard")}</span>
          </Menu.Item>
          <Menu.Item key="campaigns" className="campaign-menu-item">
            <Icon className="sidbar-menu-icon" name="cif-campaign"/>
            <span>{this.i18n._t("Campaigns")}</span>
          </Menu.Item>
          <Menu.Item key="explore" className="campaign-menu-item">
            <Icon className="sidbar-menu-icon" name="cif-inventory"/>
            <span>{this.i18n._t("explore")}</span>
          </Menu.Item>
          <Menu.Item key="reports" className="campaign-menu-item">
            <Icon className="sidbar-menu-icon" name="cif-analytics"/>
            <span>{this.i18n._t("Reports")}</span>
          </Menu.Item>
          <Menu.Item key="support" className="campaign-menu-item">
            <Icon className="sidbar-menu-icon" name="cif-help"/>
            <span>{this.i18n._t("Support")}</span>
            {this.props.collapsed &&
            <Badge className="dot-badge" dot={true} count={14}/>}
            {!this.props.collapsed &&
            <Badge  className="badge" count={14}/>}
          </Menu.Item>
        </Menu>
      </div>
    );
  }

}

export default withRouter<IProps>(SidebarMenu as any);
