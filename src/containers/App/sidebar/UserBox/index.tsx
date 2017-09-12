import * as React from "react";
import "./style.less";
import {Avatar, Badge, Icon, notification} from "antd";
import {Link} from "react-router-dom";
import I18n from "../../../../services/i18n/index";

/**
 * @interface Props
 */
interface IProps {
  collapse: boolean;
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
export default class UserBox extends React.Component<IProps, IState> {

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
   * @desc create notification when click on notif icon
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
          <div className="avatar">
            <Avatar icon="user"/>
          </div>
          <div className="mini-info">
            کسری انصاری
            <br/>
            اعتبار : 15000
          </div>

          <div className="mini-bell">
            <Badge dot>
              <Icon type="bell" className="bell-icon" style={{fontSize: 18}} onClick={this.handleBellClick}/>
            </Badge>
          </div>
        </div>
        {this.state.open && <div className="mini-open">
          <ul>
            <li><Link to="#">{this.i18n._t("edit profile")}</Link></li>
            <li><Link to="#">{this.i18n._t("transactions")}</Link></li>
            <li><Link to="#">{this.i18n._t("charge")}</Link></li>
            <li><Link to="#">{this.i18n._t("withdraw")}</Link></li>
            <li><Link to="#">{this.i18n._t("user management")}</Link></li>
            <li><Link to="#">{this.i18n._t("logout")}</Link></li>
          </ul>
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
      <div className="mini-container">
        <div className="avatar-close-menu">
          <Avatar icon="user"/>
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