import * as React from "react";
import {Card, Form, message, Row} from "antd";
import {RaisedButton, TextField} from "material-ui";
import I18n from "../../../../services/i18n/index";
import Translate from "../../../../components/i18n/Translate/index";
import Icon from "../../../../components/Icon/index";
import {UserApi} from "../../../../api/api";
import {FormComponentProps} from "antd/es/form/Form";
import PasswordStrength from "../../../../components/PasswordStrength/index";
import Resend from "./Resend/index";

const FormItem = Form.Item;

interface IProp extends FormComponentProps {
}

/**
 *
 * State
 *
 */
interface IState {
  step: STEPS;
  email: string | null;
  confirmDirty: boolean;
}

/**
 * Steps
 *
 */
enum STEPS {RECOVERY, VERIFY, NEWPASSWORD}


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
      confirmDirty: false
    };

    //bind form function in constructor
    this.submitForm = this.submitForm.bind(this);
  }

  //translation
  private i18n = I18n.getInstance();

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
        console.log("then", data);
        this.setState({step: STEPS.VERIFY});
      }).catch(err => {
        message.error(err.error.text);
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
    const numberExample = "123456789";
    if (code === numberExample) {
      this.setState({step: STEPS.NEWPASSWORD});
    } else {
      message.error("Wrong verify code");
    }
    console.log("verify", code);
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
    console.log("send change password", pass, confirm);
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
        this.changePassword(values.password, values.confirm)
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
  private checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], {force: true}, callback);
    }
    callback();
  }

  private checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback(this.i18n._t("Two passwords that you enter is inconsistent!"));
    } else {
      callback();
    }
  }

  public render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Row className="full-screen" type="flex" align="middle" justify="center">
        <div>
          <Row className="logo-img" align="middle" justify="center"/>
          <Card className="login-box" noHovering>
            <h5 className="text-center">
              {this.state.step === STEPS.RECOVERY && this.i18n._t("Please enter your email address")}
              {this.state.step === STEPS.VERIFY && this.i18n._t("Enter your verify code")}
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
                      required: true, message: "Please input your username!"
                    }],
                })(
                  <TextField
                    fullWidth={true}
                    floatingLabelText="Email"
                    hintText={"example@example.com"}
                    autoFocus={true}
                  />
                )}
              </FormItem>
              }
              {this.state.step === STEPS.VERIFY &&
              <FormItem className="login-input">
                {getFieldDecorator("verifyCode", {
                  rules: [{
                    required: true, message: "Please input your verify code!"
                  }],
                })(
                  <TextField
                    fullWidth={true}
                    floatingLabelText="verify code"
                    hintText={"123456789"}
                    autoFocus={true}
                  />
                )}
              </FormItem>
              }
              {this.state.step === STEPS.NEWPASSWORD &&
              <div>
                <FormItem>
                  {getFieldDecorator("password", {
                    rules: [{
                      required: true, message: "Please input your password!"
                    }, {
                      validator: this.checkConfirm,
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
                      validator: this.checkPassword,
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
                  label={<Translate value="Send recover password"/>}
                  primary={true}
                  className="button-full-width"
                  icon={<Icon name="arrow"/>}
                />
                }
                {this.state.step === STEPS.VERIFY &&
                <div>
                  <RaisedButton
                    type="submit"
                    label={<Translate value="Verify your code"/>}
                    primary={true}
                    className="button-full-width"
                    icon={<Icon name="arrow"/>}
                  />
                  <Resend seconds={10} email={this.state.email}/>
                </div>
                }
                {this.state.step === STEPS.NEWPASSWORD &&
                <RaisedButton
                  type="submit"
                  label={<Translate value="Change password"/>}
                  primary={true}
                  className="button-full-width"
                  icon={<Icon name="arrow"/>}
                />
                }
              </FormItem>
            </Form>
          </Card>
        </div>
      </Row>
    );
  }
}

export default Form.create()(PublicRecoverPassword as any);