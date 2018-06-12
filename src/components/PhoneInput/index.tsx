/**
 * @file phone input component
 * @author Ehsan Hosseini
 * @desc Render phone input component and show flags
 */
import * as React from "react";
import countries from "./countries";
import "./style.less";
import TextField from "material-ui/TextField";
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

  /**
   * @param errorText
   * @desc determine texfield error message
  */
  errorText?: string | boolean;
  /**
   * @param {boolean} value
   * @desc check if phone number is empty and send it to parent
  */
  checkEmpty?: (value: boolean) => void;

  maxLength?: number;

  className?: string;
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
    /**
     * @param {string}
     * @desc error text
     */
  errorText?: string | boolean;
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
      errorText: props.errorText ? props.errorText : false
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
    this.onChangeDialCode(value);
  }

  /**
   * @func
   * @desc set phone value and call onChange callback
   * @param event
   * @param phone
   */
  handleChangePhone(event, phone) {
    if (this.props.maxLength && phone.length > this.props.maxLength) {
        return;
    }
    this.setState({phone});
    this.onChangePhone(phone);
  }

  /**
   * @func
   * @desc check props onChangePhone and call it
   */
  onChangePhone(phone?: number) {
    if (this.props.onChange) {
      this.props.onChange(`${this.state.dialCode}-${phone}`);
    }
    if (this.props.checkEmpty) {
        phone ? this.props.checkEmpty(false) : this.props.checkEmpty(true);
    }
  }

    /**
     * @func
     * @desc check props onChangeDialCode and call it
     */
    onChangeDialCode(dialCode?: number) {
        if (this.props.onChange) {
            this.props.onChange(`${dialCode}-${this.state.dialCode}`);
        }
    }

  componentWillReceiveProps(nextProps) {
      if (nextProps.errorText || nextProps.errorText === false) {
          this.setState({errorText: nextProps.errorText});
      }
  }
  public render() {
    return (
      <div className={`phone-input ${this.props.className}`}>
        <div className="flag-wrapper">
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
            hintText={this.i18n._t("Mobile Phone Number").toString()}
            errorText={this.state.errorText ? this.state.errorText : null}
            type="number"
            onChange={this.handleChangePhone.bind(this)}
            fullWidth={true}
            value={this.state.phone ? this.state.phone : ""}
            className={"spin-btn-hide"}
          />
        </div>
      </div>
    );
  }
}
