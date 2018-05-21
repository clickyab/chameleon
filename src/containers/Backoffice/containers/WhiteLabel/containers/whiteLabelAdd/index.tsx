import * as React from "react";
import {Button, Checkbox, Col, Form, Input, notification, Radio, Row, Select} from "antd";
import CONFIG from "../../../../../../constants/config";
import Translate from "../../../../../../components/i18n/Translate/index";
import I18n from "../../../../../../services/i18n/index";
import {ControllersApi} from "../../../../../../api/api";
import "./style.less";
import {FormComponentProps} from "antd/lib/form/Form";
import Icon from "../../../../../../components/Icon";
import UploadFile, {FILE_TYPE , UPLOAD_MODULES} from "../../../../../Campaign/components/UploadFile";
import {connect} from "react-redux";
import {RootState} from "../../../../../../redux/reducers/index";
import ChangePasswordModal from "../../../../../../components/ChangePasswordModal";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

interface IOwnProps {
    match?: any;
    history?: any;
}

interface IProps extends FormComponentProps {
    match: any;
    history: any;
}

interface IState {
  createMode: boolean;
  editMode: boolean;
  showPasswordModal: boolean;
}
@connect(mapStateToProps)
class WhiteLabel extends React.Component<IProps, IState> {
  private i18n = I18n.getInstance();

  constructor(props: IProps) {
    super(props);
    this.state = {
      createMode: !this.props.match.params.id,
      editMode: !this.props.match.params.id,
      showPasswordModal: false,
    };
  }

 public componentDidMount() {
     let id = this.props.match.params.id;
 }

