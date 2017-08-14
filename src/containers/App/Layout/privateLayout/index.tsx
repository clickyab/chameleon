import * as React from "react";
import { Layout, Menu, Icon, Row, Col, Breadcrumb } from "antd";

import "./style.less";

const { Header, Sider, Content } = Layout;

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
      <Layout>
        <Layout>
          <Header className="header">
            <Breadcrumb separator=">" className="breadcrumb">
              <Breadcrumb.Item><Icon type="home" /></Breadcrumb.Item>
              <Breadcrumb.Item href="">Application Center</Breadcrumb.Item>
              <Breadcrumb.Item href="">Application List</Breadcrumb.Item>
              <Breadcrumb.Item>An Application</Breadcrumb.Item>
            </Breadcrumb>

            <Icon
              className="trigger"
              type={this.state.collapsed ? "menu-fold" : "menu-unfold"}
              onClick={this.toggle}
            />
          </Header>
          <Content className="content">
            {this.props.children}
          </Content>
        </Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          width="300"
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" className="sidebar" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <Icon type="user" />
              <span>nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span>nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span>nav 3</span>
            </Menu.Item>
          </Menu>
        </Sider>
      </Layout>
    );
  }
}
