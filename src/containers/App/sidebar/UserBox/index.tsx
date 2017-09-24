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
import CONFIG from "../../../../constants/config";

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
        return this.props.history.push("/transaction-history");
      case "charge":
        return this.props.history.push("/charge-account");
      case "withdraw":
        return this.props.history.push("/");
      case "userManagement":
        return this.props.history.push("/");
      case "logout":
        return this.props.history.push("/logout");
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
        <div className="svg-container">
        <svg width="46px" height="16px" viewBox="0 0 46 16" onClick={this.handleContainerClick}>
          <g id="Advertiser---User-Profile" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="XLarge-(Large-Desktop)" transform="translate(-1632.000000, -641.000000)">
              <g id="mega-sidebar" transform="translate(1620.000000, 0.000000)">
                <g id="open-menu">
                  <g id="user-profile" transform="translate(0.000000, 641.000000)">
                    <g id="open-menu">
                      <g id="arrow-up" transform="translate(10.000000, 0.000000)">
                        <path
                          d="M24.5,13.5100098 L44.9111328,13.5100098 C31.3896484,13.5100098 31.4035594,0 24.5,0 C17.5964406,0 19.234375,13.5100098 5,13.5100098 C-9.234375,13.5100098 17.5964406,13.5100098 24.5,13.5100098 Z"
                          id="Oval-2" fill="#234478"/>
                        <path
                          d="M24.5,15.0100098 C31.4035594,15.0100098 57.3754883,14.0078125 43.8540039,14.0078125 C30.3325195,14.0078125 31.4035594,1.5 24.5,1.5 C17.5964406,1.5 20.4726563,14.0078125 6.23828125,14.0078125 C-7.99609375,14.0078125 17.5964406,15.0100098 24.5,15.0100098 Z"
                          id="Oval-2" fill="#113260"/>
                        <path
                          d="M26.375,12.4860248 L22.3726708,8.48369565 C22.3152174,8.42624224 22.2864907,8.36024845 22.2864907,8.28571429 C22.2864907,8.21195652 22.3152174,8.14596273 22.3726708,8.08850932 L26.375,4.08618012 C26.4324534,4.02872671 26.4984472,4 26.5729814,4 C26.6475155,4 26.7135093,4.02872671 26.7709627,4.08618012 L27.2003106,4.51552795 C27.257764,4.57298137 27.2864907,4.63897516 27.2864907,4.71350932 C27.2864907,4.78726708 27.257764,4.85326087 27.2003106,4.91071429 L23.8245342,8.28649068 L27.2003106,11.6622671 C27.257764,11.7197205 27.2864907,11.7857143 27.2864907,11.859472 C27.2864907,11.9340062 27.257764,12 27.2003106,12.0574534 L26.7709627,12.4868012 C26.7135093,12.5442547 26.6475155,12.5729814 26.5729814,12.5729814 C26.4984472,12.572205 26.4324534,12.5434783 26.375,12.4860248 Z"
                          id="Path" fill="#A1C0EF"
                          transform="translate(24.786491, 8.286491) rotate(90.000000) translate(-24.786491, -8.286491) "
                          className={(this.state.open) ? "arrow-open" : "arrow-close" }/>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
        </div>
        <div className="mini-close" onClick={this.handleContainerClick}>
          <Avatar user={this.props.user}/>
          <div className="mini-info">
            {(this.props.user.first_name + " " + this.props.user.last_name)}
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
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}
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
          <Avatar user={this.props.user}/>
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
