///<reference path="../../../../../node_modules/@types/react-router/index.d.ts"/>
import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import Translate from "../../../../components/i18n/Translate/index";
import {UserApi, UserResponseLoginOKAccount} from "../../../../api/api";
import {Card, Col, Form, message, notification, Row, Switch} from "antd";
import {Checkbox, FontIcon, RaisedButton, TextField, Toggle} from "material-ui";
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
  disableLoginBtn: boolean;
  disablePassBtn: boolean;
}

enum STEPS { CHECK_MAIL, LOGIN, REGISTER, VERIFICATION}

@connect(mapStateToProps, mapDispatchToProps)
class PublicLoginForm extends React.Component<IProps, IState> {

  private i18n = I18n.getInstance();

  constructor(props: IProps) {
    super(props);
    const email = localStorage.getItem(CONFIG.COOKIES_PREFIX + "CHECKED_MAIL");
    if (!email) {
      this.props.history.push("/");
    }
    this.state = {
      email,
      disableLoginBtn: true,
      disablePassBtn: true,
    };
  }

  public componentDidMount() {
    if (this.props.isLogin) {
      this.props.history.push("/");
    }

  }

  public handlePassBtn(value) {
    (value.length > 5) ? this.setState({disablePassBtn: false}) : this.setState({disablePassBtn: true});
  }

  private submitLogin(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error(this.i18n._t("Please fill all fields."));
        return;
      }
      // // TODO remove line below needed for debug purpose only
      // this.props.setIsLogin();
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

          ServerStore.getInstance().setItems(data.account.attributes);
          console.log(ServerStore.getInstance());

          const aaa = AAA.getInstance();
          aaa.setToken(data.token, values.rememberMe);

          ServerStore.getInstance().removeItem(CONFIG.COOKIES_PREFIX + "CHECKED_MAIL");

          // redirect to dashboard
          this.props.history.push("/dashboard");

          // show notification
          notification.success({
            message: this.i18n._t("You sign in successfully."),
            className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
            description: "",
          });
        })
        .catch((res) => {

          notification.error({
            message: this.i18n._t("Login Failed").toString(),
            className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
            description: this.i18n._t(res.error.text).toString(),
          });

        });
    });
  }


  public render() {
    const passwordPlaceHolder = this.i18n._t("Password");
    const {getFieldDecorator} = this.props.form;

    return (
      <Row className="full-screen" type="flex" align="middle" justify="center">
        <div dir={CONFIG.DIR}>
          <Row className="logo-wrapper" align="middle" justify="center">
            <Icon className={"login-logo"} name={"cif-cylogo-without-typo"}/>
          </Row>
          <a onClick={() => {
            this.props.history.push(`/user/auth`);
          }}>
            <div className={"back-text-wrapper"}>
              <h6 className="back-button">{this.i18n._t("Back")}</h6>
              <Icon name={"cif-arrowleft-4"} className={"back-arrow"}/>
            </div>
          </a>
          <Card className="login-box" noHovering>
            <h5 className="text-center login-box-title">
              <Translate value="You try to login with this email:"/>
              <br/>
              {this.state.email}
            </h5>
            <form onSubmit={this.submitLogin.bind(this)}>
              <FormItem>
                {getFieldDecorator("password", {
                  rules: [{required: true, message: this.i18n._t("Please input your username!")}],
                })(
                  <TextField
                    fullWidth={true}
                    type="password"
                    hintText={passwordPlaceHolder}
                    autoFocus={true}
                    onChange={(event, val) => {
                      this.handlePassBtn(val);
                    }}
                  />
                )}
              </FormItem>
              <FormItem>
                <div className="custom-checkbox">
                  {getFieldDecorator("rememberMe")(
                    <Checkbox label={this.i18n._t("Remember me")}/>
                  )}
                </div>
              </FormItem>
              <FormItem>
                <RaisedButton
                  type="submit"
                  label={<Translate value="Enter"/>}
                  primary={true}
                  className="button-full-width button-login-next-step"
                  icon={<Icon className={(CONFIG.DIR === "rtl") ? "btn-arrow-rtl" : "btn-arrow"}
                              name={"cif-arrowleft-4"}/>}
                  disabled={this.state.disablePassBtn}
                />
              </FormItem>
            </form>
          </Card>
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

export default Form.create()(withRouter(PublicLoginForm as any));
