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
import {RaisedButton, TextField, Toggle} from "material-ui";
import {setIsLogin, setUser} from "../../../../redux/app/actions/index";
import Icon from "../../../../components/Icon/index";
import CONFIG from "../../../../constants/config";

import "./style.less";

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


@connect(mapStateToProps, mapDispatchToProps)
class CheckMail extends React.Component<IProps, IState> {

  private i18n = I18n.getInstance();

  constructor(props: IProps) {
    super(props);
    const email = localStorage.getItem(CONFIG.COOKIES_PREFIX + "CHECKED_MAIL") || "";
    this.state = {
      email,
      disableLoginBtn: email ? false : true,
      disablePassBtn: email ? false : true,
    };
  }

  public componentDidMount() {
    if (this.props.isLogin) {
      this.props.history.push("/");
    }
  }

  public handleBtn() {
    this.props.form.validateFields((err, values) => {
        if (err) {
            this.setState({
                disableLoginBtn: true,
            });
        } else {
            this.setState({
                disableLoginBtn: false,
            });
        }
    });
  }

  private submitMail(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        this.setState({
          email: values.email
        });
        if (!err) {
          const api = new UserApi();
          api.userMailCheckPost({
            payloadData: {email: values.email},
          }).then((data) => {
            localStorage.setItem(CONFIG.COOKIES_PREFIX + "CHECKED_MAIL", values.email);
            if (data.current_domain) {
              this.props.history.push("/user/login");
            } else if (data.domains.length > 0) {
              // todo:: handle if user has not account in this domain
              message.error(this.i18n._t("You don t'have account in this site!"));
            } else {
              this.props.history.push("/user/register");
            }

          }).catch((err) => {
            notification.error({
              message: this.i18n._t("Check mail Failed").toString(),
              className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
              description: this.i18n._t("Please check your email and try again").toString(),
            });

          });
        }
      }
    );
  }

  public render() {
    const mailPlaceHolder = this.i18n._t("Email");
    const {getFieldDecorator} = this.props.form;

    return (
      <Row className="full-screen" type="flex" align="middle" justify="center">
        <div dir={CONFIG.DIR}>
          <Row className="logo-wrapper" align="middle" justify="center">
            <Icon className={"login-logo"} name={"cif-cylogo-without-typo"}/>
          </Row>

          <Card className="login-box" noHovering>
            <h5 className="text-center login-box-title">
              <Translate value="Enter your email address"/>
            </h5>
            <form onSubmit={this.submitMail.bind(this)}>
              <FormItem className="login-input hide-ant-error">
                {getFieldDecorator("email", {
                  initialValue: this.state.email,
                  rules: [{required: true, type: "email", message: this.i18n._t("Please enter a valid email!")}],
                })(
                  <TextField
                    className={"login-textfield"}
                    fullWidth={true}
                    hintText={mailPlaceHolder}
                    autoFocus={true}
                    type={"email"}
                    onChange={() => this.handleBtn()}
                    onKeyUp={() => this.handleBtn()}
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
                              name="cif-arrowleft-4"/>}
                />
              </FormItem>
            </form>
          </Card>

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

export default Form.create()(withRouter(CheckMail as any));
