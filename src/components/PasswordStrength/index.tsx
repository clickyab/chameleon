import * as React from "react";
import {TextField} from "material-ui";
import {Icon} from "antd";
import TextFieldProps = __MaterialUI.TextFieldProps;
import "./style.less";

interface IProps extends TextFieldProps {}

interface IState {
  strengthIcon: string;
}

/**
 * Password strength with icon
 * @desc This class add a icon to material text field and change icon with input password rules
 *
 * @class
 *
 * @return {JSX} return text field with changeable icon
 *
 */
export default class PasswordStrength extends React.Component<IProps, IState> {
  /**
   * Constructor
   *
   * @param {IProps} props
   */
  constructor(props: IProps) {
    super(props);

    this.state = {
      strengthIcon: "frown-o",
    };

    this.checkStrength = this.checkStrength.bind(this);
  }

  /**
   * @func check password strength
   *
   * @param e
   *
   */
  private checkStrength(e) {
    const strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");

    const mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");

    const okRegex = new RegExp("(?=.{6,}).*", "g");

    if (okRegex.test(e.target.value) === false) {
      this.setState({
        strengthIcon: "frown-o"
      });
    } else if (strongRegex.test(e.target.value)) {
      this.setState({
        strengthIcon: "smile-o"
      });
    } else if (mediumRegex.test(e.target.value)) {
      this.setState({
        strengthIcon: "meh-o"
      });
    } else {
      this.setState({
        strengthIcon: "meh-o"
      });
    }

  }

  public render() {
    return (
      <div className="password-strength">
        <Icon className="strength-meter" type={this.state.strengthIcon}/>
        <TextField {...this.props} onKeyUp={this.checkStrength}/>
      </div>
    );
  }
}
