import * as React from "react";
import {Row, Col} from "antd";
import Translate from "../../../../components/i18n/Translate";
import {Checkbox} from "material-ui";
import {IFileItem} from "../../containers/Upload/UploadBanner";
import I18n from "../../../../services/i18n";


enum UTM_INPUT {
    CTA = "CTA",
    URL = "URL",
    campaign = "campaign",
    source = "source",
    content = "content",
    medium = "medium"
}
/**
 * @interface ISubmitParams
 * @desc define exported object on submit modal's form
 */
interface ISubmitParams {
    link: string;
    name: string;
}
/**
 * @interface UTMInfo
 * @desc define interface for UTM
 */
export interface UTMInfo {
    CTA: string;
    URL: string;
    campaign: string;
    source: string;
    content: string;
    medium: string;
}
interface InputInfo {
    title: string;
    type: "textfield" | "limiter" | "url";
    placeholder: string;
    limit?: number;
    required?: boolean;
    value?: string;
}
interface IState {
    showUTMdetails: boolean;
    file?: IFileItem;
    utmAll?: UTMInfo;
    name: string;
    value?: string;
}
interface IProps {
    value?: string;
    showUTMdetails?: boolean;
    form?: any;
    onChange?: (item: string) => void;
    file?: IFileItem;
    link?: string;
    onSubmit?: (params: ISubmitParams) => void;
    name?: string;
    cta?: string;
    customOnKeyPress?: (item: boolean) => void;
    shouldUpdate?: boolean;
    inputObject?: InputInfo[];
}

export default class UTMInput extends React.Component<IProps, IState> {
    private i18n = I18n.getInstance();
    private Data: UTMInfo = {
        CTA: this.props.cta ? this.props.cta : "",
        URL: this.props.link ? this.props.link : "",
        campaign: "",
        source: "",
        content: "",
        medium: ""
    };

    constructor(props) {
        super(props);
        this.state = {
            showUTMdetails : props.showUTMdetails ? props.showUTMdetails : false,
            utmAll : this.Data,
            value: props.value ? props.value : "",
            name: props.name ? props.name : "",
        };
    }
    /**
     * @func
     * @desc set params and file from props
     */
    public componentDidMount() {
        if (this.props.link) {
            this.setParamsValues(this.props.link);
        }
        if (this.props.file) {
            this.setState({
                file: this.props.file,
            });
        }
    }

    /**
     * @file getQuery
     * @desc extract params from url (query string)
     * @param link
     * @param parameter
     * @returns {any}
     */
    private getQuery(link, parameter) {
        const query = link.split("?")[1];
        if (!query) return "";

        const params = query.split("&");
        let value = "";
        params.forEach((p) => {
            const keyValue = p.split("=");
            if (keyValue[0] === parameter) value = keyValue[1];
        });
        return value;
    }

    /**
     * @file setParamsValues
     * @desc try to extract utm params from link and set state
     * @param value
     */
    private setParamsValues(value) {
        value = value.toLowerCase();
        let utm: UTMInfo = this.Data;
        utm.URL = value;
        utm.source = this.getQuery(value, "utm_source");
        utm.medium = this.getQuery(value, "utm_medium");
        utm.campaign = this.getQuery(value, "utm_campaign");
        utm.content = this.getQuery(value, "utm_content");
        this.setState({
            utmAll: utm,
            value: utm.URL
        });
    }

    /**
     * @func onFormChange
     * @desc handle parameter change in form and update link
     * @param name
     * @param value
     */
    private onFormChange(name, value) {
        this.setState((prevState: IState) => {
            if (prevState.utmAll.URL.indexOf(`${name}=`) === -1) {
                if (prevState.utmAll.URL.indexOf("?") === -1) {
                    if (value !== "") {
                        prevState.utmAll.URL = prevState.utmAll.URL + `?${name}=${value}`;
                    }
                } else {
                    prevState.utmAll.URL = prevState.utmAll.URL + `&${name}=${value}`;
                }
            } else {
                if (value !== "") {
                    prevState.utmAll.URL = prevState.utmAll.URL.replace(`${name}=${prevState[name]}`, `${name}=${value}`);
                }
                else {
                    prevState.utmAll.URL = prevState.utmAll.URL.replace(`${name}=${prevState[name]}`, ``).slice(0, -1);
                }
            }
            prevState[name] = value;
            return prevState;
        });
    }

