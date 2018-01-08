import * as React from "react";
import I18n from "../../../../../services/i18n/index";

/**
 * Props
 */
interface IProps {
  seconds: number;
  email?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * State
 */
interface IState {
  time: any;
  seconds: number;
  end: boolean;
  onClick?: () => void;
}

/**
 * Resend
 *
 * @desc This function request to re-send forgot password email
 *
 * @Props {second}: Time - {email}
 *
 * @class
 */
export default class Resend extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {time: {}, seconds: this.props.seconds, end: false , onClick: (this.props.onClick) ? (this.props.onClick) : this.resendVerify };

    this.timer = 0;

    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.resendVerify = this.resendVerify.bind(this);
  }

  // Translation
  private i18n = I18n.getInstance();

  private timer;

  private secondsToTime(secs: number): object {
    let hours: number = Math.floor(secs / (60 * 60));

    let divisor_for_minutes: number = secs % (60 * 60);
    let minutes: number = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds: number = divisor_for_minutes % 60;
    let seconds: number = Math.ceil(divisor_for_seconds);

    let obj: object = {
      "h": hours <= 9 ? `0${hours}` : hours,
      "m": minutes <= 9 ? `0${minutes}` : minutes,
      "s": seconds <= 9 ? `0${seconds}` : seconds
    };
    return obj;
  }

  public componentDidMount() {
    this.startTimer();
  }

  public componentWillUnmount() {
    clearInterval(this.timer);
  }

  //
  private startTimer() {
    this.setState({seconds: this.props.seconds, end: false}, () => {
      let timeLeftVar = this.secondsToTime(this.state.seconds);
      this.setState({time: timeLeftVar});
    });

    this.timer = setInterval(this.countDown, 1000);
  }

  private countDown(): void {
    // Remove one second, set state so a re-render happens.
    let seconds: number = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds === 0) {
      clearInterval(this.timer);

      this.setState({end: true});
    }
  }

  private resendVerify() {
    this.startTimer();
  }

  render() {
    if (!this.state.end) {
      return (
        <div>
          {this.state.time.m}:{this.state.time.s}
        </div>
      );
    } else {
      return (
        <div><a className={this.props.className} onClick={this.state.onClick}>{this.i18n._t("Resend verification code")}</a></div>
      );
    }
  }
}
