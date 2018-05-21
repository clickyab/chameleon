import * as React from "react";
import {Row, Col, Form, Input, Select, Radio, Checkbox, Button} from "antd";
import CONFIG from "../../../../../../constants/config";
import Translate from "../../../../../../components/i18n/Translate/index";
import I18n from "../../../../../../services/i18n/index";
import "./style.less";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
export const enum ACCOUNT_TYPE {ADVERTIZER = "Advertiser" , PUBLISHER = "Publisher" , SUPPORTER = "Support"}

interface IProps {
    form: any;
}

interface IState {

}

class AddUser extends React.Component<IProps, IState> {
    private i18n = I18n.getInstance();

    public render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div dir={CONFIG.DIR} className="backoffice-content">
                <Row className="backoffice-title mb-3" type={"flex"}>
                    <Col>
                        <h2><Translate value="Create new user account"/></h2>
                        <p><Translate
                            value="Fill below form and register your user. Information will be sent automatically after registration "/>
                        </p>
                    </Col>
                </Row>
                <Row type="flex">
                    <Col span={24} className={"mb-2"}>
                        <h4><Translate value={"User Login information"}/></h4>
                    </Col>
                    <Col span={18}>
                        <Row gutter={16} align={"middle"} type={"flex"} className={"mb-2"}>
                            <Col span={12}>
                                <FormItem className="has-error-help">
                                    <span className="input-title require"><Translate value="User email"/></span>
                                    {getFieldDecorator("email", {
                                        rules: [{
                                            required: true,
                                            message: this.i18n._t("Please input your user Email address!")
                                        }],
                                    })(
                                        <Input
                                            className="input-campaign"
                                            placeholder={this.i18n._t("example@gmail.com") as string}
                                        />)}
                                    <span className="input-description"><Translate
                                        value="Can't change email after registration"/></span>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem>
                                    <span className="input-title require"><Translate value="Account Type"/></span>
                                    {getFieldDecorator("account-type", {
                                        rules: [{
                                            required: true,
                                            message: this.i18n._t("Please choose your user Account type!")
                                        }],
                                    })(
                                        <Select className={"full-width select-input"} placeholder={this.i18n._t("exp: Advertiser, Support & ...") as string}>
                                            <Option value={ACCOUNT_TYPE.ADVERTIZER}><Translate value={ACCOUNT_TYPE.ADVERTIZER}/></Option>
                                            <Option value={ACCOUNT_TYPE.PUBLISHER}><Translate value={ACCOUNT_TYPE.PUBLISHER}/></Option>
                                            <Option value={ACCOUNT_TYPE.SUPPORTER}><Translate value={ACCOUNT_TYPE.SUPPORTER}/></Option>
                                        </Select>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem className="has-error-help">
                                    <span className="input-title require"><Translate value="Password"/></span>
                                    {getFieldDecorator("password", {
                                        rules: [{
                                            required: true,
                                            message: this.i18n._t("Please input your user password")
                                        }],
                                    })(
                                        <Input
                                            className="input-campaign"
                                            placeholder={this.i18n._t("******") as string}
                                        />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem>
                                    <span className="input-title"><Translate value="Account Type"/></span>
                                    {getFieldDecorator("first_name", {
                                        rules: [{
                                            required: true,
                                            message: this.i18n._t("Please input your user Email address!")
                                        }],
                                    })(
                                        <RadioGroup className="full-width">
                                            <Radio value={"person"}><Translate value="Person"/></Radio>
                                            <Radio value={"corporation"}><Translate value="Corporation"/></Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <hr className={"full-width mb-3 line"}/>
                    <Col span={18} className={"mb-3"}>
                        <Row type={"flex"}>
                            <Col span={12} className="form-item-align">
                                <h4 className="black mb-2"><Translate value={"Identification informations"}/></h4>
                                <FormItem className="has-error-help">
                                    <span className="input-title require"><Translate value="Name"/></span>
                                    {getFieldDecorator("name", {
                                        rules: [{
                                            required: true,
                                            message: this.i18n._t("Please input user Name")
                                        }],
                                    })(
                                        <Input
                                            className="input-campaign"
                                            placeholder={this.i18n._t("exp: Ehsan, Alireza , ....") as string}
                                        />)}
                                </FormItem>
                                <FormItem>
                                    <span className="input-title require"><Translate value="Last Name"/></span>
                                    {getFieldDecorator("last_name", {
                                        rules: [{
                                            required: true,
                                            message: this.i18n._t("Please input user Last name")
                                        }],
                                    })(
                                        <Input
                                            className="input-campaign"
                                            placeholder={this.i18n._t("exp: Hosseini, Mahmoodi, ....") as string}
                                        />)}
                                </FormItem>
                                <FormItem>
                                    <span className="input-title require"><Translate value="User mobile number"/></span>
                                    {getFieldDecorator("phone", {
                                        rules: [{
                                            required: true,
                                            message: this.i18n._t("Please input user mobile number")
                                        }],
                                    })(
                                        <Input
                                            className="input-campaign"
                                            placeholder={this.i18n._t("0912 -------") as string}
                                        />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                            </Col>
                        </Row>
                    </Col>
                    <hr className={"full-width mb-3 line"}/>
                    <Col span={18}>
                        <Checkbox className="checkbox-input"><Translate value={"Do you want to send informations to the client?"}/></Checkbox>
                    </Col>
                    <Col span={6}>
                    </Col>
                    <div className="input-btn-wrapper">
                            <Button><Translate value={"Cancel"}/></Button>
                            <Button type={"primary"}><Translate value={"Create user account"}/></Button>
                    </div>
                </Row>
            </div>
        );
    }
}

export default Form.create()(AddUser);
