import * as React from "react";
import {Layout} from "antd";
import SidebarMenu from "../../sidebar/index";
import {PrivateFooter} from "./footer/index";
import "./style.less";
import PrivateBreadcrumb from "./Breadcrumb/index";
import {localStorageAdd} from "../../../../services/Utils/LocalStorageWrapper";
import Icon from "../../../../components/Icon/index";
import CONFIG from "../../../../constants/config";

const {Header, Sider, Content} = Layout;

interface IProps {
  children: JSX.Element;
}

interface IState {
  collapsed: boolean;
}

export default class PrivateLayout extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      collapsed: localStorage.getItem("menuCollapsed") === "true",
    };
  }

  private toggle() {
    localStorageAdd("menuCollapsed", !this.state.collapsed);
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  public render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout className={(this.state.collapsed) ? "layout-collapsed" + "-" + CONFIG.DIR : "layout-open" + "-" + CONFIG.DIR}>
          <Header className="header">
              <Icon
                  className="trigger"
                  name={this.state.collapsed ? "cif-opennav" : "cif-closenav"}
                  onClick={this.toggle}
              />
            <PrivateBreadcrumb/>
          </Header>
          <Content className="content">
            {this.props.children}
          </Content>
          <PrivateFooter/>
        </Layout>
          <Sider
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}
              width="300"
              className={"sidebar-wrapper-" + CONFIG.DIR}
          >
              <SidebarMenu collapsed={this.state.collapsed}/>
          </Sider>
      </Layout>
    );
  }
}
