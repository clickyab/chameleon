///<reference path="../../../../../node_modules/@types/react-router/index.d.ts"/>
import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import Translate from "../../../../components/i18n/Translate/index";
import {UserApi, UserResponseLoginOKAccount} from "../../../../api/api";
import {Card, Col, Form, message, notification, Row, Switch} from "antd";
import {RaisedButton, TextField} from "material-ui";
import {setIsLogin, setUser} from "../../../../redux/app/actions/index";
import AAA from "../../../../services/AAA/index";
import Icon from "../../../../components/Icon/index";
import PasswordStrength from "../../../../components/PasswordStrength/index";

import "./style.less";
import PhoneInput from "../../../../components/PhoneInput/index";
import CONFIG from "../../../../constants/config";
import Resend from "../RecoverPassword/Resend/index";
import ServerStore from "../../../../services/ServerStore";

const FormItem = Form.Item;

interface IProps extends RouteComponentProps<void> {
  isLogin: boolean;
  user: UserResponseLoginOKAccount;
  setUser: (user: UserResponseLoginOKAccount) => {};
  setIsLogin: () => {};
  form: any;
}

interface IState {
  email: string;
  isCorporation: boolean;
  step: STEPS;
  disablePassBtn: boolean;
  errorFirstName: boolean;
  errorLastname: boolean;
  errorPassword: boolean;
  errorMobile: boolean;
}

enum STEPS {REGISTER, VERIFICATION}

@connect(mapStateToProps, mapDispatchToProps)
class RegisterForm extends React.Component<IProps, IState> {

  private i18n = I18n.getInstance();

  constructor(props: IProps) {
    super(props);

    const email = localStorage.getItem(CONFIG.COOKIES_PREFIX + "CHECKED_MAIL");
    if (!email && !props.match.params["token"]) {
      this.props.history.push("/");
    }
    this.state = {
      email,
      step: props.match.params["token"] ? STEPS.VERIFICATION : STEPS.REGISTER,
      isCorporation: false,
      disablePassBtn: true,
      errorFirstName: false,
      errorLastname: false,
      errorPassword: false,
      errorMobile: false,
    };
  }

  public componentDidMount() {
    if (this.props.isLogin) {
      this.props.history.push("/");
    }

    if (this.props.match.params["token"]) {
      this.submitVerificationFromUrl();
    }
  }