 public handleSubmit(e) {
     e.preventDefault();
     this.props.form.validateFields((err, values) => {
         if (err) {
             notification.error({
                 message: this.i18n._t("Submit failed!").toString(),
                 className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                 description: this.i18n._t("Please check all fields and try again!").toString(),
             });
             return;
         }
         const controllerApi = new ControllersApi();
         controllerApi.domainCreatePost({
             payloadData: {
             attributes: {
                 corporationName: values.corporation_name,
                 color: values.color,
                 domain: values.domain,
                 email: values.email,
         },
             description: "",
             name: values.name,
             status: "enable"
         }
         });

 });
 }
  public render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div dir={CONFIG.DIR} className="backoffice-content">
        <Row className="backoffice-title mb-3" type={"flex"}>
          <Col span={24}>
            <div className={"edit-user-wrapper"}>
              <h2 className={""}>
                {!this.state.createMode && <Translate value="Edit white label"/>}
                {this.state.createMode && <Translate value="Create new white label"/>}
              </h2>
              {!this.state.editMode &&
              <Button className="edit-btn"
                      onClick={() => {
                        this.setState({editMode: true});
                      }}>
                <Translate value="Active edit mode"/>
                <Icon name={"cif-edit"} className="edit-btn-icon"/>
              </Button>
              }
            </div>
            <p><Translate
              value="Fill below form and register new white label. Information will be sent automatically after submit."/>
            </p>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={24} className={"mb-2"}>
            <h4 className={"black"}><Translate value={"General Information"}/></h4>
          </Col>
          <Col span={18}>
            <Row gutter={16} align={"top"} type={"flex"} className={"mb-2"}>
              <Col span={12}>
                <FormItem className="has-error-help">
                  <span className="input-title require"><Translate value="Email"/></span>
                  {getFieldDecorator("email", {
                    rules: [{
                      required: true,
                      message: this.i18n._t("Please input the Email address!").toString()
                    }],
                  })(
                    <Input
                      disabled={!this.state.createMode}
                      className="input-campaign dir-ltr"
                      placeholder={this.i18n._t("example@gmail.com") as string}
                    />)}
                  <span className="input-description"><Translate
                    value="Can't change email after registration"/></span>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem className={"has-error-help"}>
                  <span className="input-title require"><Translate value="Domain"/></span>
                  {getFieldDecorator("domain", {
                    rules: [{
                      required: true,
                      message: this.i18n._t("").toString()
                    }],
                  })(
                    <Input
                      disabled={!this.state.editMode}
                      className="input-campaign dir-ltr"
                      placeholder={this.i18n._t("https://camp.clickyab.com") as string}
                    />)}
                  <span className="input-description">
                                    <Translate value="Temporary access address:"/>
                                    <a href=" https://tmp_5445.clickyab.com"> https://tmp_5445.clickyab.com</a>
                                  </span>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem className="has-error-help" style={{marginBottom: "5px"}}>
                  <span className="input-title require"><Translate value="Password"/></span>
                  {getFieldDecorator("password", {
                    rules: [{
                      required: true,
                      message: this.i18n._t("Please input password").toString(),
                    }],
                  })(
                    <Input
                      type={"password"}
                      disabled={!this.state.createMode}
                      className="input-campaign"
                      placeholder={this.i18n._t("******") as string}
                    />)}
                </FormItem>
                  {!this.state.createMode &&
                  <p><Translate
                      value="If you want to change your password"/>
                      <a onClick={() => {
                          this.setState({
                              showPasswordModal: true,
                          });
                      }}><Translate value="Click here"/></a>
                  </p>
                  }
              </Col>
            </Row>
          </Col>
          <hr className={"full-width mb-3 line"}/>
          <Col span={18} className={"mb-3"}>
            <Row gutter={16} align={"middle"} type={"flex"} className={"mb-2"}>
              <Col span={12} className="form-item-align">
                <h4 className="black mb-2"><Translate value={"Corporation Identification Information"}/></h4>
                <FormItem className="has-error-help">
                  <span className="input-title require"><Translate value="White label name"/></span>
                  {getFieldDecorator("name", {
                    rules: [{
                      required: true,
                      message: this.i18n._t("Please input white label name").toString(),
                    }],
                  })(
                    <Input
                      disabled={!this.state.editMode}
                      className="input-campaign"
                    />)}
                </FormItem>
                <FormItem>
                  <span className="input-title require"><Translate value="corporation name"/></span>
                  {getFieldDecorator("corporation_name", {
                    rules: [{
                      required: true,
                      message: this.i18n._t("Please input corporation name").toString(),
                    }],
                  })(
                    <Input
                      disabled={!this.state.editMode}
                      className="input-campaign"
                    />)}
                </FormItem>
                <FormItem>
                  <span className="input-title require"><Translate value="Organization color pallet"/></span>
                  <div>
                    {getFieldDecorator("color", {
                      initialValue: "default",
                      rules: [{
                        required: true,
                        message: this.i18n._t("Please select color pallet").toString(),
                      }],
                    })(
                      <Select
                        disabled={!this.state.editMode}
                        className={"select-input"}
                        dropdownClassName={"select-dropdown"}>
                        <Option value="default"><Translate value={"default"}/></Option>
                      </Select>)}
                  </div>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem className="whitelabel-logo-dragger">
                  <span className="input-title require"><Translate value={"Logo"}/></span>
                    <UploadFile
                    fileType={[FILE_TYPE.IMG_PNG]}
                    showBelowDragDescription={false}
                    uploadModule={UPLOAD_MODULES.BANNER_IMAGE}
                  />
                </FormItem>
              </Col>
            </Row>
          </Col>
          {this.state.createMode &&
          <Col span={24}>
            <hr className={"full-width mb-3 line"}/>
            <Col span={6}>
            </Col>
            <Col span={18}>
              <Checkbox className="checkbox-input"><Translate
                value={"Do you want to send information to the email?"}/></Checkbox>
            </Col>
          </Col>
          }
          <div className="input-btn-wrapper">
            <Button><Translate value={"Cancel"}/></Button>
            <Button type={"primary"} onClick={(e) => this.handleSubmit(e)}><Translate value={"Create white label"}/></Button>
          </div>
        </Row>
          <ChangePasswordModal visible={this.state.showPasswordModal}/>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: IOwnProps) {
    return {
        match: ownProps.match,
        history: ownProps.history,
    };
}
export default Form.create()((WhiteLabel) as any);
