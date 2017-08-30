import * as React from "react";
import {withRouter} from "react-router";
import {Layout, Menu, Icon, Badge, Button} from "antd";
import I18n from "../../../services/i18n/index";

const {Sider}: any = Layout;

interface IProps {
    collapsed: boolean;
    history?: Array<Object>;
}

interface IState {}

class SidebarMenu extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    private i18n = I18n.getInstance();

    private sideBarRouting(key) {
        switch (key) {
            case "createCampaign":
                return this.props.history.push("/Campaign/create");
            case "dashboard":
                return this.props.history.push("/");
            case "campaigns":
                return this.props.history.push("/Campaign");
            case "media":
                return this.props.history.push("/media");
            case "explore":
                return this.props.history.push("/explore");
            case "reports":
                return this.props.history.push("/report");
            case "suppors":
                return this.props.history.push("/support");
        }
    }

    public render() {
        return (
            <div className={this.props.collapsed ? "" : "menu-list"}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" className="sidebar" defaultSelectedKeys={["1"]} onClick={e => this.sideBarRouting(e.key)}>
                    <Menu.Item key="createCampaign" className="campaignButton">
                        <Button className="ghostButton" size="large" ghost>
                            <Icon type="plus"/>
                            <span>{this.i18n._t("Create Campaign")}</span>
                        </Button>
                    </Menu.Item>
                    <Menu.Item key="dashboard">
                        <Icon type="user" />
                        <span>{this.i18n._t("Dashboard")}</span>
                    </Menu.Item>
                    <Menu.Item key="campaigns">
                        <Icon type="video-camera" />
                        <span>{this.i18n._t("Campaigns")}</span>
                    </Menu.Item>
                    <Menu.Item key="media">
                        <Icon type="upload" />
                        <span>{this.i18n._t("Media")}</span>
                    </Menu.Item>
                    <Menu.Item key="explore">
                        <Icon type="upload" />
                        <span>{this.i18n._t("explore")}</span>
                    </Menu.Item>
                    <Menu.Item key="reports">
                        <Icon type="upload" />
                        <span>{this.i18n._t("Reports")}</span>
                    </Menu.Item>
                    <Menu.Item key="suppors">
                        <Icon type="upload" />
                        <span>{this.i18n._t("Support")}</span>
                        {this.props.collapsed &&
                        <Badge className="dot-badge"  dot={true}  count={14} />}
                        {!this.props.collapsed &&
                        <Badge  style={{ backgroundColor: "#a0bfee" }}  className="badge" count={14} />}
                    </Menu.Item>
                </Menu>
            </div>
        );
    }

}

export default withRouter<IProps>(SidebarMenu as any);