  private submitRegister(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const userApi = new UserApi();
      userApi.userRegisterPost({
        payloadData: {
          email: this.state.email,
          first_name: values.firstName,
          last_name: values.lastName,
          mobile: values.mobile,
          password: values.password,
          legal_name: values.companyName,
        }
      }).then((data) => {

        this.setState({
          step: STEPS.VERIFICATION
        });

      }).catch((error) => {
        if (error.error) {
          notification.error({
            message: this.i18n._t("Registration Failed").toString(),
            className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
            description: this.i18n._t(error.error.text).toString(),
          });
        } else {
          let errors: string[] = [];
          Object.keys(error).map((key: string) => {
            errors.push(this.i18n._t(error[key].text).toString());
          });
          notification.error({
            message: this.i18n._t("Registration Failed").toString(),
            className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
            description: errors.join("<br>"),
          });
        }
      });
    });
  }

  private submitVerification(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const api = new UserApi();
        api.userEmailVerifyPost({
          payloadData: {
            email: this.state.email,
            code: values.number,
          },
        }).then((data) => {

          // store account data in store
          this.props.setUser(data.account);
          this.props.setIsLogin();


          const aaa = AAA.getInstance();
          aaa.setToken(data.token, true);

          ServerStore.getInstance().removeItem(CONFIG.COOKIES_PREFIX + "CHECKED_MAIL");

          // redirect to dashboard
          this.props.history.push("/dashboard");

          // show notification
          notification.success({
            message: this.i18n._t("Registration"),
            className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
            description: this.i18n._t("Your account created successfully.").toString(),
          });
        })
          .catch((error) => {
            notification.error({
              message: this.i18n._t("Verification Failed").toString(),
              className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
              description: this.i18n._t(error.error.text).toString(),
            });
          });
      }
    });
  }

  private submitVerificationFromUrl() {
    // fixme :: change api call to specific method for verification by hash code
    const api = new UserApi();
    api.userEmailVerifyTokenGet({
      token: this.props.match.params["token"],
    })
      .then((data) => {

        // store account data in store
        this.props.setUser(data.account);
        this.props.setIsLogin();


        const aaa = AAA.getInstance();
        aaa.setToken(data.token, true);

        localStorage.removeItem(CONFIG.COOKIES_PREFIX + "CHECKED_MAIL");

        // redirect to dashboard
        this.props.history.push("/dashboard");

        // show notification
        notification.success({
          message: this.i18n._t("Registration"),
          className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
          description: this.i18n._t("Your account created successfully.").toString(),
        });
      })
      .catch((error) => {
        notification.error({
          message: this.i18n._t("Verification Failed").toString(),
          className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
          description: this.i18n._t(error.statusText).toString(),
        });
      });
  }

  private resendVerificationCode() {
    const api = new UserApi();
    api.userEmailVerifyResendPost({
      // todo : modify after fix "email_string" with backend guys
      payloadData: {
        email: this.state.email,
      }
    }).then(() => {
      notification.success({
        message: this.i18n._t("Resend Verification Code"),
        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
        description: this.i18n._t("Your verification has been sent.").toString(),
      });
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

          {this.state.step === STEPS.REGISTER &&
          <a onClick={() => {
            this.props.history.push("/");
          }}>
            <div className={"back-text-wrapper"}>
              <h6 className="back-button">{this.i18n._t("Back")}</h6>
              <Icon name={"cif-arrowleft-4"} className={"back-arrow"}/>
            </div>
          </a>
          }
          {this.state.step === STEPS.REGISTER &&
          <Card className="login-box" noHovering>
            <form onSubmit={this.submitRegister.bind(this)}>
              <Row type="flex" gutter={16}>
                <Col span={12}>
                  <FormItem className={"hide-ant-error"}>
                    {getFieldDecorator("firstName", {
                      rules: [{required: true, message: this.i18n._t("Please enter your first name!").toString()}],
                    })(
                      <TextField
                        required
                        fullWidth={true}
                        hintText={this.i18n._t("Name")}
                        autoFocus={true}
                        className={"input-login"}
                        errorText={this.state.errorFirstName ? this.i18n._t("Please input your first name!") : false}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem className={"hide-ant-error"}>
                    {getFieldDecorator("lastName", {
                      rules: [{required: true, message: this.i18n._t("Please enter your last name!")}],
                    })(
                      <TextField
                        required
                        fullWidth={true}
                        hintText={this.i18n._t("Last name")}
                        className={"input-login"}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <FormItem className={"hide-ant-error remove-disable-style"}>
                {getFieldDecorator("email", {
                  initialValue: this.state.email,
                  rules: [{required: true, message: this.i18n._t("Please enter your email!")}],
                })(
                  <TextField
                    fullWidth={true}
                    hintText={this.i18n._t("Email")}
                    disabled={true}
                    type={"email"}
                    className={"input-login"}
                  />
                )}
              </FormItem>
              <FormItem className={"hide-ant-error"}>
                {getFieldDecorator("password", {
                  rules: [{required: true, message: this.i18n._t("Please enter your password!")}],
                })(
                  <PasswordStrength
                    required
                    fullWidth={true}
                    hintText={this.i18n._t("Password")}
                    className={"input-login"}
                    type="password"
                    errorText={this.state.errorPassword  ? this.i18n._t("Please enter your password!") : false}
                  />
                )}
              </FormItem>
              <FormItem className={"hide-ant-error"}>
                {getFieldDecorator("mobile", {
                  rules: [{required: true, message: this.i18n._t("Please input your mobile number!")}],
                })(
                  <PhoneInput
                      maxLength={11}
                      className={this.state.errorMobile ? "mb-2" : ""}
                      checkEmpty={(isEmpty) => this.setState({errorMobile: isEmpty })}
                      errorText={this.state.errorMobile ? this.i18n._t("Please input your mobile number!") as string : false }
                  />
                )}
              </FormItem>
              <FormItem className={"corporation-wrapper"}>
                <Switch className={CONFIG.DIR === "rtl" ? "switch-rtl" : "switch"}
                        onChange={(e) => (this.setState({isCorporation: !this.state.isCorporation}))}
                        size={"small"}
                />
                <span className={"corporation-text"}><Translate value={"Is corporation?"}/></span>
              </FormItem>
              {this.state.isCorporation &&
              <FormItem>
                {getFieldDecorator("companyName", {
                  rules: [{required: this.state.isCorporation, message: this.i18n._t("Please input your company name!")}],
                })(
                  <TextField
                    fullWidth={true}
                    hintText={this.i18n._t("Company Name")}
                    className={"input-login"}
                  />
                )}
              </FormItem>
              }
              <FormItem>
                <RaisedButton
                  type="submit"
                  label={<Translate value="Next Step"/>}
                  primary={true}
                  className="button-full-width button-login-next-step"
                  icon={<Icon className={(CONFIG.DIR === "rtl") ? "btn-arrow-rtl" : "btn-arrow"}
                              name={"cif-arrowleft-4"}/>}
                />
              </FormItem>
            </form>
          </Card>
          }
          {this.state.step === STEPS.VERIFICATION &&
          <Card className="login-box" noHovering>
            <h5 className="text-center">
              {this.state.email}
            </h5>
            <div className="text-center mb-3">
              <Translate value={"Check your email for verification code that has been sent to your email."}/>
            </div>
            <form onSubmit={this.submitVerification.bind(this)}>
              <FormItem>
                {getFieldDecorator("number", {
                  rules: [{required: true, message: this.i18n._t("Please input your verification code!")}],
                })(
                  <TextField
                    fullWidth={true}
                    type="number"
                    hintText={this.i18n._t("verification code")}
                    autoFocus={true}
                    className="spin-btn-hide placeholder-center"
                  />
                )}
              </FormItem>
              <Row className="text-center mb-3">
                <Resend seconds={120}
                        onClick={this.resendVerificationCode.bind(this)}
                        className={"verify-link"}
                />
              </Row>
              <FormItem>
                <RaisedButton
                  type="submit"
                  label={<Translate value="verify"/>}
                  primary={true}
                  className="button-full-width button-login-next-step"
                />
              </FormItem>
            </form>
          </Card>
          }
        </div>
      </Row>
    );
  }

}

function mapStateToProps(state: RootState) {
  return {
    isLogin: state.app.isLogin,
    user: state.app.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUser: (user: UserResponseLoginOKAccount) => dispatch(setUser(user)),
    setIsLogin: () => dispatch(setIsLogin()),
  };
}

export default Form.create()(withRouter(RegisterForm as any));
