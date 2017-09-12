import * as React from "react";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import Translate from "../../../../components/i18n/Translate/index";
import {UserApi, UserResponseLoginOKAccount} from "../../../../api/api";
import {Form, Card, Row, message, Col, notification, Layout} from "antd";
import {TextField, Checkbox, RaisedButton, FontIcon, Toggle, SelectField} from "material-ui";
import {setUser, setIsLogin} from "../../../../redux/app/actions/index";
import Icon from "../../../../components/Icon/index" ;
import CONFIG from "../../../../constants/config" ;

import "./style.less";
import LocationSelect from "../../../../components/LocationSelect/index";

const FormItem = Form.Item;

export interface IProps extends RouteComponentProps<void> {
  form: any;
  user: UserResponseLoginOKAccount;
}


export interface IState {
  isDisable: boolean;
  isCorporation: boolean;
  user: UserResponseLoginOKAccount;
}

@connect(mapStateToProps, mapDispatchToProps)

class PublicProfileContainer extends React.Component<IProps, IState> {

  private i18n = I18n.getInstance();


  constructor(props: IProps) {
    super(props);

    this.state = {
      isDisable: true,
      isCorporation: this.props.user.corporation && this.props.user.corporation.legal_name ? true : false,
      user: this.props.user,
    };
  }

  private handleChangeLocation(country, province, city) {

    // TODO:: store country and province
    this.setState(() => {
      if (this.state.isCorporation) {
        return {
          ...this.state,
          user: {
            ...this.state.user,
            corporation: {
              ...this.state.user.corporation,
              city_id: city,
            }
          }
        };
      } else {
        return {
          ...this.state,
          user: {
            ...this.state.user,
            personal: {
              ...this.state.user,
              city_id: city,
            }
          }
        };
      }
    });
  }

