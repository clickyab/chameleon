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
import Gender from "../../../../components/Gender/index";
import Upload, {UPLOAD_MODULES} from "../../../../services/Upload/index";
import {error} from "util";

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
      isCorporation: this.props.user && this.props.user.legal_name ? true : false,
      user: this.props.user,
    };
  }

  componentDidMount() {
    const api = new UserApi();
    api.userPingGet({})
      .then((res) => {
        this.setState({user: res.account});
      });
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
              ...this.state.user,
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

      userApi.userUpdatePut({
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

    });
  }

  uploadAvatar(file) {
    const uploader = new Upload(UPLOAD_MODULES.AVATAR, file);
    uploader.upload((state) => {
      // todo:: show progress
      console.log(state);
    })
      .then((res) => {
        notification.success({
          message: this.i18n._t("Upload Avatar"),
          description: this.i18n._t("Your avatar changed successfully.").toString(),
        });
      })
      .catch((error) => {
        notification.error({
          message: this.i18n._t("Upload Avatar"),
          description: this.i18n._t("Error in change avatar.").toString(),
        });
      });

  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className={( CONFIG.DIR === "rtl" ) ? "profile-container-rtl" : "profile-container"}>
        <input type="file" onChange={(e) => this.uploadAvatar(e.target.files[0])} ref="avatar" accept="image/*"/>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={16} type="flex" align="top" justify="center">
            <Col span={18}>
              <Row gutter={16} type="flex" align="top">
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("first_name", {
                      initialValue: this.state.user.first_name,
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
                      initialValue: this.state.user.last_name,
                      rules: [{required: true, message: this.i18n._t("Please input your last name!")}],
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
                    {getFieldDecorator("legal_name", {
                      initialValue: this.state.user.legal_name,
                      rules: [{required: true, message: this.i18n._t("Please input your Submit Corporation Name!")}],
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
                      initialValue: this.state.user.legal_register,
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
                      initialValue: this.props.user.economic_code,
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
                    <TextField
                      value={"********"}
                      fullWidth={true}
                      floatingLabelText={this.i18n._t("Password")}
                      type="password"
                      disabled={this.state.isDisable}
                    />
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
                <Col>
                  <FormItem>
                    {getFieldDecorator("gender", {
                      initialValue: this.state.user.gender,
                      rules: [{required: true, message: this.i18n._t("Please select your Gender!")}],
                    })(
                      <Gender/>
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row gutter={16} type="flex" align="top">
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("ssn", {
                      initialValue: this.state.user.ssn,
                      rules: [{required: true, message: this.i18n._t("Please input your National ID!")}],
                    })(
                      <TextField
                        fullWidth={true}
                        floatingLabelText={this.i18n._t("National ID")}
                      />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <LocationSelect
                    onChange={this.handleChangeLocation.bind(this)}
                    countryId={1}
                    cityId={this.state.user.city_id}
                    provinceId={this.state.user.province_id}
                  />
                </Col>
              </Row>

              <Row gutter={16} type="flex" align="top">
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("cell_phone", {
                      initialValue: this.state.user.cellphone,
                      rules: [{required: true, message: this.i18n._t("Please input your mobile number!")}],
                    })(
                      <TextField
                        fullWidth={true}
                        floatingLabelText={this.i18n._t("Mobile")}
                      />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("postal_code", {
                      initialValue: this.state.user.postal_code,
                      rules: [{required: true, message: this.i18n._t("Please input your postal code!")}],
                    })(
                      <TextField
                        fullWidth={true}
                        floatingLabelText={this.i18n._t("Postal Code")}
                      />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16} type="flex" align="top">
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("land_line", {
                      initialValue: this.state.user.land_line,
                      rules: [{required: true, message: this.i18n._t("Please input your phone!")}],
                    })(
                      <TextField
                        fullWidth={true}
                        floatingLabelText={this.i18n._t("Phone")}
                      />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("address", {
                      initialValue: this.state.user.address,
                      rules: [{required: true, message: this.i18n._t("Please input your phone!")}],
                    })(
                      <TextField
                        fullWidth={true}
                        floatingLabelText={this.i18n._t("Address")}
                      />
                    )}
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
