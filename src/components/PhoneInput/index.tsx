/**
 * @file phone input component
 * @author Ehsan Hosseini
 * @desc Render phone input component and show flags
 */
import * as React from "react";
import countries from "./countries";
import "./style.less";
import {TextField} from "material-ui";
import I18n from "../../services/i18n/index";

/**
 * @interface IProps
 */
interface IProps {
  /**
   * @param value
   * @desc initial value
   */
  value?: string;

  /**
   * @param {string} value
   * @desc onChange callback function
   */
  onChange?: (value: string) => void;
}

/**
 * @interface IProps
 */
interface IState {
  /**
   * @optional
   * @param {string} code
   * @desc country short code (ex "ir")
   */
  code?: string;

  /**
   * @param {string} digiCode
   * @desc digital phone code prefix
   */
  dialCode: string | number;

  /**
   * @param {string}
   * @desc phone value
   */
  phone?: string | number;
}

export default class PhoneInput extends React.Component<IProps, IState> {
  /**
   * @desc instance of I18n
   * @type {I18n}
   */
  private i18n = I18n.getInstance();

  /**
   * @constructor
   * @desc check for initial value and set default value of each state
   * @param {IProps} props
   */
  constructor(props: IProps) {
    super(props);
    const initialValue = this.props.value ? this.props.value.split("-") : [];
    this.state = {
      code: "ir",
      dialCode: initialValue.length === 2 ? initialValue[0] : "98",
      phone: initialValue.length === 2 ? initialValue[1] : null,
    };

    this.handleChangeCode = this.handleChangeCode.bind(this);
    this.handleChangePhone = this.handleChangePhone.bind(this);
  }

  /**
   * @func
   * @desc handle change code of country and set state to define flag and show that and call onChange callback
   * @param event
   * @param value
   */
  handleChangeCode(event, value) {
    const country = countries.find((c) => {
      return c.dial_code === `+${value}`;
    });
    if (country) {
      this.setState({
        code: country.code,
        dialCode: value,
      });
    }
    this.setState({
      code: country.code,
      dialCode: value,
    });
    this.onChange();
  }

  /**
   * @func
   * @desc set phone value and call onChange callback
   * @param event
   * @param phone
   */
  handleChangePhone(event, phone) {
    this.setState({phone});
    this.onChange();
  }

  /**
   * @func
   * @desc check props onChange and call it
   */
  onChange() {
    if (this.props.onChange) {
      this.props.onChange(`${this.state.dialCode}-${this.state.phone}`);
    }
  }

  public render() {
    return (
      <div className="phone-input">
        <div className="flag-wraper">
          <img className="phone-flag" src={require(`./flags/${this.state.code.toLocaleLowerCase()}.png`)}/>
        </div>
        <div className="country-code">
          <span className="plus-code">+</span>
          <span className="country-code-num">
          <TextField
            disabled={true}
            defaultValue={this.state.dialCode}
            onChange={this.handleChangeCode.bind(this)}
            hintText={"98"}
            underlineStyle={{ display: "none"}}
            style={{width: 20}}/>
        </span>
        </div>
        <div className="phone-text-field">
          <TextField
            floatingLabelText={this.i18n._t("Mobile Phone Number").toString()}
            defaultValue={this.state.phone}
            type="number"
            onChange={this.handleChangePhone.bind(this)}
            fullWidth={true}
            className={"spin-btn-hide"}
          />
        </div>
      </div>
    );
  }
}
