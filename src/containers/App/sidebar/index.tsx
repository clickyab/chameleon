import * as React from "react";
import {Layout, Menu, Icon, Badge, Button} from "antd";

const {Sider}: any = Layout;

interface IProps {
    collapsed: boolean;
}

interface IState {}

export default class SidebarMenu extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <div className={this.props.collapsed ? "" : "menu-list"}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" className="sidebar" defaultSelectedKeys={["1"]}>
                    <Menu.Item key="0" className="campaignButton">
                        <Button className="ghostButton" size="large" ghost>
                            <Icon type="plus"/>
                            Create Campaign
                        </Button>
                    </Menu.Item>
                    <Menu.Item key="1">
                        <Icon type="user" />
                        <span>Dashboard</span>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="video-camera" />
                        <span>Campaigns</span>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Icon type="upload" />
                        <span>Media</span>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <Icon type="upload" />
                        <span>Help</span>
                    </Menu.Item>
                    <Menu.Item key="5">
                        <Icon type="upload" />
                        <span>Reports</span>
                    </Menu.Item>
                    <Menu.Item key="6">
                        <Icon type="upload" />
                        <span>Support</span>
                        <Badge style={{ backgroundColor: "#a0bfee" }} className={this.props.collapsed ? "" : "badge"} count={14} />
                    </Menu.Item>
                </Menu>
            </div>
        );
    }

}