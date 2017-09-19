import * as React from "react";
import "./style.less";
import {Badge, Icon, notification} from "antd";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {RootState} from "../../../../redux/reducers/index";
import {UserResponseLoginOKAccount} from "../../../../api/api";
import Avatar from "../../../../components/Avatar/index";
import {Link} from "react-router-dom";
import I18n from "../../../../services/i18n/index";
import Menu from "antd/es/menu";

/**
 * @interface Props
 */
interface IProps {
  collapse: boolean;
  percent?: number;
  user?: UserResponseLoginOKAccount;
  history?: Array<Object>;
}

/**
 * @interface State
 */
interface IState {
  open: boolean;
}

/**
 * User mini information and quick link
 *
 * @desc This component used in sidebar menu and has a mini information of user and quick link for browsing
 *
 * @class
 *
 */
function mapStateToProps(state: RootState) {
  return {
    user: state.app.user,
  };
}
@connect(mapStateToProps)
class UserBox extends React.Component<IProps, IState> {

  /**
   * @constructor
   *
   * @param {IProps} props
   */
  constructor(props: IProps) {
    super(props);

    this.state = {
      open: false
    };
    this.handleContainerClick = this.handleContainerClick.bind(this);
  }

  /**
   *
   * @type {I18n}
   */
  private i18n = I18n.getInstance();

  private userBoxRouting(key) {
    switch (key) {
      case "editProfile":
        return this.props.history.push("/user/profile");
      case "transactions":
        return this.props.history.push("/");
      case "charge":
        return this.props.history.push("/");
      case "withdraw":
        return this.props.history.push("/");
      case "userManagement":
        return this.props.history.push("/");
      case "logout":
        return this.props.history.push("/");
    }
  }
  /**
   * @func
   *
   * @desc Change state with user click & if click on icon return;
   *
   * @param e
   */
  private handleContainerClick(e: any) {
    // if click on notification icon return
    if (e.target.parentNode.className === "ant-badge") return;

    this.setState({open: !this.state.open});
  }

  /**
   * @desc create notification when click on notify icon
   *
   * @func
   *
   */
  private handleBellClick(): void {
    notification.info({
      message: "Click on bell",
      description: ":)"
    });
  }

  /**
   * @desc render this function when menu unfolded
   *
   * @func
   *
   * @return {JSX.Element}
   */
  private openMenuRender(): JSX.Element {
    return (
      <div className="mini-container">
        <div className="mini-close" onClick={this.handleContainerClick}>
          <Icon className="user-box-icon" type="up"/>
          <Avatar user={this.props.user} progress={25}/>
          <div className="mini-info">
            کسری انصاری
            <br/>
            اعتبار : 15000
          </div>

          <div className="mini-bell">
            <Badge dot className="profile-badge">
              <Icon type="bell" className="bell-icon" style={{fontSize: 18}} onClick={this.handleBellClick}/>
            </Badge>
          </div>
        </div>
        {this.state.open && <div className="mini-open">
          <Menu theme="dark"  mode="inline"  defaultSelectedKeys={["1"]}
                onClick={e => this.userBoxRouting(e.key)}>
            <Menu.Item key="editProfile">
              <span>{this.i18n._t("Edit profile")}</span>
            </Menu.Item>
            <Menu.Item key="transactions">
              <span>{this.i18n._t("Transactions")}</span>
            </Menu.Item>
            <Menu.Item key="charge">
              <span>{this.i18n._t("Charge")}</span>
            </Menu.Item>
            <Menu.Item key="withdraw">
              <span>{this.i18n._t("Withdraw")}</span>
            </Menu.Item>
            <Menu.Item key="userManagement">
              <span>{this.i18n._t("user management")}</span>
            </Menu.Item>
            <Menu.Item key="logout">
              <span>{this.i18n._t("logout")}</span>
            </Menu.Item>
          </Menu>
        </div>}
      </div>
    );
  }

  /**
   * @desc render this function when menu folded
   *
   * @func
   *
   * @return {JSX.Element}
   */
  private closeMenuRender(): JSX.Element {
    return (
      <div className="mini-container container-close">
        <div className="avatar-close-menu">
          <Badge dot className="profile-collapse-badge"/>
          <Avatar user={this.props.user} progress={66}/>
        </div>
      </div>
    );
  }

  public render() {
    return (
      this.props.collapse ? this.closeMenuRender() : this.openMenuRender()
    );
  }
}

export default withRouter<IProps>(UserBox as any);