  private handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values);
      if (err) {
        notification.error({
          message: "Update profile failed!",
          description: this.i18n._t("Please check all fields and try again!").toString(),
        });
        return;
      }

      const userApi = new UserApi();
      if (this.state.isCorporation) {
        userApi.userCorporationPut({
          payloadData: {
            ...values
          }
        }).then(() => {
          notification.success({
            message: "Update Profile",
            description: this.i18n._t("Your corporation profile has been updated successfully.").toString(),
          });
        }).catch((error) => {
          if (error.error) {
            notification.error({
              message: "Update Failed",
              description: this.i18n._t(error.error.text).toString(),
            });
          } else {

            let errors: string[] = [];
            Object.keys(error).map((key: string) => {
              errors.push(this.i18n._t(error[key].text).toString());
            });
            notification.error({
              message: "Update Failed",
              description: errors.join("<br>"),
            });
          }
        });
      } else {
        userApi.userPersonalPut({
          payloadData: {
            ...values
          }
        }).then(() => {
          notification.success({
            message: "Update Profile",
            description: this.i18n._t("Your corporation profile has been updated successfully.").toString(),
          });
        }).catch((error) => {
          if (error.error) {
            notification.error({
              message: "Update Failed",
              description: this.i18n._t(error.error.text).toString(),
            });
          } else {

            let errors: string[] = [];
            Object.keys(error).map((key: string) => {
              errors.push(this.i18n._t(error[key].text).toString());
            });
            notification.error({
              message: "Update Failed",
              description: errors.join("<br>"),
            });
          }
        });
      }

    });
  }

  render() {
    console.log(this.state);
    const {getFieldDecorator} = this.props.form;
    return (
      <div className={( CONFIG.DIR === "rtl" ) ? "profile-container-rtl" : "profile-container"}>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={16} type="flex" align="top" justify="center">
            <Col span={18}>
              <Row gutter={16} type="flex" align="top">
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("first_name", {
                      initialValue: this.state.isCorporation ? this.state.user.corporation.first_name : this.state.user.personal.first_name,
                      rules: [{required: true, message: this.i18n._t("Please input your Submit Name!")}],
                    })(
                      <TextField
                        fullWidth={true}
                        floatingLabelText={this.i18n._t("Name")}
                      />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("last_name", {
                      initialValue: this.state.isCorporation ? this.state.user.corporation.last_name : this.state.user.personal.last_name,
                      rules: [{required: true, message: this.i18n._t("Please input your Submit last name!")}],
                    })(
                      <TextField
                        fullWidth={true}
                        floatingLabelText={this.i18n._t("Last name")}
                      />)}
                  </FormItem>
                </Col>
              </Row>
              {this.state.isCorporation &&
              <Row gutter={16} type="flex" align="top">
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator("corporationName", {
                      initialValue: this.state.isCorporation ? this.state.user.corporation.name : null,
                      rules: [{required: true, message: this.i18n._t("Please input your Submit Corpration Name!")}],
                    })(
                      <TextField
                        fullWidth={true}
                        floatingLabelText={this.i18n._t("Corporation Name")}
                      />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator("register_code", {
                      initialValue: this.state.isCorporation ? this.state.user.corporation.register_code : null,
                      rules: [{required: true, message: this.i18n._t("Please input your register code!")}],
                    })(
                      <TextField
                        fullWidth={true}
                        floatingLabelText={this.i18n._t("Register Code")}
                      />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator("economic_code", {
                      initialValue: this.state.isCorporation ? this.props.user.corporation.economic_code : null,
                      rules: [{required: true, message: this.i18n._t("Please input your Submit Economic code!")}],
                    })(
                      <TextField
                        fullWidth={true}
                        floatingLabelText={this.i18n._t("Economic code")}
                      />)}
                  </FormItem>
                </Col>
              </Row>}
              <Row gutter={16} className={(this.state.isDisable) ? "column-disable" : "column-enable"} type="flex"
                   align="top">
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("email", {
                      initialValue: this.props.user.email,
                      rules: [{required: true, message: this.i18n._t("Please input your Submit Email!")}],
                    })(
                      <TextField
                        fullWidth={true}
                        floatingLabelText={this.i18n._t("Email")}
                        disabled={true}
                      />)}
                  </FormItem>
                  <p className="enable-des"><Translate value="You can't change email address after registration"/></p>
                </Col>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("password", {
                      initialValue: "********",
                      rules: [{required: true, message: this.i18n._t("Please input your Submit password!")}],
                    })(
                      <TextField
                        fullWidth={true}
                        floatingLabelText={this.i18n._t("Password")}
                        type="password"
                        disabled={this.state.isDisable}
                      />)}
                  </FormItem>
                  <p className={(this.state.isDisable) ? "enable-des" : "disable-des"}><Translate
                    value="If you want to change your password"/><a onClick={() => {
                    this.setState({
                      isDisable: !this.state.isDisable,
                    });
                  }}><Translate value="Click here"/></a></p>
                </Col>
              </Row>
              <Row gutter={16} type="flex" align="top">
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("cellphone", {
                      initialValue: this.state.isCorporation ? this.state.user.corporation.cellphone : this.state.user.personal.cellphone,
                      rules: [{required: true, message: this.i18n._t("Please input your Submit mobile!")}],
                    })(
                      <TextField
                        fullWidth={true}
                        floatingLabelText={this.i18n._t("Mobile")}
                      />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("phone", {
                      initialValue: this.state.isCorporation ? this.state.user.corporation.phone : this.state.user.personal.phone,
                      rules: [{required: true, message: this.i18n._t("Please input your Submit phone!")}],
                    })(
                      <TextField
                        fullWidth={true}
                        floatingLabelText={this.i18n._t("phone")}
                      />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16} type="flex" align="top">
                <Col span={12}>
                  <LocationSelect
                    onChange={this.handleChangeLocation.bind(this)}
                    countryId={1}
                    cityId={this.state.isCorporation ?
                      (this.state.user.corporation.city_id ? this.state.user.corporation.city_id.Int64 : null) :
                      (this.state.user.personal.city_id ? this.state.user.personal.city_id.Int64 : null)}
                    provinceId={this.state.isCorporation ?
                      (this.state.user.corporation.city_id ? this.state.user.corporation.city_id.Int64 : null) :
                      (this.state.user.personal.city_id ? this.state.user.personal.city_id.Int64 : null)}
                  />
                </Col>
                <Col span={12}>
                  <FormItem>
                    <TextField
                      fullWidth={true}
                      floatingLabelText={this.i18n._t("Post Address")}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem>
                    <TextField
                      fullWidth={true}
                      floatingLabelText={this.i18n._t("Address")}
                      disabled={true}
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16} type="flex" align="top">
                <Col span={24}>
                  <RaisedButton
                    type="submit"
                    label={<Translate value="Save Changes"/>}
                    className="btn-save-change"
                    style={{color: "green"}}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Col className="profile-notice">
                <h6><Icon name="arrow"/>You Should know</h6>
                <ul>
                  <li>Filling bullet fields are required</li>
                  <li>You can't change your password to any of your former passwords for security
                    reasons
                  </li>
                  <li>Your default avatar set to your Gavatar.com avatar. You can change your default
                    avatar by clicking on it
                  </li>
                </ul>
              </Col>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    user: state.app.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    /* empty */
  };
}

export default Form.create()(PublicProfileContainer);
