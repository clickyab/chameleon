import * as React from "react";
import {Layout} from "antd";
import SidebarMenu from "../../sidebar/index";
import {PrivateFooter} from "./footer/index";
import "./style.less";
import PrivateBreadcrumb from "./Breadcrumb/index";
import Icon from "../../../../components/Icon/index";

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
      collapsed: false,
    };
  }

  private toggle() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  public render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout className={(this.state.collapsed) ? "layout-collapsed" : "layout-open"}>
          <Header className="header">
            <PrivateBreadcrumb/>
            <Icon
              className="trigger"
              name={this.state.collapsed ? "cif-opennav" : "cif-closenav"}
              onClick={this.toggle}
            />
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
          className="sidebar-wrapper"
        >
          <SidebarMenu collapsed={this.state.collapsed}/>
        </Sider>
      </Layout>
    );
  }
}
