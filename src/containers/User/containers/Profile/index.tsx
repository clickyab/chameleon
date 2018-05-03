import * as React from "react";
import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import Translate from "../../../../components/i18n/Translate/index";
import {UserApi, UserResponseLoginOKAccount} from "../../../../api/api";
import {Form, Row, Col, notification, Input} from "antd";
import {TextField, RaisedButton} from "material-ui";
import {setUser, setBreadcrumb, unsetBreadcrumb} from "../../../../redux/app/actions/index";
import Icon from "../../../../components/Icon/index" ;
import CONFIG from "../../../../constants/config" ;

import "./style.less";
import LocationSelect from "../../../../components/LocationSelect/index";
import Gender from "../../../../components/Gender/index";
import ChangePassword from "./components/ChangePassword/index";
import {validateID} from "../../../../services/Utils/CustomValidations";

const FormItem = Form.Item;

export interface IProps extends RouteComponentProps<void> {
  form: any;
  user: UserResponseLoginOKAccount;
  setUser: (user: UserResponseLoginOKAccount) => void;
  setBreadcrumb: (name: string, title: string, parent: string) => void;
  unsetBreadcrumb: (name: string) => void;
}


export interface IState {
  isDisable: boolean;
  isCorporation: boolean;
  user: UserResponseLoginOKAccount;
  showPasswordModal: boolean;
  buttonDisable: boolean;
}


@connect(mapStateToProps, mapDispatchToProps)

class PublicProfileContainer extends React.Component<IProps, IState> {

  private i18n = I18n.getInstance();

  constructor(props: IProps) {
    super(props);

    this.state = {
      showPasswordModal: false,
      isDisable: true,
      isCorporation: this.props.user && this.props.user.legal_name ? true : false,
      user: this.props.user,
      buttonDisable: true
    };
  }

  componentDidMount() {
    this.props.setBreadcrumb("profile", this.i18n._t("Profile").toString(), "home");
    const api = new UserApi();
    api.userPingGet({})
      .then((res) => {
        this.setState({user: res.account});
      });
  }

  private handleChangeLocation(country, province, city) {
    // TODO:: store country and province
    this.setState({
      user: {
        ...this.state.user,
        city_id: city,
      },
      buttonDisable: false,
    }, () => {
      // console.log(this.state);
    });
  }

  private handleButton() {
    this.setState({buttonDisable: false});
  }

  private handleSubmit(e) {
    if (e) e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        notification.error({
          message: this.i18n._t("Update profile failed!"),
          className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
          description: this.i18n._t("Please check all fields and try again!").toString(),
        });
        return;
      }
      const userApi = new UserApi();