    private handleKeyPress() {
        if (this.props.customOnKeyPress) {
            this.props.customOnKeyPress(true);
        }
    }

    /**
     * @func showUTMdetails
     * @desc Show/Hide Utm Detail
     */
    private showUTMdetails() {
        this.setState({
            showUTMdetails: !this.state.showUTMdetails
        });
    }

    /**
     * @func handleData
     * @desc handle Data after every onChange
     */
    private handleData(value, type: UTM_INPUT) {
        this.Data[type] = value;
        if (this.props.onChange) {
            this.props.onChange(this.Data.URL);
        }
        this.setState({
            utmAll: this.Data,
            value: this.Data.URL,
        });
    }

    render() {
        return(
        <div>
                <span className="span-block input-title"><Translate value="URL*"/></span>
                <input
                    placeholder={this.i18n._t("http://domain.com") as string}
                    className="input-campaign full-width mb-2 dir-ltr"
                    value={this.state.value}
                    onChange={(e) => {
                        this.handleData(e.target.value, UTM_INPUT.URL);
                        this.setParamsValues(e.target.value);
                    }}
                    onKeyPress={() => this.handleKeyPress()}
                />
                <Checkbox className={`checkbox${this.state.showUTMdetails ? "-checked" : ""} stick`}
                          checked={this.state.showUTMdetails}
                          label={this.i18n._t("Setting UTM parameters")}
                          onClick={() => this.showUTMdetails()}
                />
                {this.state.showUTMdetails &&
                <Row gutter={20} className="mt-2">
                    <Col span={12}>
                        <span className="span-block input-title"><Translate
                            value="utm_source"/></span>
                        <input
                            placeholder={this.i18n._t("clickyab") as string}
                            className="input-campaign full-width mb-2"
                            value={this.state.utmAll.source}
                            onChange={(e) => {
                                this.handleData(e.target.value, UTM_INPUT.source);
                                this.onFormChange("utm_source", e.target.value);
                            }}
                            onKeyPress={() => this.handleKeyPress()}
                        />
                        <span className="span-block input-title"><Translate
                            value="utm_medium"/></span>
                        <input
                            placeholder={this.i18n._t("clickyab") as string}
                            className="input-campaign full-width mb-2"
                            value={this.state.utmAll.medium}
                            onChange={(e) => {
                                this.handleData(e.target.value, UTM_INPUT.medium);
                                this.onFormChange("utm_medium", e.target.value);
                            }}
                            onKeyPress={() => this.handleKeyPress()}
                        />
                    </Col>
                    <Col span={12}>
                        <span className="span-block input-title"><Translate
                            value="utm_campaign"/></span>
                        <input
                            placeholder={this.i18n._t("clickyab") as string}
                            className="input-campaign full-width mb-2"
                            value={this.state.utmAll.campaign}
                            onChange={(e) => {
                                this.handleData(e.target.value, UTM_INPUT.campaign);
                                this.onFormChange("utm_campaign", e.target.value);
                            }}
                            onKeyPress={() => this.handleKeyPress()}
                        />
                        <span className="span-block input-title"><Translate
                            value="utm_content"/></span>
                        <input
                            placeholder={this.i18n._t("clickyab") as string}
                            className="input-campaign full-width mb-2"
                            onChange={(e) => {
                                this.handleData(e.target.value, UTM_INPUT.content);
                                this.onFormChange("utm_content", e.target.value);
                            }}
                            onKeyPress={() => this.handleKeyPress()}
                            value={this.state.utmAll.content}
                        />
                    </Col>
                </Row>
                }
        </div>);
    }
}