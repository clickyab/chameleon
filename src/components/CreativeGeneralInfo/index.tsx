/**
 * @file CreativeGeneralInfo
 * @desc this component used on create creative template pages.
 */
import * as React from "react";
import {Form, Col} from "antd";
import InputLimit from "../../containers/Campaign/components/InputLimit/InputLimit";
import Currency from "../Currency";
import Translate from "../i18n/Translate";
import I18n from "../../services/i18n";
import {rangeCheck} from "../../services/Utils/CustomValidations";

const FormItem = Form.Item;

interface IGeneralInfo {
    name: string;
    unitCost: number;
}

interface IProps {
    form: any;
    value?: IGeneralInfo;
}

class CreativeGeneralInfo extends React.Component<IProps> {
    private i18n = I18n.getInstance();
    constructor(props) {
        super(props);
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
                <Form>
                    <FormItem>
                        <span className="span-block input-title require"><Translate value="Choose name for Ad"/></span>
                        {getFieldDecorator("creativeName", {
                            initialValue: this.props.value ? (this.props.value.name ? this.props.value.name : "") : "",
                            rules: [{required: true, message: this.i18n._t("Please enter your adName!")}],
                        })(
                            <InputLimit
                                placeholder={this.i18n._t("Name for Creative") as string}
                                className="input-campaign full-width"
                                limit={10}
                            />)}
                    </FormItem>
                    <span className="span-block input-title require"><Translate value="Choose name for Ad"/></span>
                    <Col span={12} className={"currency-container"}>
                        <span className="vertical-center"><Translate value={"Toman"}/></span>
                    </Col>
                    <Col span={12}>
                        <FormItem className={"have-description validate-form"}>
                            {getFieldDecorator("unitCost", {
                                initialValue: this.props.value ? (this.props.value.unitCost ? this.props.value.unitCost : "") : "",
                                rules: [{required: true, message: this.i18n._t("Please enter unit cost")}, {
                                    validator: rangeCheck,
                                    minimum: 250,
                                    message: this.i18n._t("Minimum price is 250 toman per click")
                                }],
                            })(
                                <Currency className={"input-campaign"} type={"toman"} placeholder={"example: 25"}/>)}
                            <span className="description validate-form-description"><Translate
                                value={"Minimum price is 250 toman per click"}/></span>
                        </FormItem>
                    </Col>
                </Form>
        );
    }
}
export default CreativeGeneralInfo;