      userApi.userUpdatePut({
        payloadData: {
          ...values,
          city_id: this.state.user.city_id

          ,
        }
      }).then((data) => {
        this.props.setUser(data.account as UserResponseLoginOKAccount);
        notification.success({
          message: this.i18n._t("Update Profile"),
          className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
          description: this.i18n._t("Your corporation profile has been updated successfully.").toString(),
        });
      }).catch((error) => {
        if (error.error) {
          notification.error({
            message: this.i18n._t("Update Failed").toString(),
            className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
            description: this.i18n._t(error.error.text).toString(),
          });
        } else {

          let errors: string[] = [];
          Object.keys(error).map((key: string) => {
            errors.push(this.i18n._t(error[key].text).toString());
          });
          notification.error({
            message: this.i18n._t("Update Failed").toString(),
            className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
            description: errors.join("<br>"),
          });
        }
      });

    });
  }
  render() {
    const {getFieldDecorator} = this.props.form;
      const UserProfile = () => {
        return (
          <div className={(CONFIG.DIR === "rtl") ? "profile-container-rtl" : "profile-container"}>
              <Form onSubmit={this.handleSubmit.bind(this)}>
                  <Row gutter={16} type="flex" align="top" justify="center">
                      <Col span={18}>
                          <Row gutter={16} type="flex" align="top">
                              <Col span={12}>
                                  <FormItem>
                                      <span className="input-title"><Translate value="Name"/></span>
                                      {getFieldDecorator("first_name", {
                                          initialValue: this.state.user.first_name,
                                          rules: [{
                                              required: true,
                                              message: this.i18n._t("Please input your Submit Name!")
                                          }],
                                      })(
                                          <Input
                                              className="input-campaign"
                                              onChange={() => this.handleButton()}
                                          />)}
                                  </FormItem>
                              </Col>
                              <Col span={12}>
                                  <FormItem>
                                      <span className="input-title"><Translate value="Last name"/></span>
                                      {getFieldDecorator("last_name", {
                                          initialValue: this.state.user.last_name,
                                          rules: [{
                                              required: true,
                                              message: this.i18n._t("Please input your last name!")
                                          }],
                                      })(
                                          <Input
                                              className="input-campaign"
                                              onChange={() => this.handleButton()}
                                          />)}
                                  </FormItem>
                              </Col>
                          </Row>
                          <Row gutter={16} className={(this.state.isDisable) ? "column-disable" : "column-enable"}
                               type="flex"
                               align="top">
                              <Col span={12}>
                                  <FormItem>
                                      <span className="input-title"><Translate value="Email"/></span>
                                      {getFieldDecorator("email", {
                                          initialValue: this.props.user.email,
                                          rules: [{
                                              required: true,
                                              message: this.i18n._t("Please input your Submit Email!")
                                          }],
                                      })(
                                          <Input
                                              className="input-campaign"
                                              disabled={true}
                                          />)}
                                  </FormItem>
                                  <p className="enable-des"><Translate
                                      value="You can't change email address after registration"/></p>
                              </Col>
                              <Col span={12}>
                                  <FormItem>
                                      <span className="input-title"><Translate value="Password"/></span>
                                      <Input
                                          placeholder={"********"}
                                          className={"input-campaign"}
                                          type="password"
                                          disabled={this.state.isDisable}
                                      />
                                  </FormItem>
                                  <p className={(this.state.isDisable) ? "enable-des" : "disable-des"}><Translate
                                      value="If you want to change your password"/>
                                      <a onClick={() => {
                                          this.setState({
                                              showPasswordModal: true,
                                          });
                                          this.handleButton();
                                      }}><Translate value="Click here"/></a>
                                  </p>
                              </Col>
                          </Row>

                          <Row gutter={16} type="flex" align="top">
                              <Col>
                                  <FormItem>
                                      {getFieldDecorator("gender", {
                                          initialValue: this.state.user.gender,
                                          rules: [{
                                              required: true,
                                              message: this.i18n._t("Please select your Gender!")
                                          }],
                                      })(
                                          <Gender onChange={() => this.handleButton()}/>
                                      )}
                                  </FormItem>
                              </Col>
                          </Row>

                          <Row gutter={16} type="flex" align="top">
                              <Col span={12}>
                                  <FormItem>
                                      <span className="input-title"><Translate value="National ID"/></span>
                                      {getFieldDecorator("ssn", {
                                          initialValue: this.state.user.ssn,
                                          rules: [{
                                              required: true,
                                              message: this.i18n._t("Please input your National ID!")
                                          },
                                            {
                                            validator: validateID,
                                              message : this.i18n._t("Invalid national ID")
                                          }
                                          ],
                                      })(
                                          <Input
                                              className="input-campaign"
                                              onChange={() => this.handleButton()}
                                          />)}
                                  </FormItem>
                              </Col>
                              <Col span={12}>
                                  {this.state.user &&
                                  <LocationSelect
                                      onChange={this.handleChangeLocation.bind(this)}
                                      countryId={1}
                                      cityId={this.state.user.city_id}
                                      provinceId={this.state.user.province_name}
                                  />
                                  }
                              </Col>
                          </Row>

                          <Row gutter={16} type="flex" align="top">
                              <Col span={12}>
                                  <FormItem>
                                      <span className="input-title"><Translate value="Mobile"/></span>
                                      {getFieldDecorator("cell_phone", {
                                          initialValue: this.state.user.cellphone,
                                          rules: [{
                                              required: true,
                                              message: this.i18n._t("Please input your mobile number!")
                                          }],
                                      })(
                                          <Input
                                              className="input-campaign"
                                              onChange={() => this.handleButton()}
                                          />)}
                                  </FormItem>
                              </Col>
                              <Col span={12}>
                                  <FormItem>
                                      <span className="input-title"><Translate value="Postal Code"/></span>
                                      {getFieldDecorator("postal_code", {
                                          initialValue: this.state.user.postal_code,
                                          rules: [{
                                              required: true,
                                              message: this.i18n._t("Please input your postal code!")
                                          }],
                                      })(
                                          <Input
                                              className="input-campaign"
                                              onChange={() => this.handleButton()}
                                          />)}
                                  </FormItem>
                              </Col>
                          </Row>
                          <Row gutter={16} type="flex" align="top">
                              <Col span={12}>
                                  <FormItem>
                                      <span className="input-title"><Translate value="Phone"/></span>
                                      {getFieldDecorator("land_line", {
                                          initialValue: this.state.user.land_line,
                                          rules: [{required: true, message: this.i18n._t("Please input your phone!")}],
                                      })(
                                          <Input
                                              className="input-campaign"
                                              onChange={() => this.handleButton()}
                                          />)}
                                  </FormItem>
                              </Col>
                              <Col span={12}>
                                  <FormItem>
                                      <span className="input-title"><Translate value="Address"/></span>
                                      {getFieldDecorator("address", {
                                          initialValue: this.state.user.address,
                                      })(
                                          <Input
                                              className="input-campaign"
                                              onChange={() => this.handleButton()}
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
                                      className={(!this.state.buttonDisable) ? "btn-save-change" : ""}
                                      style={{color: "green"}}
                                      disabled={this.state.buttonDisable}
                                  />
                              </Col>
                          </Row>
                      </Col>
                      <Col span={6}>
                          <Col className="profile-notice">
                              <h6><Icon name="cif-lightbulb"/><Translate value={"You should know:"}/></h6>
                              <ul>
                                  <li><Translate value={"Filling bullet fields are required"}/></li>
                                  <li><Translate value={"You can't change your password to any of your former passwords for security reasons"}/></li>
                                  <li><Translate value={"Your default avatar set to your Gavatar.com avatar. You can change your default avatar by clicking on it"}/></li>
                              </ul>
                          </Col>
                      </Col>
                  </Row>
              </Form>
              <ChangePassword
                  onOk={() => {
                      this.setState({showPasswordModal: false});
                  }}
                  onCancel={() => {
                      this.setState({showPasswordModal: false});
                  }}
                  visible={this.state.showPasswordModal}/>
          </div>
        );
      };
      const CoprationProfile = () => {
          return (
              <div className={(CONFIG.DIR === "rtl") ? "profile-container-rtl" : "profile-container"}>
                  <Form onSubmit={this.handleSubmit.bind(this)}>
                      <Row gutter={16} type="flex" align="top" justify="center">
                          <Col span={18}>
                              <Row gutter={16} type="flex" align="top">
                                  <Col span={12}>
                                      <FormItem>
                                          <span className="input-title"><Translate value="Name"/></span>
                                          {getFieldDecorator("first_name", {
                                              initialValue: this.state.user.first_name,
                                              rules: [{
                                                  required: true,
                                                  message: this.i18n._t("Please input your Submit Name!")
                                              }],
                                          })(
                                              <Input
                                                  className="input-campaign"
                                                  onChange={() => this.handleButton()}
                                              />)}
                                      </FormItem>
                                  </Col>
                                  <Col span={12}>
                                      <FormItem>
                                          <span className="input-title"><Translate value="Last name"/></span>
                                          {getFieldDecorator("last_name", {
                                              initialValue: this.state.user.last_name,
                                              rules: [{
                                                  required: true,
                                                  message: this.i18n._t("Please input your last name!")
                                              }],
                                          })(
                                              <Input
                                                  className="input-campaign"
                                                  onChange={() => this.handleButton()}
                                              />)}
                                      </FormItem>
                                  </Col>
                              </Row>
                              <Row gutter={16} className={(this.state.isDisable) ? "column-disable" : "column-enable"}
                                   type="flex"
                                   align="top">
                                  <Col span={12}>
                                      <FormItem>
                                          <span className="input-title"><Translate value="Email"/></span>
                                          {getFieldDecorator("email", {
                                              initialValue: this.props.user.email,
                                              rules: [{
                                                  required: true,
                                                  message: this.i18n._t("Please input your Submit Email!")
                                              }],
                                          })(
                                              <Input
                                                  className="input-campaign"
                                                  disabled={true}
                                              />)}
                                      </FormItem>
                                      <p className="enable-des"><Translate
                                          value="You can't change email address after registration"/></p>
                                  </Col>
                                  <Col span={12}>
                                      <FormItem>
                                          <span className="input-title"><Translate value="Email"/></span>
                                          <Input
                                              value={"********"}
                                              className="input-campaign"
                                              type="password"
                                              disabled={this.state.isDisable}
                                          />
                                      </FormItem>
                                      <p className={(this.state.isDisable) ? "enable-des" : "disable-des"}><Translate
                                          value="If you want to change your password"/>
                                          <a onClick={() => {
                                              this.setState({
                                                  showPasswordModal: true,
                                              });
                                              this.handleButton();
                                          }}><Translate value="Click here"/></a>
                                      </p>
                                  </Col>
                              </Row>

                              <Row gutter={16} type="flex" align="top">
                                  <Col span={12}>
                                      <FormItem>
                                          <span className="input-title"><Translate value="Mobile"/></span>
                                          {getFieldDecorator("cell_phone", {
                                              initialValue: this.state.user.cellphone,
                                              rules: [{
                                                  required: true,
                                                  message: this.i18n._t("Please input your mobile number!")
                                              }],
                                          })(
                                              <Input
                                                  className="input-campaign"
                                                  onChange={() => this.handleButton()}
                                              />)}
                                      </FormItem>
                                  </Col>
                                  <Col span={12}>
                                      <FormItem>
                                          <span className="input-title"><Translate value="Phone"/></span>
                                          {getFieldDecorator("land_line", {
                                              initialValue: this.state.user.land_line,
                                              rules: [{required: true, message: this.i18n._t("Please input your phone!")}],
                                          })(
                                              <Input
                                                  className="input-campaign"
                                                  onChange={() => this.handleButton()}
                                              />)}
                                      </FormItem>
                                  </Col>
                                  <Col span={12}>
                                      <FormItem>
                                          <span className="input-title"><Translate value="Corporation Name"/></span>
                                          {getFieldDecorator("legal_name", {
                                              initialValue: this.state.user.legal_name,
                                              rules: [{
                                                  required: true,
                                                  message: this.i18n._t("Please input your Submit Corporation Name!")
                                              }],
                                          })(
                                              <Input
                                                  className="input-campaign"
                                                  onChange={() => this.handleButton()}
                                              />)}
                                      </FormItem>
                                  </Col>
                                  <Col span={12}>
                                      {this.state.user &&
                                      <LocationSelect
                                          onChange={this.handleChangeLocation.bind(this)}
                                          countryId={1}
                                          cityId={this.state.user.city_id}
                                          provinceId={this.state.user.province_name}
                                      />
                                      }
                                  </Col>
                              </Row>

                              <Row gutter={16} type="flex" align="top">
                                  <Col span={12}>
                                      <FormItem>
                                          <span className="input-title"><Translate value="Register Code"/></span>
                                          {getFieldDecorator("register_code", {
                                              initialValue: this.state.user.legal_register,
                                              rules: [{
                                                  required: true,
                                                  message: this.i18n._t("Please input your register code!")
                                              }],
                                          })(
                                              <Input
                                                  className="input-campaign"
                                                  onChange={() => this.handleButton()}
                                              />)}
                                      </FormItem>
                                  </Col>
                                  <Col span={12}>
                                      <FormItem>
                                          <span className="input-title"><Translate value="Postal Code"/></span>
                                          {getFieldDecorator("postal_code", {
                                              initialValue: this.state.user.postal_code,
                                              rules: [{
                                                  required: true,
                                                  message: this.i18n._t("Please input your postal code!")
                                              }],
                                          })(
                                              <Input
                                                  className="input-campaign"
                                                  onChange={() => this.handleButton()}
                                              />)}
                                      </FormItem>
                                  </Col>
                              </Row>
                              <Row gutter={16} type="flex" align="top">
                                  <Col span={12}>
                                      <FormItem>
                                          <span className="input-title"><Translate value="Economic code"/></span>
                                          {getFieldDecorator("economic_code", {
                                              initialValue: this.props.user.economic_code,
                                              rules: [{
                                                  required: true,
                                                  message: this.i18n._t("Please input your Submit Economic code!")
                                              }],
                                          })(
                                              <Input
                                                  className="input-campaign"
                                                  onChange={() => this.handleButton()}
                                              />)}
                                      </FormItem>
                                  </Col>
                                  <Col span={12}>
                                      <FormItem>
                                          <span className="input-title"><Translate value="Address"/></span>
                                          {getFieldDecorator("address", {
                                              initialValue: this.state.user.address,
                                          })(
                                              <Input
                                                  className="input-campaign"
                                                  onChange={() => this.handleButton()}
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
                                          className={(!this.state.buttonDisable) ? "btn-save-change" : ""}
                                          style={{color: "green"}}
                                          disabled={this.state.buttonDisable}
                                      />
                                  </Col>
                              </Row>
                          </Col>
                          <Col span={6}>
                              <Col className="profile-notice">
                                  <h6><Icon name="cif-lightbulb"/><Translate value={"You should know:"}/></h6>
                                  <ul>
                                      <li><Translate value={"Filling bullet fields are required"}/></li>
                                      <li><Translate value={"You can't change your password to any of your former passwords for security reasons"}/></li>
                                      <li><Translate value={"Your default avatar set to your Gavatar.com avatar. You can change your default avatar by clicking on it"}/></li>
                                  </ul>
                              </Col>
                          </Col>
                      </Row>
                  </Form>
                  <ChangePassword
                      onOk={() => {
                          this.setState({showPasswordModal: false});
                      }}
                      onCancel={() => {
                          this.setState({showPasswordModal: false});
                      }}
                      visible={this.state.showPasswordModal}/>
              </div>
          );
      };

    return (
        <div>
            {this.state.isCorporation ? CoprationProfile() : UserProfile() }
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
    setUser: (user: UserResponseLoginOKAccount) => dispatch(setUser(user)),
    setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
    unsetBreadcrumb: (name: string) => dispatch(unsetBreadcrumb(name)),
  };
}

export default Form.create()(PublicProfileContainer);
