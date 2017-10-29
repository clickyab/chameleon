///<reference path="../../../../../node_modules/@types/react-router/index.d.ts"/>
import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import Translate from "../../../../components/i18n/Translate/index";
import {UserApi, UserResponseLoginOKAccount} from "../../../../api/api";
import {Card, Col, Form, message, notification, Row , Switch} from "antd";
import {Checkbox, FontIcon, RaisedButton, TextField, Toggle} from "material-ui";
import {setIsLogin, setUser} from "../../../../redux/app/actions/index";
import AAA from "../../../../services/AAA/index";
import Icon from "../../../../components/Icon/index";
import PasswordStrength from "../../../../components/PasswordStrength/index";

import "./style.less";
import PhoneInput from "../../../../components/PhoneInput/index";
import CONFIG from "../../../../constants/config";
import Resend from "../RecoverPassword/Resend/index";

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
  disableLoginBtn: boolean;
  disablePassBtn: boolean;
}

enum STEPS { CHECK_MAIL, LOGIN, REGISTER, VERIFICATION}

@connect(mapStateToProps, mapDispatchToProps)
class PublicLoginForm extends React.Component<IProps, IState> {

  private i18n = I18n.getInstance();

  constructor(props: IProps) {
    super(props);
    this.state = {
      email: "",
      step: props.match.params["token"] ? STEPS.VERIFICATION : STEPS.CHECK_MAIL,
      isCorporation: false,
      disableLoginBtn: true,
      disablePassBtn: true,
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

  public handleBtn() {
    this.props.form.validateFields((err, values) => {
      (err) ? this.setState({disableLoginBtn: true}) : this.setState({disableLoginBtn: false});
    });
  }
  public handlePassBtn(value) {
    (value.length > 7 ) ? this.setState({disablePassBtn: false}) : this.setState({disablePassBtn: true});
  }

  public render() {
    const mailPlaceHolder = this.i18n._t("Email");
    const passwordPlaceHolder = this.i18n._t("Password");
    const {getFieldDecorator} = this.props.form;

    return (
      <Row className="full-screen" type="flex" align="middle" justify="center">
        <div dir={CONFIG.DIR}>
          <Row className="logo-wrapper" align="middle" justify="center">
            <Icon className={"login-logo"} name={"cif-cylogo-without-typo"}/>
          </Row>
          {this.state.step === STEPS.CHECK_MAIL &&
          <Card className="login-box" noHovering>
            <h5 className="text-center">
              <Translate value="Enter your email address"/>
            </h5>
            <form onSubmit={this.submitMail.bind(this)}>
              <FormItem className="login-input">
                {getFieldDecorator("email", {
                  rules: [{required: true, type: "email", message: "Please input a valid email!"}],
                })(
                  <TextField
                    fullWidth={true}
                    hintText={mailPlaceHolder}
                    autoFocus={true}
                    type={"email"}
                    onChange={ () => this.handleBtn()}
                    onKeyUp={ () => this.handleBtn()}
                    autoComplete="off"
                  />
                )}
              </FormItem>
              <FormItem className="button-login-wrapper">
                <RaisedButton
                  type="submit"
                  label={<Translate value="Next Step"/>}
                  primary={true}
                  className="button-full-width button-login-next-step"
                  disabled={this.state.disableLoginBtn}
                  icon={<Icon className={(CONFIG.DIR === "rtl") ? "btn-arrow-rtl" : "btn-arrow"}
                              name="cif-arrowleft-4" />}
                />
              </FormItem>
            </form>
          </Card>
          }
          {this.state.step === STEPS.LOGIN &&
          <a onClick={() => {
            this.setState({
              step: STEPS.CHECK_MAIL,
            });
          }}>
            <div className={"back-text-wrapper"}>
              <h6 className="back-button">{this.i18n._t("Back")}</h6>
              <Icon name={"cif-arrowleft-4"} className={"back-arrow"} />
            </div>
          </a>
          }
          {this.state.step === STEPS.LOGIN &&
          <Card className="login-box" noHovering>
            <h5 className="text-center">
              <Translate value="You try to login with this email:"/>
              <br/>
              {this.state.email}
            </h5>
            <form onSubmit={this.submitLogin.bind(this)}>
              <FormItem>
                {getFieldDecorator("password", {
                  rules: [{required: true, message: "Please input your username!"}],
                })(
                  <TextField
                    fullWidth={true}
                    type="password"
                    hintText={passwordPlaceHolder}
                    autoFocus={true}
                    onChange={(event , val) => { this.handlePassBtn(val); }}
                  />
                )}
              </FormItem>
              <FormItem>
                <div className="custom-checkbox">
                {getFieldDecorator("rememberMe")(
                  <Checkbox  label={this.i18n._t("Remember me")}/>
                )}
                </div>
              </FormItem>
              <FormItem>
                <RaisedButton
                  type="submit"
                  label={<Translate value="Enter"/>}
                  primary={true}
                  className="button-full-width"
                  icon={<Icon className={(CONFIG.DIR === "rtl") ? "btn-arrow-rtl" : "btn-arrow"}
                              name={"cif-arrowleft-4"}/>}
                  disabled={this.state.disablePassBtn}
                />
              </FormItem>
            </form>
          </Card>
          }
          {this.state.step === STEPS.REGISTER &&
          <a onClick={() => {
            this.setState({
              step: STEPS.CHECK_MAIL,
            });
          }}>
            <div className={"back-text-wrapper"}>
            <h6 className="back-button">{this.i18n._t("Back")}</h6>
            <Icon name={"cif-arrowleft-4"} className={"back-arrow"} />
            </div>
          </a>
          }
          {this.state.step === STEPS.REGISTER &&
          <Card className="login-box" noHovering>
            <form onSubmit={this.submitRegister.bind(this)}>
              <Row type="flex" gutter={16}>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("firstName", {
                      rules: [{required: true, message: "Please input your first name!"}],
                    })(
                      <TextField
                        fullWidth={true}
                        floatingLabelText={this.i18n._t("Name")}
                        autoFocus={true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("lastName", {
                      rules: [{required: true, message: "Please input your last name!"}],
                    })(
                      <TextField
                        fullWidth={true}
                        floatingLabelText={this.i18n._t("Family")}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <FormItem>
                {getFieldDecorator("email", {
                  initialValue: this.state.email,
                  rules: [{required: true, message: "Please input your email!"}],
                })(
                  <TextField
                    fullWidth={true}
                    floatingLabelText={this.i18n._t("Email")}
                    disabled={true}
                    type={"email"}
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator("password", {
                  rules: [{required: true, message: "Please input your password!"}],
                })(
                  <PasswordStrength
                    fullWidth={true}
                    floatingLabelText={this.i18n._t("Password")}
                    type="password"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator("mobile", {
                  rules: [{required: true, message: "Please input your phone!"}],
                })(
                  <PhoneInput/>
                )}
              </FormItem>
              <FormItem>
                <Translate value={"Is corporation?"}/>
                <Switch className={CONFIG.DIR === "rtl" ? "switch-rtl" : "switch"}
                          onChange ={(e) => (this.setState({isCorporation: !this.state.isCorporation}))} />
              </FormItem>
              {this.state.isCorporation &&
              <FormItem>
                {getFieldDecorator("companyName", {
                  rules: [{required: this.state.isCorporation, message: "Please input your company name!"}],
                })(
                  <TextField
                    fullWidth={true}
                    floatingLabelText={this.i18n._t("Company Name")}
                  />
                )}
              </FormItem>
              }
              <FormItem>
                <RaisedButton
                  type="submit"
                  label={<Translate value="Next Step"/>}
                  primary={true}
                  className="button-full-width"
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
                  rules: [{required: true, message: "Please input your verification code!"}],
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
                  className="button-full-width"
                />
              </FormItem>
            </form>
          </Card>
          }
          {this.state.step !== STEPS.REGISTER && this.state.step !== STEPS.LOGIN && this.state.step !== STEPS.VERIFICATION &&
          <Row className="text-center forgot-password">
            <p>
              <Translate value="Do you Forgot your password?"/>
            </p>
            <h5>
              <Link to={`/user/recover-password`}>
                <Translate value="Recover"/>
              </Link>
            </h5>
          </Row>
          }
        </div>
      </Row>
    );
  }

  private submitLogin(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error(this.i18n._t("Please fill all fields."));
        return;
      }

      const userApi = new UserApi();
      userApi.userLoginPost({
        payloadData: {
          email: this.state.email,
          password: values.password
        }
      })
        .then((data) => {

          // store account data in store
          this.props.setUser(data.account);
          this.props.setIsLogin();

          const aaa = AAA.getInstance();
          aaa.setToken(data.token, values.rememberMe);

          // redirect to dashboard
          this.props.history.push("/dashboard");

          // show notification
          notification.success({
            message: this.i18n._t("You sign in successfully."),
            description: "",
          });
        })
        .catch((res) => {

          notification.error({
            message: "Login Failed",
            description: this.i18n._t(res.error.text).toString(),
          });

          if (res.error.text === "not verified.") {
            this.setState({
              step: STEPS.VERIFICATION
            });
          }
        });
    });
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
            message: "Registration Failed",
            description: this.i18n._t(error.error.text).toString(),
          });
        } else {
          let errors: string[] = [];
          Object.keys(error).map((key: string) => {
            errors.push(this.i18n._t(error[key].text).toString());
          });
          notification.error({
            message: "Registration Failed",
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


          // redirect to dashboard
          this.props.history.push("/dashboard");

          // show notification
          notification.success({
            message: "Registration",
            description: this.i18n._t("Your account created successfully.").toString(),
          });
        })
          .catch((error) => {
            notification.error({
              message: "Verification Failed",
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


        // redirect to dashboard
        this.props.history.push("/dashboard");

        // show notification
        notification.success({
          message: "Registration",
          description: this.i18n._t("Your account created successfully.").toString(),
        });
      })
      .catch((error) => {
        notification.error({
          message: "Verification Failed",
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
        message: "Resend Verification Code",
        description: this.i18n._t("Your verification has been sent.").toString(),
      });
    });
  }

  private submitMail(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        this.setState({
          email: values.email,
          step: STEPS.CHECK_MAIL,
        });
        if (!err) {
          const api = new UserApi();
          api.userMailCheckPost({
            payloadData: {email: values.email},
          }).then((data) => {
            if (data.current_domain) {
              this.setState({
                email: values.email,
                step: STEPS.LOGIN,
              });
            } else if (data.domains.length > 0) {
              message.error(this.i18n._t("You don t'have account in this site!"));
            } else {
              this.setState({
                email: values.email,
                step: STEPS.REGISTER,
              });
            }

          }).catch((err) => {
            notification.error({
              message: "Check mail Failed",
              description: this.i18n._t("Please check your email and try again").toString(),
            });

          });
        }
      }
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

export default Form.create()(withRouter(PublicLoginForm as any));
