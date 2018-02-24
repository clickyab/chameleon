import * as React from "react";
import Translate from "../../../../components/i18n/Translate";
import InputLimit from "../../components/InputLimit/InputLimit";
import UTMInput from "../../components/UTMInput";
import {Row, Col, notification} from "antd";
import I18n from "../../../../services/i18n/index";
import {Checkbox} from "material-ui";
import {IFileItem} from "./UploadBanner";
import {Form} from "antd";
import CONFIG from "../../../../constants/config";
import {withRouter} from "react-router";
import UtmForm from "./UtmForm";
import Rating from "../../components/Rating";
const FormItem = Form.Item;

/**
 * @interface ISubmitParams
 * @desc define exported object on submit modal's form
 */
interface ISubmitParams {
    link: string;
    name: string;
}

export interface InputInfo {
    title: string;
    type: "textfield" | "limiter" | "url" | "rating";
    placeholder?: string;
    limit?: number;
    required?: boolean;
    value?: string;
    className?: string;
    multiLine?: boolean;
    optional?: boolean;
    halfSize?: boolean;
    offset?: boolean;
}
interface IState {
    value: any;
    moreOption: boolean;
    showMoreOption: boolean;
}
interface IProps {
    form?: any;
    value?: any;
    link?: string;
    onSubmit?: (params: ISubmitParams) => void;
    customOnKeyPress?: (item: boolean) => void;
    inputObject: InputInfo[];
    onChange?: any;
}

class UtmDynamicForm extends React.Component<IProps, IState> {
    private i18n = I18n.getInstance();

    constructor(props) {
        super(props);
        this.state = {
            value: props.value ? props.value : "",
            moreOption: false,
            showMoreOption: false,
        };
    }
    public componentDidMount() {
        if (this.props.inputObject && this.props.inputObject.filter(item => item.optional)) {
            this.setState({
                moreOption: true,
            });
        }
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        return(
                <Form>
                {this.props.inputObject && this.props.inputObject.filter(item => (this.state.showMoreOption || !item.optional)).map((value: InputInfo, index) => {
                        if (value.type === "textfield" && value.required) {
                            return <Col span={value.halfSize ? 12 : 24} offset={value.offset ? 12 : 0} className={value.halfSize ? "field-half-size" : ""} key={value.title}>
                            <FormItem>
                                    <span className="span-block input-title">{this.i18n._t(value.title)}</span>
                                    {getFieldDecorator(value.title, {
                                        initialValue: value.value,
                                        rules: [{required: value.required ? value.required : false , message: this.i18n._t("This field is required")}],
                                    })(
                                        <input
                                            placeholder={this.i18n._t(value.placeholder) as string}
                                            className={`input-campaign full-width + ${value.className ? value.className : ""}`}
                                        />
                                    )}
                                </FormItem>
                            </Col>;
                        }
                        else if (value.type === "limiter") {
                            return <Col span={value.halfSize ? 12 : 24} offset={value.offset ? 12 : 0} className={value.halfSize ? "field-half-size" : ""} key={value.title}>
                            <FormItem>
                                    <span className="span-block input-title">{this.i18n._t(value.title)}</span>
                                    {getFieldDecorator(value.title, {
                                        initialValue: value.value,
                                        rules: [{required: value.required ? value.required : false , message: this.i18n._t("This field is required")}],
                                    })(
                                        <InputLimit
                                            placeholder={this.i18n._t(value.placeholder) as string}
                                            className={`input-campaign full-width + ${value.className ? value.className : ""}`}
                                            limit={value.limit}
                                            multiLine={value.multiLine}
                                        />
                                    )}
                                </FormItem>
                            </Col>;
                        }
                        else if (value.type === "url") {
                            return <Col span={value.halfSize ? 12 : 24} offset={value.offset ? 12 : 0} className={value.halfSize ? "field-half-size" : ""} key={value.title}>
                            <FormItem>
                                    {getFieldDecorator(value.title, {
                                        initialValue: value.title,
                                        rules: [{required: value.required ? value.required : false , message: this.i18n._t("This field is required")}],
                                    })(
                                <UTMInput />
                                    )}
                                </FormItem>
                            </Col>;
                        }
                        else if (value.type === "rating") {
                            return <Col span={value.halfSize ? 12 : 24} offset={value.offset ? 12 : 0} className={value.halfSize ? "field-half-size" : ""} key={value.title}>
                            <FormItem>
                                {getFieldDecorator(value.title, {
                                    initialValue: 3,
                                    rules: [{required: value.required ? value.required : false , message: this.i18n._t("This field is required")}],
                                })(
                                    <Rating allowHalf className={"rating-utm"}/>
                                )}
                            </FormItem>
                            </Col>;
                        }
                })}
                    {this.state.moreOption && !this.state.showMoreOption &&
                        <a onClick={() => this.setState({showMoreOption: !this.state.showMoreOption})}><Translate value={"show more option"}/></a>
                    }
                </Form>
        );
    }

}
export default Form.create<IProps>()(UtmDynamicForm);