import * as React from "react";
import Translate from "../../../../components/i18n/Translate";
import InputLimit from "../../components/InputLimit/InputLimit";
import {Row, Col, notification} from "antd";
import I18n from "../../../../services/i18n/index";
import {Checkbox} from "material-ui";
import {IFileItem} from "./BannerVideo";
import CONFIG from "../../../../constants/config";


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

interface UTMInfo {
    CTA: string;
    URL: string;
    campaign: string;
    source: string;
    content: string;
    medium: string;
}
interface IState {
    showUTMdetails: boolean;
    file?: IFileItem;
    utmAll?: UTMInfo;
    name: string;
}
interface IProps {
    showUTMdetails?: boolean;
    onChange?: (item: UTMInfo) => void;
    file?: IFileItem;
    link?: string;
    onSubmit?: (params: ISubmitParams) => void;
    global?: boolean;
    name?: string;
    cta?: string;
}
export default class UtmForm extends React.Component<IProps, IState> {
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
            name: props.name ? props.name : "",
        };
    }
    /**
     * @func handleSubmit
     * @desc handle form submit and call onSubmit function
     * @param e
     */
    private handleSubmit(e) {
        e.preventDefault();
            if (this.props.onSubmit) {
                this.props.onSubmit(
                    {
                        name: this.state.name,
                        link: this.state.utmAll.URL,
                    }
                );
            }
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
        let utm: UTMInfo  = this.Data;
        utm.URL = value;
        utm.source = this.getQuery(value, "utm_source");
        utm.medium = this.getQuery(value, "utm_medium");
        utm.campaign = this.getQuery(value, "utm_campaign");
        utm.content = this.getQuery(value, "utm_content");
        this.setState({
            utmAll : utm
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
    private showUTMdetails() {
        this.setState({
            showUTMdetails : !this.state.showUTMdetails
        });
    }
    private handleData(item , type: UTM_INPUT) {
            switch (type) {
                case UTM_INPUT.CTA:
                    this.Data.CTA = item.target.value;
                    break;
                case UTM_INPUT.URL:
                    this.Data.URL = item.target.value;
                    break;
                case UTM_INPUT.campaign:
                    this.Data.campaign = item.target.value;
                    break;
                case UTM_INPUT.source:
                    this.Data.source = item.target.value;
                    break;
                case UTM_INPUT.content:
                    this.Data.content = item.target.value;
                    break;
                case UTM_INPUT.medium:
                    this.Data.medium = item.target.value;
                    break;
        }
        if (this.props.onChange) {
            this.props.onChange(this.Data);
        }
        this.setState({
            utmAll: this.Data,
        });
    }
    render() {
        return(
            <div>
                {!this.props.global &&
                <div>
                    <span className="span-block input-title"><Translate value="Name"/></span>
                    <InputLimit
                        placeholder={this.i18n._t("Name") as string}
                        className="input-campaign full-width mb-2"
                        limit={10}
                        value={this.state.name}
                        customOnChange={(e) => this.setState({name: e.target.value})}
                    />
                </div>
                }
                <span className="span-block input-title"><Translate value="Text of Call to Action"/></span>
                <InputLimit
                    placeholder={this.i18n._t("example: online shopping") as string}
                    className="input-campaign full-width mb-2"
                    limit={10}
                    value={this.state.utmAll.CTA}
                    customOnChange={(e) => this.handleData(e, UTM_INPUT.CTA)}
                />
                <span className="span-block input-title"><Translate value="URL*"/></span>
                <input
                    placeholder={this.i18n._t("http://domain.com") as string}
                    className="input-campaign full-width mb-2 dir-ltr"
                    value={this.state.utmAll.URL}
                    onChange={(e) => {this.handleData(e, UTM_INPUT.URL); this.setParamsValues(e.target.value); }}
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
                            onChange={(e) => {this.handleData(e, UTM_INPUT.source); this.onFormChange("utm_source", e.target.value);  } }
                        />
                        <span className="span-block input-title"><Translate
                            value="utm_medium"/></span>
                        <input
                            placeholder={this.i18n._t("clickyab") as string}
                            className="input-campaign full-width mb-2"
                            value={this.state.utmAll.medium}
                            onChange={(e) => {this.handleData(e, UTM_INPUT.medium); this.onFormChange("utm_medium", e.target.value); }}
                        />
                    </Col>
                    <Col span={12}>
                        <span className="span-block input-title"><Translate
                              value="utm_campaign"/></span>
                        <input
                            placeholder={this.i18n._t("clickyab") as string}
                            className="input-campaign full-width mb-2"
                            onChange={(e) => {this.handleData(e, UTM_INPUT.campaign); this.onFormChange("utm_campaign", e.target.value); }}
                        />
                        <span className="span-block input-title"><Translate
                            value="utm_content"/></span>
                        <input
                            placeholder={this.i18n._t("clickyab") as string}
                            className="input-campaign full-width mb-2"
                            onChange={(e) => {this.handleData(e, UTM_INPUT.content) ; this.onFormChange("utm_content", e.target.value); }}
                        />
                    </Col>
                </Row>
                }
            </div>
        );
    }

}