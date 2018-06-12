import * as React from "react";
import {Card, Form, message, Row, notification} from "antd";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import I18n from "../../../../services/i18n/index";
import Translate from "../../../../components/i18n/Translate/index";
import Icon from "../../../../components/Icon/index";
import {UserApi, UserResponseLoginOKAccount} from "../../../../api/api";
import {WrappedFormUtils} from "antd/es/form/Form";
import PasswordStrength from "../../../../components/PasswordStrength/index";
import Resend from "./Resend/index";
import {connect} from "react-redux";
import {setIsLogin, setUser} from "../../../../redux/app/actions/index";
import {RouteComponentProps, withRouter} from "react-router";
import AAA from "../../../../services/AAA/index";
import CONFIG from "../../../../constants/config";
import "./style.less";
import {Link} from "react-router-dom";

const FormItem = Form.Item;

interface IProp extends RouteComponentProps<any> {
  setUser: (user: UserResponseLoginOKAccount) => {};
  setIsLogin: () => {};
  form: WrappedFormUtils;
}

/**
 *
 * @interface State
 *
 */
interface IState {
  step: STEPS;
  email: string | null;
  confirmDirty: boolean;
  token: string | null;
  disableRecoverBtn: boolean;
}

/**
 * @interface Steps
 *
 */
enum STEPS {RECOVERY, VERIFY, NEWPASSWORD}

@connect(mapStateToProps, mapDispatchToProps)
  /**
   * Password recovery
   *
   * @class
   */
class PublicRecoverPassword extends React.Component<IProp, IState> {
  constructor(props: IProp) {
    super(props);

    this.state = {
      step: STEPS.RECOVERY,
      email: null,
      confirmDirty: false,
      token: null,
      disableRecoverBtn: true,
    };

    // bind form function in constructor
    this.submitForm = this.submitForm.bind(this);
    this.handleRecoverBtn = this.handleRecoverBtn.bind(this);
  }

  // translation
  private i18n = I18n.getInstance();

  private aaa = AAA.getInstance();


  public componentDidMount() {
    if (this.props.match.params["token"]) {
      this.submitVerificationFromUrl();
    }
  }

  private submitVerificationFromUrl() {
    const verifyApi = new UserApi();
    verifyApi.userPasswordVerifyTokenGet({
      token: this.props.match.params["token"]
    }).then(data => {
      this.setState({token: data.token, step: STEPS.NEWPASSWORD});
    }).catch(err => {
      this.props.history.push("/");
      message.error(err.error.text);
    });
  }

  /**
   * Check email for recovery password
   *
   * @func
   *
   * @param email
   */
  private forgotPassword(email) {
    this.setState({email: email}, () => {
      const recoverApi = new UserApi();
      recoverApi.userPasswordForgetPost({
        payloadData: {
          email: this.state.email
        }
      }).then(data => {
        this.setState({step: STEPS.VERIFY});
      }).catch(err => {
          notification.error({
              message: this.i18n._t("Something went wrong"),
              className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
              description: err.status === 400 ? this.i18n._t(err.text).toString() : null ,
          });
      });
    });
  }

  /**
   * Check verify code
   *
   * @func
   *
   * @param code
   */
  private verifyCode(code) {
    const verifyPassApi = new UserApi();
    verifyPassApi.userPasswordVerifyPost({
      payloadData: {
        code: code,
        email: this.state.email
      }
    }).then(data => {
      this.setState({token: data.token, step: STEPS.NEWPASSWORD});
    }).catch(err => {
      notification.error({
        message: this.i18n._t("Email Verification!"),
        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
        description: err.status === 403 ? this.i18n._t("Your code is invalid!").toString() : this.i18n._t("Please check all fields and try again!").toString(),
      });
    });
  }

  /**
   * Change new password
   *
   * @func
   *
   * @param pass
   * @param confirm
   */
  private changePassword(pass, confirm) {
    const changePassApi = new UserApi();
    changePassApi.userPasswordChangeTokenPut({
      token: this.state.token,
      payloadData: {
        new_password: confirm
      }
    }).then((data) => {
      // set token too cookie
      this.aaa.setToken(data.token);

      this.props.setUser(data.account);
      this.props.setIsLogin();
      this.props.history.push("/");
      message.success(this.i18n._t("You are successfully login"));

    }).catch(err => {
      message.error(err.error.text);
    });

  }

  /**
   * Form handler
   *
   * @func
   *
   * @param e
   */
  private submitForm(e) {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error(this.i18n._t("Please fill the field with correct data."));
        return;
      }

      if (values.email) {
        this.forgotPassword(values.email);
      }

      if (values.verifyCode) {
        this.verifyCode(values.verifyCode);
      }

