import * as React from "react";
import {Layout} from "antd";
import {connect} from "react-redux";
import SidebarMenu from "../../sidebar/index";
import {PrivateFooter} from "./footer/index";
import "./style.less";
import PrivateBreadcrumb from "./Breadcrumb/index";
import UserAction from "../../../User/UserAction";
import Icon from "../../../../components/Icon/index";
import CONFIG from "../../../../constants/config";
import {RootState} from "../../../../redux/reducers";
import {setMenuCollapse, unsetMenuCollapse} from "../../../../redux/app/actions";

const {Header, Sider, Content} = Layout;

interface IProps {
  children: JSX.Element;
  menuCollapse?: boolean;
  setMenuCollapse?: () => {};
  unsetMenuCollapse?: () => {};
}

interface IState {
  collapsed: boolean;
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PrivateLayout extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      collapsed: props.menuCollapse
    };
  }

  private toggle() {
      if (!this.state.collapsed) {
          this.props.setMenuCollapse();
      }
      else {
          this.props.unsetMenuCollapse();
      }
      this.setState({
          collapsed: !this.state.collapsed,
      });
  }

  public render() {
    return (
      <Layout style={{ minHeight: "100vh" }} >
        <Layout className={(this.state.collapsed) ? "layout-collapsed" + "-" + CONFIG.DIR : "layout-open" + "-" + CONFIG.DIR}>
          <Header className="header">
              <Icon
                  className="trigger"
                  name={this.state.collapsed ? "cif-opennav" : "cif-closenav"}
                  onClick={this.toggle}
              />
            {/*<PrivateBreadcrumb/>*/}
            <UserAction/>
          </Header>
          <Content className="content">
            {this.props.children}
          </Content>
        </Layout>
          <Sider
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}
              width="160"
              collapsedWidth="60"
              className={"sidebar-wrapper-" + CONFIG.DIR}
          >
              <SidebarMenu collapsed={this.state.collapsed}/>
          </Sider>
      </Layout>
    );
  }
}
/**
 * @func map Redux store state as component's props
 * @param {RootState} state
 * @param  ownProps
 * @returns {{menuCollapse: boolean}}
 */
function mapStateToProps(state: RootState, ownProps) {
    return {
        menuCollapse: state.app.menuCollapse,
    };
}

/**
 * @func map Redux action as component's
 * @param dispatch
 * @returns {{setCurrentStep: ((step: STEPS) => any); setSelectedCampaignId: ((id: number) => any)}}
 */
function mapDispatchToProps(dispatch) {
    return {
        setMenuCollapse: () => dispatch(setMenuCollapse()),
        unsetMenuCollapse: () => dispatch(unsetMenuCollapse()),
    };
}
