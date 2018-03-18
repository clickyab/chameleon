import * as React from "react";
import {Button, Checkbox, Col, Form, Input, notification, Radio, Row, Select} from "antd";
import CONFIG from "../../../../constants/config";
import Translate from "../../../../components/i18n/Translate";
import I18n from "../../../../services/i18n";
import "./style.less";
import {FormComponentProps} from "antd/lib/form/Form";
import Dragger from "antd/es/upload/Dragger";
import {default as UploadService, UPLOAD_MODULES} from "../../../../services/Upload";
import Icon from "../../../../components/Icon";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

interface IProps extends FormComponentProps {
}

interface IState {
  createMode: boolean;
  editMode: boolean;
}

class WhiteLabel extends React.Component<IProps, IState> {
  private i18n = I18n.getInstance();

  constructor(props: IProps) {
    super(props);
    this.state = {
      createMode: false,
      editMode: false,
    };
  }

  uploadLogo(file) {
    const uploader = new UploadService(UPLOAD_MODULES.BANNER, file);

    uploader.upload((state) => {
      // this.changeFileProgressState(id, state);
    }).then((state) => {
      // this.changeFileProgressState(id, state);
    }).catch((err) => {
      // fixme:: handle error
      notification.error({
        message: this.i18n._t("Error").toString(),
        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
        description: this.i18n._t("Error in upload progress!").toString(),
      });
    });
    return false;
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
                <FormItem className="has-error-help">
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
              </Col>
              <Col span={12}>
                <FormItem>
                  <Row gutter={8}>
                    <Col span={24}>
                      <span className="input-title require"><Translate value="Percent of profit increase"/></span>
                    </Col>
                    <Col span={18}>
                      <Translate value="Percent"/>
                    </Col>
                    <Col span={6}>
                      {getFieldDecorator("profit", {
                        rules: [{
                          required: true,
                          message: this.i18n._t("Please input profit").toString(),
                        }],
                      })(
                        <Input
                          disabled={this.state.createMode || this.state.editMode}
                          className="input-campaign"
                          placeholder={this.i18n._t("25") as string}
                        />)}
                    </Col>
                  </Row>
                </FormItem>
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
              <Col span={6}>
                <FormItem>
                  <span className="input-title require"><Translate value={"Logo"}/></span>
                  <Dragger
                    beforeUpload={this.uploadLogo.bind(this)}
                    className="banner-dragger-comp"
                  >
                    <div className="dragger-content">
                      <span className="upload-image-link"><Translate value={"upload it"}/></span>
                      <Translate value={"Drag your image over here or"}/>
                    </div>
                  </Dragger>
                </FormItem>
              </Col>
            </Row>
          </Col>
          {this.state.createMode &&
          <div>
            <hr className={"full-width mb-3 line"}/>
            <Col span={18}>
              <Checkbox className="checkbox-input"><Translate
                value={"Do you want to send information to the email?"}/></Checkbox>
            </Col>
            <Col span={6}>
            </Col>
          </div>
          }
          <div className="input-btn-wrapper">
            <Button><Translate value={"Cancel"}/></Button>
            <Button type={"primary"}><Translate value={"Create white label"}/></Button>
          </div>

        </Row>
      </div>
    );
  }
}

export default Form.create()(WhiteLabel);
