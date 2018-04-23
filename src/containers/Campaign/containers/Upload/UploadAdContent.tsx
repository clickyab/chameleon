/**
 * @file Upload Ad Content
 */
import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {Row, Col, Button, Form, Spin} from "antd";
import Translate from "../../../../components/i18n/Translate/index";
import CONFIG from "../../../../constants/config";
import {UploadState} from "../../../../services/Upload/index";
import I18n from "../../../../services/i18n/index";
import "./style.less";
import {ControllersApi, OrmCampaign} from "../../../../api/api";
import STEPS from "../../steps";
import {RootState} from "../../../../redux/reducers/index";
import {setCurrentStep, setCurrentCampaign, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import InputLimit from "../../components/InputLimit/InputLimit";
import UTMDynamicForm, {InputInfo} from "./UtmDynamicForm";
import UploadFile, {FILE_TYPE, MODULE} from "../../components/UploadFile";
import CreativeGeneralInfo from "../../../../components/CreativeGeneralInfo";

const FormItem = Form.Item;

/**
 * @interface IFileItem
 * @desc define single file object
 */
export interface IFileItem {
    id?: number | string;
    fileObject?: any;
    state?: UploadState;
    utm?: string;
    name: string;
    width?: number;
    height?: number;
    cta?: string;
    edited?: boolean;
}

interface IProps {
    currentCampaign: OrmCampaign;
    setCurrentStep?: (step: STEPS) => {};
    form?: any;
    setSelectedCampaignId?: (id: number | null) => {};
    currentStep?: STEPS;
    selectedCampaignId?: number | null;
    match?: any;
    history?: any;
}

const enum IMG_TYPE {LOGO, IMAGE}

/**
 * @interface IState
 * @desc define state object
 */
interface IState {
    currentCampaign: OrmCampaign;
}

@connect(mapStateToProps, mapDispatchToProps)
class UploadAdContent extends React.Component <IProps, IState> {
    private i18n = I18n.getInstance();
    private minSizeWide = {
        width: 627,
        height: 627,
    };
    private FormObject: InputInfo[] = [
        {
            title: this.i18n._t("Title") as string,
            name: "title",
            type: "limiter",
            limit: 50,
            placeholder: this.i18n._t("your title will display below image") as string,
            required: true,
        },
        {
            title: this.i18n._t("Description") as string,
            name: "description",
            type: "limiter",
            limit: 150,
            required: true,
            multiLine: true,
            className: "textarea-campaign"
        },
        {
            title: this.i18n._t("Call to Action text") as string,
            name: "cta",
            type: "limiter",
            limit: 15,
            placeholder: this.i18n._t("example: online shopping") as string,
        },
        {
            title: this.i18n._t("Contact number") as string,
            name: "phone",
            type: "textfield",
            number: true,
            placeholder: this.i18n._t("+98----------") as string,
            className: "dir-ltr"
        },
        {
            title: this.i18n._t("URL") as string,
            name: "url",
            type: "url",
            placeholder: "",
            required: true,
        }
    ];

    /**
     * @constructor
     * @desc Set initial state and binding
     * @param {IProps} props
     */
    constructor(props: IProps) {
        super(props);
        this.state = {
            currentCampaign: props.currentCampaign && props.currentCampaign.id === this.props.match.params.id ? props.currentCampaign : null,
        };
    }

    public componentDidMount() {
        this.setState({
            currentCampaign: this.props.currentCampaign,
        });
    }

    private handleBack() {
        this.props.setCurrentStep(STEPS.SELECT_PUBLISHER);
        this.props.history.push(`/campaign/select-publisher/${this.props.match.params.id}`);
    }

    private handleSubmit() {

        this.props.form.validateFields((err, values) => {
            console.log(err, values);
            if (err) return;
            const controllerApi = new ControllersApi();
            controllerApi.adNativePost({
                payloadData: {
                    assets: {
                        cta: values.cta,
                        description: values.description,
                        downloads: values.download ? parseInt(values.download) : null,
                        video: values.video,
                        image: values.image,
                        logo: values.logo,
                        phone: values.phone || null,
                        price: values.price ? parseInt(values.price) : null,
                        rating: values.rating ? parseFloat(values.rating) : null,
                        saleprice: values.salePrice ? parseInt(values.salePrice) : null,
                        title: values.title,
                    },
                    creative: {
                        campaign_id: this.state.currentCampaign.id,
                        url: values.url,
                    }
                }
            }).then((data) => {
                console.log(data);
            });
        });

    }

    /**
     * @func render
     * @desc render component
     * @returns {any}
     */
    public render() {

        const {getFieldDecorator} = this.props.form;
        if (this.props.match.params.id && !this.state.currentCampaign) {
            return <Spin/>;
        }

        return (
            <div dir={CONFIG.DIR} className="upload-content">
                <div className="title">
                    <h2><Translate value="Media upload"/></h2>
                </div>
                <Row type="flex" gutter={16}>
                    <Col span={16} offset={8}>
                        <span className="span-block upload-media mb-1"><Translate value={"Upload media"}/></span>
                    </Col>
                    <Col span={24} className={"column-border-bottom upload-container"}>
                        <Row type={"flex"} gutter={16}>
                            <Col span={8}>
                                <FormItem>
                                    {getFieldDecorator("image", {})(
                                        <UploadFile label={"wide image"}
                                                    minDimension={this.minSizeWide}
                                                    required={true}
                                                    fileType={[FILE_TYPE.IMG_JPG, FILE_TYPE.IMG_PNG, FILE_TYPE.IMG_GIF]}
                                                    uploadModule={MODULE.IMAGE}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={5}>
                                <FormItem>
                                    {getFieldDecorator("logo", {})(
                                        <UploadFile label={"Logo"}
                                                    minDimension={this.minSizeWide}
                                                    fileType={[FILE_TYPE.IMG_PNG]}
                                                    uploadModule={MODULE.IMAGE}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24} className={"column-border-bottom"}>
                            <Col span={8} offset={16}>
                                <Col span={24}>
                                    <div className="upload-setting">
                        <span className="upload-title-setting span-block">
                           <Translate value={"Ad general information"}/>
                        </span>
                                    </div>
                                </Col>
                                <CreativeGeneralInfo form={this.props.form}/>
                            </Col>
                    </Col>
                    <Col span={8}>
                        <Row className="upload-setting">
                            <UTMDynamicForm form={this.props.form} inputObject={this.FormObject}/>
                        </Row>
                    </Col>
                    <Row type="flex" align="middle" className="full-width">
                        <Button className="btn-general btn-submit ml-1"
                                onClick={this.handleSubmit.bind(this)}
                        >
                            <Translate value={"Save and creat new ad"}/>
                        </Button>
                        <Button className="btn-general btn-cancel"><Translate value={"Cancel"}/></Button>
                    </Row>
                </Row>
            </div>
        );
    }
}

interface IOwnProps {
    match?: any;
    history?: any;
}

function mapStateToProps(state: RootState, ownProps: IOwnProps) {
    return {
        currentStep: state.campaign.currentStep,
        selectedCampaignId: state.campaign.selectedCampaignId,
        match: ownProps.match,
        history: ownProps.history,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setCurrentStep: (step: STEPS) => dispatch(setCurrentStep(step)),
        setSelectedCampaignId: (id: number | null) => dispatch(setSelectedCampaignId(id)),
    };
}


export default Form.create<IProps>()(withRouter(UploadAdContent as any));
