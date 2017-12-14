/**
 * @file change password modal
 * @author Ehsan Hosseini
 * @desc open an modal and give new password and current password and make api call to change password
 */

import * as React from "react";
import Modal from "../../../../../../components/Modal/index";
import I18n from "../../../../../../services/i18n/index";
import {Form, Row, Col, notification} from "antd";
import {UserApi} from "../../../../../../api/api";
import {TextField} from "material-ui";
import PasswordStrength from "../../../../../../components/PasswordStrength/index";

const FormItem = Form.Item;

/**
 * @interface IProps
 */
interface IProps {
  form?: any;
  onOk?: () => void;
  onCancel?: () => void;
  visible: boolean;
}


/**
 * @interface IState
 */
interface IState {
  showPasswordModal: boolean;
}


class ChangePassword extends React.Component<IProps, IState> {
  /**
   * instance of i18n
   * @type {I18n}
   */
  private i18n = I18n.getInstance();


  /**
   * @constructor
   * @param {IProps} props
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      showPasswordModal: this.props.visible,
    };
  }

  /**
   * handle change props and change state of modal visibility
   * @param {IProps} newProps
   */
  public componentWillReceiveProps(newProps: IProps) {
    if (newProps.visible !== this.state.showPasswordModal) {
      this.setState({
        showPasswordModal: newProps.visible,
      });
    }
  }

  /**
   * @func
   * @desc handle submit change password
   * @param e
   */
  private changePassword(e?: any) {
    e && e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        notification.error({
          message: "Update profile failed!",
          description: this.i18n._t("Please check all fields and try again!").toString(),
        });
        return;
      }

      const api = new UserApi();
      api.userPasswordChangePut({
        payloadData: {
          current_password: values.current_password,
          new_password: values.new_password,
        }
      }).then(() => {
        notification.success({
          message: this.i18n._t("Change Password"),
          description: this.i18n._t("Your password changed successfully.").toString(),
        });
        this.props.onOk && this.props.onOk();
      }).catch((err) => {
        if (err.state === 400) {
          notification.error({
            message: this.i18n._t("Change Password"),
            description: this.i18n._t("Your current password is wrong.").toString(),
          });
        } else {
          notification.error({
            message: this.i18n._t("Change Password"),
            description: this.i18n._t("Error in changing password.").toString(),
          });
        }
      });
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (<Modal okText={this.i18n._t("Submit").toString()} cancelText={this.i18n._t("Cancel").toString()}
        title={this.i18n._t("Change Password").toString()}
        visible={this.state.showPasswordModal}
        onCancel={() => {
          this.setState({showPasswordModal: false});
          this.props.onCancel && this.props.onCancel();
        }}
        onOk={() => {
          this.changePassword();
        }}>
        <Form onSubmit={this.changePassword.bind(this)}>
          <Row gutter={16} type="flex" align="top">
            <Col span={6}>
            </Col>
            <Col span={12}>
              <FormItem>
                {getFieldDecorator("current_password", {
                  rules: [{required: true, message: this.i18n._t("Please input your current password!")}],
                })(
                  <TextField
                    type="password"
                    fullWidth={true}
                    floatingLabelText={this.i18n._t("Current Password")}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
            </Col>
            <Col span={6}>
            </Col>
            <Col span={12}>
              <FormItem>
                {getFieldDecorator("new_password", {
                  rules: [{min: 8, required: true, message: this.i18n._t("Please input new password!")}],
                })(
                  <PasswordStrength
                    type="password"
                    fullWidth={true}
                    floatingLabelText={this.i18n._t("New Password")}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}


export default Form.create<IProps>()(ChangePassword as any);
