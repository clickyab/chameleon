import * as React from "react";
import {Avatar as AntAvatar} from "antd";
import {RootState} from "../../redux/reducers";
import {connect} from "react-redux";
import {BASE_PATH, UserResponseLoginOKAccount} from "../../api/api";
import "./style.less";

const md5 = require("md5");

/**
 * @interface IProps
 */
interface IProps {
  progress?: number | null;
  size?: "large" | "small" | "default";
  user: UserResponseLoginOKAccount;
  className?: string | null ;
  radius?: number | null ;
}

/**
 * @interface IState
 */
interface IState {
  cx: number;
}

function mapStateToProps(state: RootState) {
  return {
    progress: state.app.profileProgress,
  };
}
@connect(mapStateToProps)
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
   *  @Param {string} radius  radius of avatar
   *
   * @Param {string}  size  size of avatar
   *
   * @return {string}
   */
  private handleProgressPosition(radius, size): string {
    if (radius === null) {
      switch (size) {
        case "large":
          return ("translate(0,40px) rotate(-90deg)");
        case "small":
          return ("translate(0,24px) rotate(-90deg)");
      }
    }
    else {
      return ("translate(0," + radius * 2 + "px) rotate(-90deg)") ;
    }
  }


  /**
   * @func handleProgressSize
   *
   * @desc Handle Profile completion Progress with help of dash-offset
   *
   * @Param {string} size get Size of Avatar
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
    if (!nextProps.size.radius) {
      this.handleProgressSize(nextProps.size);
    }
    else {
      this.setState({cx: nextProps.size});
    }
  }

  componentWillMount() {
    if (!this.props.radius) {
      this.handleProgressSize(this.props.size);
    }
    else {
      this.setState({cx: this.props.radius});
    }
  }

  render() {
    return (
      <div className={(this.props.className) ? (this.props.className + " avatar") : "avatar"}>
        {this.props.progress &&
      <svg className="profile-progress" width={this.state.cx * 2} height={this.state.cx * 2}>
        <circle className="progress-border inactive" cx={this.state.cx} cy={this.state.cx} r={this.state.cx + 2}
                strokeWidth="1" fill="transparent"
                style={{transform: this.handleProgressPosition(this.props.radius, this.props.size)}}/>
        <circle className="progress-border active"
                strokeDashoffset={1000 - ( Math.PI * (2 * (this.state.cx + 2))) * this.props.progress / 100}
                cx={this.state.cx} cy={this.state.cx} r={this.state.cx + 2}
                strokeWidth="1" fill="transparent"
                style={{transform: this.handleProgressPosition(this.props.radius, this.props.size)}}/>
      </svg>}
        {this.props.user.avatar &&
        <AntAvatar src={BASE_PATH.replace("/api", "") + "/uploads/avatar/" + this.props.user.avatar}
                   size={this.props.size}
                   style={(this.props.radius) ? {height: this.state.cx * 2 , width: this.state.cx * 2} : null }
        />}
        {!this.props.user.avatar &&
        <AntAvatar src={this.handleGravatar(this.props.user.email, 100)} size={this.props.size}/>}
      </div>
    );
  }
}
