/**
 * @file Upload Ad Content
 */
import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {Row, Col, Button, Form, Spin, notification} from "antd";
import Translate from "../../../../../components/i18n/Translate/index";
import CONFIG from "../../../../../constants/config";
import {UploadState} from "../../../../../services/Upload/index";
import I18n from "../../../../../services/i18n/index";
import "../style.less";
import {ControllersApi, OrmCampaign, ControllersCreateBannerResponseInner} from "../../../../../api/api";
import STEPS from "../../../steps";
import {RootState} from "../../../../../redux/reducers/index";
import {setCurrentStep, setCurrentCampaign, setSelectedCampaignId} from "../../../../../redux/campaign/actions/index";
import UTMDynamicForm, {InputInfo} from "../UtmDynamicForm";
import UploadFile, {FILE_TYPE, UPLOAD_MODULES} from "../../../components/UploadFile";
import CreativeGeneralInfo from "../../../../../components/CreativeGeneralInfo";
import getCrativeFormValues from "./../utils/getCrativeFormValues";

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
    currentCreative?: ControllersCreateBannerResponseInner;
}


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
            required: false,
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
                        cta: values.cta ? [{val: values.cta}] : null,
                        description: values.description ? [{val: values.description}] : null,
                        downloads: parseInt(values.download) ? [{val: parseInt(values.download)}] : null,
                        h_image: values.images ? [{val: values.images}] : null,
                        logo: values.logo,
                        phone: values.phone ? [{val: values.phone}] : null,
                        rating: parseFloat(values.rating) ? [{val: parseFloat(values.rating)}] : null,
                        title: values.title ? [{val: values.title}] : null,
                    },
                    campaign_id: this.state.currentCampaign.id,
                    url: values.url,
                    name: values.creativeName,
                    max_bid: values.unitCost ? parseInt(values.unitCost) : null,
                }
            }).then((data) => {
                notification.success({
                    message: this.i18n._t("Your Ad has created and assigned to campaign."),
                    className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                    description: "",
                });
                this.props.history.push(`/campaign/check-publish/${this.props.currentCampaign.id}`);
            }).catch((err) => {
                notification.success({
                    message: this.i18n._t("Error in create and assign to campaign."),
                    className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                    description: "",
                });
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

        const initialValues = getCrativeFormValues(this.props.currentCreative);

        return (
            <div dir={CONFIG.DIR} className="upload-content">
                <div className="title">
                    <h2><Translate value="Media upload"/></h2>
                </div>
                <Row type="flex" gutter={16}>
                    <Col span={16} offset={8}>
                        <span className="span-block upload-media mb-1"><Translate value={"Upload media"}/></span>
                    </Col>
                    <Col span={24} className={"column-border-bottom uploaders-container"}>
                        <Row type={"flex"} gutter={16}>
                            <Col span={8}>
                                <FormItem>
                                    {getFieldDecorator("image", {
                                        initialValue: initialValues.imageHorizontalUrl,
                                    })(
                                        <UploadFile label={this.i18n._t("wide image") as string}
                                                    minDimension={this.minSizeWide}
                                                    required={true}
                                                    fileType={[FILE_TYPE.IMG_JPG, FILE_TYPE.IMG_PNG, FILE_TYPE.IMG_GIF]}
                                                    uploadModule={UPLOAD_MODULES.NATIVE_BANNER}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={5}>
                                <FormItem>
                                    {getFieldDecorator("logo", {
                                        initialValue: initialValues.logoUrl,
                                    })(
                                        <UploadFile label={this.i18n._t("Logo") as string}
                                                    minDimension={this.minSizeWide}
                                                    fileType={[FILE_TYPE.IMG_PNG]}
                                                    uploadModule={UPLOAD_MODULES.NATIVE_BANNER}/>
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
                            <CreativeGeneralInfo form={this.props.form}
                                                 value={{
                                                     name: initialValues.adName,
                                                     unitCost: initialValues.maxBid}}/>
                        </Col>
                    </Col>
                    <Col span={8}>
                        <Row className="upload-setting">
                            <UTMDynamicForm form={this.props.form} inputObject={this.FormObject}/>
                        </Row>
                    </Col>
                    <Row type="flex" align="middle" className="full-width mb-3">
                        <Button className="btn-general btn-submit ml-1"
                                onClick={this.handleSubmit.bind(this)}
                        >
                            <Translate value={"Save and create new ad"}/>
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
