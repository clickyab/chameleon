import * as React from "react";
import {withRouter} from "react-router";
import {Badge, Button, Layout, Menu} from "antd";
import I18n from "../../../services/i18n/index";
import Icon from "../../../components/Icon/index";
import CONFIG from "../../../constants/config";
import MENUS from "./menus";
import AAA from "../../../services/AAA";


const {Sider}: any = Layout;

interface IProps {
  collapsed: boolean;
  history?: any;
}

interface IState {
    selectedKey: string;
}

class SidebarMenu extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
        selectedKey: "dashborad",
    };
  }

  private i18n = I18n.getInstance();

  private sideBarRouting(key) {
    switch (key) {
      case "createCampaign":
        return this.props.history.push("/Campaign/type");
      case "support":
        this.setState({selectedKey: key});
        return this.props.history.push("/support");
    }

    const menu = MENUS.find((m) => m.key === key);
    if (menu) {
        this.setState({selectedKey: key});
        return this.props.history.push(menu.key);
    }

  }

  componentDidMount() {
      let path = this.props.history.location.pathname.split("/");
      let currentPath = path[path.length - 1];
      (currentPath) ? this.sideBarRouting(currentPath) : this.sideBarRouting("dashboard");
  }

    renderMenus() {
        const menus = [];
        if (AAA.getInstance().hasPerm("campaign_creative:self")) {
            menus.push(
                <Menu.Item key="createCampaign" className="campaignButton">
                    <Button className="ghostButton" size="large" ghost>
                        <Icon className="create-campaign-icon" name="cif-plusbold"/>
                        <span className="create-campaign-text">{this.i18n._t("Create Campaign")}</span>
                    </Button>
                </Menu.Item>
            );
        }
        MENUS.forEach((menu) => {
            let hasPerm = menu.perms.map(p => (AAA.getInstance().hasPerm(p))).filter(p => (p === false)).length === 0;
            if (hasPerm) {
                menus.push(
                    <Menu.Item key={menu.key} className="campaign-menu-item">
                        <Icon className="sidbar-menu-icon" name={menu.icon}/>
                        <span>{menu.name}</span>
                    </Menu.Item>
                );
            }
        });
        menus.push(
            <Menu.Item key="support" className="campaign-menu-item">
                <Icon className="sidbar-menu-icon" name="cif-help"/>
                <span>{this.i18n._t("Support")}</span>
                {this.props.collapsed &&
                <Badge className="dot-badge" dot={true} count={14}/>}
                {!this.props.collapsed &&
                <Badge className="badge" count={14}/>}
            </Menu.Item>
        );
        return menus;
    }

  public render() {
    return (
      <div dir={CONFIG.DIR} className={this.props.collapsed ? "" : "menu-list"}>
        <a  className={"clickyab-logo-link"} onClick={() => this.sideBarRouting("dashboard")}>
           <Icon className="logo-sidebar" name={"cif-cylogo-without-typo"}/>
        </a>
        <Menu theme="dark" mode="inline" className="sidebar" selectedKeys={[this.state.selectedKey]} defaultSelectedKeys={[this.state.selectedKey]}
              onClick={e => this.sideBarRouting(e.key)} >
            {this.renderMenus()}
        </Menu>
      </div>
    );
  }

}

export default withRouter<IProps>(SidebarMenu as any);
