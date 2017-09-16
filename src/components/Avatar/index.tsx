import * as React from "react";
import {Avatar as AntAvatar} from "antd";
import "./style.less";

/**
 * @interface IProps
 */
interface IProps {
  defualtIcon?: boolean;
  progress?: number;
}

/**
 * @interface IState
 */
interface IState {

}

export default class Avatar extends React.Component<IProps, IState> {
  /**
   * @constructor
   * @desc set initial state
   * @param props
   */
  constructor(props: IProps) {
    super(props);
  }

  /**
   * @func handlePercent
   *
   * @desc Handle Profile completion Progress with help of dash-offset
   *
   * @Param {number} percent get profile complete percentage
   *
   * @return {number}
   */
  private handlePercent(percent): number {
    return 1000 - ( Math.floor(115 * percent) ) / 100;
  }

  render() {
    return (
      <div className="avatar">
        <svg className="profile-progress">
          <circle className="progress-border inactive" cx="16" cy="16" r="18" strokeWidth="1" fill="transparent"/>
          <circle className="progress-border active" strokeDashoffset={this.handlePercent(this.props.progress)} cx="16"
                  cy="16" r="18"
                  strokeWidth="1" fill="transparent"/>
        </svg>
        {this.props.defualtIcon &&
        <AntAvatar icon="user"/>}
        {!this.props.defualtIcon &&
        <AntAvatar/>}
      </div>
    );
  }
}
