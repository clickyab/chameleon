import * as React from "react";
import {Avatar as AntAvatar} from "antd";
import {UserResponseLoginOKAccount} from "../../api/api";
import "./style.less";

const md5 = require("md5");

/**
 * @interface IProps
 */
interface IProps {
  progress?: number | null;
  size?: "large" | "small" | "default";
  user: UserResponseLoginOKAccount;
}

/**
 * @interface IState
 */
interface IState {
  cx: number;
}

export default class Avatar extends React.Component<IProps, IState> {
  /**
   * @constructor
   * @desc set initial state
   * @param props
   */
  constructor(props: IProps) {
    super(props);
    this.state = ({
      cx: 16,
    });
  }

  /**
   * @func handleProgress position
   *
   * @desc Handle Profile completion Progress with help of dash-offset
   *
   * @Param {string} Get size of avatar
   *
   * @return {string}
   */
  private handleProgressPosition(size): string {
    switch (size) {
      case "large":
        return ("translate(0,40px) rotate(-90deg)");
      case "small":
        return ("translate(0,24px) rotate(-90deg)");
    }
  }


  /**
   * @func handleProgressSize
   *
   * @desc Handle Profile completion Progress with help of dash-offset
   *
   * @Param {number} percent get profile complete percentage
   *
   * @return {void}
   */
  private handleProgressSize(size): void {
    switch (size) {
      case "large":
        this.setState({cx: 20});
        break;
      case "small":
        this.setState({cx: 12});
        break;
      default:
        this.setState({cx: 16});
        break;
    }
  }

  /**
   * @func handleGravatar
   *
   * @desc Handle Gravatar url of user
   *
   * @Param {string} email of user
   *
   * @Param {string} size of avatar
   *
   * @return {string}  URL of  User's Gravatar
   */
  handleGravatar(email, size): string {
    let md5Email = md5(email);
    let url = "http://www.gravatar.com/avatar/" + md5Email + ".jpg" + "?s=" + size;
    return url;
  }

  componentWillReceiveProps(nextProps) {
    this.handleProgressSize(nextProps.size);
  }

  componentWillMount() {
    this.handleProgressSize(this.props.size);
  }

  render() {
    return (
      <div className="avatar">
        {this.props.progress &&
        <svg className="profile-progress">
          <circle className="progress-border inactive" cx={this.state.cx} cy={this.state.cx} r={this.state.cx + 2}
                  strokeWidth="1" fill="transparent"
                  style={{transform: this.handleProgressPosition(this.props.size)}}/>
          <circle className="progress-border active"
                  strokeDashoffset={1000 - ( Math.PI * (2 * (this.state.cx + 2))) * this.props.progress / 100}
                  cx={this.state.cx} cy={this.state.cx} r={this.state.cx + 2}
                  strokeWidth="1" fill="transparent"
                  style={{transform: this.handleProgressPosition(this.props.size)}}/>
        </svg>}
        {this.props.user.avatar &&
        <AntAvatar src={this.props.user.avatar} size={this.props.size}/>}
        {!this.props.user.avatar &&
        <AntAvatar src={this.handleGravatar(this.props.user.email, 100)} size={this.props.size}/>}
      </div>
    );
  }
}