      if (values.password && values.confirm) {
        this.changePassword(values.password, values.confirm);
      }
    });
  }

  /**
   * Check password confirmation
   *
   * @func
   *
   * @param rule
   * @param value
   * @param callback
   */
  private checkConfirm(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], {force: true}, callback);
    }
    callback();
  }

  private checkPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback(this.i18n._t("Two passwords that you enter is inconsistent!"));
    } else {
      callback();
    }
  }
    public handleRecoverBtn() {
        this.props.form.validateFields((err, values) => {
            if (err && err.email) {
                this.setState({
                    disableRecoverBtn: true,
                });
            } else {
                this.setState({
                    disableRecoverBtn: false,
                });
            }
        });
    }

  public render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Row className="full-screen" type="flex" align="middle" justify="center">
        <div dir={CONFIG.DIR}>
          <Row className="logo-wrapper" align="middle" justify="center">
            <Icon className={"login-logo"} name={"cif-cylogo-without-typo"}/>
          </Row>
            <a onClick={() => {
                this.props.history.push("/");
            }}>
                <div className={"back-text-wrapper"}>
                    <h6 className="back-button">{this.i18n._t("Back")}</h6>
                    <Icon name={"cif-arrowleft-4"} className={"back-arrow"}/>
                </div>
            </a>
          <Card className="login-box" noHovering>
            <h5 className="text-center login-box-title">
              {this.state.step === STEPS.RECOVERY && this.i18n._t("Please enter your email address")}
              {this.state.step === STEPS.NEWPASSWORD && this.i18n._t("Enter new password")}
            </h5>
            <Form onSubmit={this.submitForm}>
              {this.state.step === STEPS.RECOVERY &&
              <FormItem className="login-input">
                {getFieldDecorator("email", {
                  rules: [
                    {
                      type: "email", message: "The input is not valid E-mail",
                    }, {
                      required: true, message: this.i18n._t("Please input your email!").toString(),
                    }],
                })(
                  <TextField
                    type={"email"}
                    className={"input-login"}
                    fullWidth={true}
                    hintText={this.i18n._t("Email")}
                    autoFocus={true}
                    onKeyUp={this.handleRecoverBtn}
                  />
                )}
              </FormItem>
              }
              {this.state.step === STEPS.VERIFY &&
              <div className="email-sent-card">
                  <div>
                  <Icon name={"cif-verifymail"} className={"verify-email-icon"}/>
                  </div>
                  <span className={"recover-password-message"}><Translate value={"An email of change password link has been sent to you, this link is only valid for 48 hours."}/></span>
              </div>
              }
              {this.state.step === STEPS.NEWPASSWORD &&
              <div>
                <FormItem>
                  {getFieldDecorator("password", {
                    rules: [{
                      required: true, message: "Please input your password!"
                    }, {
                      validator: this.checkConfirm.bind(this),
                    }],
                  })(
                    <PasswordStrength
                      fullWidth={true}
                      floatingLabelText={this.i18n._t("New password")}
                      type="password"
                      autoFocus={true}
                    />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator("confirm", {
                    rules: [{
                      required: true, message: "Please confirm your password!"
                    }, {
                      validator: this.checkPassword.bind(this),
                    }],
                  })(
                    <TextField
                      fullWidth={true}
                      type="password"
                      floatingLabelText={"confirm password"}
                    />
                  )}
                </FormItem>
              </div>
              }
              <FormItem>
                {this.state.step === STEPS.RECOVERY &&
                <RaisedButton
                  type="submit"
                  disabled={this.state.disableRecoverBtn}
                  label={<Translate value="Send recover password"/>}
                  primary={true}
                  className="button-full-width button-login-next-step"
                  icon={<Icon name="arrow"/>}
                />
                }
                {this.state.step === STEPS.NEWPASSWORD &&
                <RaisedButton
                  type="submit"
                  label={<Translate value="Change password"/>}
                  primary={true}
                  className="button-full-width button-login-next-step"
                  icon={<Icon name="arrow"/>}
                />
                }
              </FormItem>
            </Form>
          </Card>
            <Row className="text-center forgot-password">
                <p>
                    <Translate value="Do you have an account?"/>
                </p>
                <h5>
                    <Link to={`/`}>
                        <Translate value="Sign in"/>
                    </Link>
                </h5>
            </Row>
        </div>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    //   isLogin: state.app.isLogin,
    //   user: state.app.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUser: (user: UserResponseLoginOKAccount) => dispatch(setUser(user)),
    setIsLogin: () => dispatch(setIsLogin()),
  };
}


export default withRouter<any>(Form.create()(PublicRecoverPassword as any));
