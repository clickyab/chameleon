import * as React from "react";
import TextField from "material-ui/TextField";
import TextFieldProps = __MaterialUI.TextFieldProps;
import "./style.less";
import Icon from "../Icon/index";

interface IProps extends TextFieldProps {
}

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
      strengthIcon: "cif-pass-typing",
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
    const strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$&*])(?=.*\\W).*$", "g");

    const goodRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");

    const mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");

    const okRegex = new RegExp("(?=.{6,}).*", "g");

    if (strongRegex.test(e.target.value)) {
      this.setState({
        strengthIcon: "cif-pass-strong"
      });
    } else if (goodRegex.test(e.target.value)) {
      this.setState({
        strengthIcon: "cif-pass-good"
      });
    }
    else if (mediumRegex.test(e.target.value)) {
      this.setState({
        strengthIcon: "cif-pass-normal"
      });
    }
    else if (okRegex.test(e.target.value)) {
      this.setState({
        strengthIcon: "cif-pass-weak"
      });
    }
    else {
      this.setState({
        strengthIcon: "cif-pass-typing"
      });
    }

  }

  public render() {
    return (
      <div className="password-strength">
        <Icon className="strength-meter" name={this.state.strengthIcon}/>
        <TextField {...this.props} onKeyUp={this.checkStrength}/>
      </div>
    );
  }
}
