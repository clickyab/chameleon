/**
 * @file Upload Universal App
 */
import * as React from "react";
import {connect} from "react-redux";
import {withRouter, RouteComponentProps} from "react-router";
import {IStateUpload} from "./UploadBanner";
import {Upload, Row, Col, Button, Form, Spin, notification} from "antd";
import Translate from "../../../../components/i18n/Translate/index";
import CONFIG from "../../../../constants/config";
import {UploadState} from "../../../../services/Upload/index";
import I18n from "../../../../services/i18n/index";
import "./style.less";
import {
    ControllersApi,
    ControllersCampaignGetResponse, ControllersEditNativePayload,
    OrmCampaign,
    ControllersCreateBannerResponseInner
} from "../../../../api/api";
import STEPS from "../../steps";
import {RootState} from "../../../../redux/reducers/index";
import {setCurrentStep, setCurrentCampaign, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import UTMDynamicForm, {InputInfo} from "./UtmDynamicForm";
import UploadFile, {UPLOAD_MODULES} from "../../components/UploadFile";
import CreativeGeneralInfo from "../../../../components/CreativeGeneralInfo";
import {assetObjGen, assetPushObjArray} from "../../../../services/Utils/assetInputFormatter";
import Icon from "../../../../components/Icon";
import getCrativeFormValues from "./utils/getCrativeFormValues";


const Dragger = Upload.Dragger;
const FormItem = Form.Item;

/**
 * @interface IFileItem
 * @desc define single file object
 */
export interface IFileItem {
    id: number | string;
    fileObject: any;
    state: UploadState;
    utm: string;
    name: string;
    width: number;
    height: number;
    cta: string;
    edited: boolean;
}

const enum FILE_TYPE {IMG_JPG = "image/jpeg", IMG_PNG = "image/png", IMG_GIF = "image/gif", VID_MP4 = "video/mp4"}


interface IOwnProps {
    currentCampaign: OrmCampaign;
    currentCreative?: ControllersCreateBannerResponseInner;
}

interface IProps extends RouteComponentProps<any> {
    form: any;
    currentCampaign: OrmCampaign;
    currentStep: STEPS;
    setSelectedCampaignId?: (id: number | null) => {};
    setCurrentStep?: (step: STEPS) => {};
    selectedCampaignId?: number | null;
    currentCreative?: ControllersCreateBannerResponseInner;
}


/**
 * @interface IState
 * @desc define state object
 */
interface IState extends IStateUpload {
    showCropModal: boolean;
    moreUploadOption: boolean;
}

@connect(mapStateToProps, mapDispatchToProps)
class UploadUniversalApp extends React.Component <IProps, IState> {
    private i18n = I18n.getInstance();
    private initialValues;
    private FormObject: InputInfo[];

    private minSizeIcon = {
        width: 512,
        height: 512,
    };
    private minLogoSize = {
        width: 627,
        height: 627,
    };
    private minVideoSize = {
        width: 320,
        height: 48
    };
    private minImageVerticalSize = {
        width: 320,
        height: 480,
    };
    private minImageHorizentalSize = {
        width: 480,
        height: 320,
    };

    /**
     * @constructor
     * @desc Set initial state and binding
     * @param {IProps} props
     */
    constructor(props: IProps) {
        super(props);
        this.state = {
            currentCampaign: props.currentCampaign && props.currentCampaign.id === this.props.match.params.id ? props.currentCampaign : null,
            files: [],
            moreUploadOption: (props.currentCreative.assets.h_image || props.currentCreative.assets.logo) ? true : false,
            openImageModal: false,
            showCropModal: false,
        };
        this.initialValues = getCrativeFormValues(this.props.currentCreative);
        this.FormObject = this.getFormObject();
    }

    public componentDidMount() {
        this.setState({
            currentCampaign: this.props.currentCampaign,
        });
    }

    private getFormObject(): InputInfo [] {
        const FormObject: InputInfo[] = [
            {
                title: this.i18n._t("Title") as string,
                name: "title",
                type: "limiter",
                limit: 50,
                placeholder: "your title will display below image",
                required: true,
                value: this.initialValues.title,
            },
            {
                title: this.i18n._t("Description") as string,
                name: "description",
                type: "limiter",
                limit: 150,
                required: true,
                multiLine: true,
                className: "textarea-campaign",
                value: this.initialValues.description,
            },
            {
                title: this.i18n._t("Call to Action text") as string,
                name: "cta",
                type: "limiter",
                limit: 15,
                placeholder: "example: online shopping",
                required: true,
                value: this.initialValues.cta,
            },
            {
                title: this.i18n._t("Rating") as string,
                name: "rating",
                type: "rating",
                value: this.initialValues.rating,
            },
            {
                title: this.i18n._t("URL") as string,
                name: "url",
                type: "url",
                placeholder: "",
                required: true,
                value: this.initialValues.utm,
            },
            {
                title: this.i18n._t("price") as string,
                name: "price",
                type: "currency-selector",
                placeholder: "45,000",
                currancyType: "IRR",
                halfSize: true,
                offset: true,
                optional: true,
                value: this.initialValues.price,
            },
            {
                title: this.i18n._t("Final price with discount") as string,
                name: "sale_price",
                type: "currency-selector",
                placeholder: "20,000",
                currancyType: "IRR",
                halfSize: true,
                offset: true,
                optional: true,
                value: this.initialValues.salePrice,
            },
            {
                title: this.i18n._t("Number of downloads") as string,
                name: "download",
                type: "textfield",
                placeholder: "1500",
                number: true,
                halfSize: true,
                offset: true,
                optional: true,
                value: this.initialValues.downloads,
            },
            {
                title: this.i18n._t("Contact number") as string,
                name: "phone",
                placeholder: "+98-----------",
                type: "textfield",
                number: true,
                className: "dir-ltr",
                optional: true,
                value: this.initialValues.phone,
            }
        ];
        return FormObject;
    }

    private handleSubmit() {

        this.props.form.validateFields((err, values) => {
            if (err) return;
            const controllerApi = new ControllersApi();

            const payload = {
                assets: {
                    cta: values.cta ? [{val: values.cta}] : null,
                    description: values.description ? [{val: values.description}] : null,
                    downloads: parseInt(values.download) ? [{val: parseInt(values.download)}] : null,
                    video: values.video ? [{val: values.video}] : null,
                    h_image: assetPushObjArray(assetObjGen("imageHorizental", values.imageHorizental)),
                    v_image: assetPushObjArray(assetObjGen("imageVertical", values.imageVertical)),
                    icon: values.icon ? [{val: values.icon}] : null,
                    logo: values.log ? [{val: values.logo}] : null,
                    phone: values.phone ? [{val: values.phone.toString()}] : null,
                    price: parseInt(values.price) ? [{val: parseInt(values.price)}] : null,
                    rating: parseFloat(values.rating) ? [{val: parseFloat(values.rating)}] : null,
                    title: values.title ? [{val: values.title}] : null,
                    sale_price: parseInt(values.sale_price) ? [{val: parseInt(values.sale_price)}] : null,
                },
                campaign_id: this.state.currentCampaign.id,
                url: values.url,
                name: values.creativeName,
                max_bid: values.unitCost ? parseInt(values.unitCost) : null,
            };
            if (this.props.currentCreative) {
                controllerApi.adNativeIdPut({
                    id: this.props.currentCreative.creative.id.toString(),
                    payloadData: payload,
                }).then(() => {
                    notification.success({
                        message: this.i18n._t("Your Ad has been updated."),
                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                        description: "",
                    });
                    this.props.history.push(`/campaign/upload/${this.props.currentCampaign.id}`);
                }).catch(() => {
                    notification.error({
                        message: this.i18n._t("Error in update creative."),
                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                        description: "",
                    });
                });
            } else {
                controllerApi.adNativePost({
                    payloadData: payload,
                }).then((data) => {
                    notification.success({
                        message: this.i18n._t("Your Ad has created and assigned to campaign."),
                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                        description: "",
                    });
                    this.props.history.push(`/campaign/check-publish/${this.props.currentCampaign.id}`);
                }).catch((err) => {
                    notification.error({
                        message: this.i18n._t("Error in create and assign to campaign."),
                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                        description: "",
                    });
                });
                this.props.history.push(`/campaign/upload/${this.props.currentCampaign.id}`);
            }
        });

        let banners = [];
        this.state.files.map((file) => {
            banners.push({
                utm: file.utm,
                src: file.state.url,
                id: file.id.toString().indexOf("tmp_") === 0 ? null : file.id,
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
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Row type="flex" gutter={16}>
                        <Col span={24} className={"column-border-bottom uploaders-container"}>
                            <Row type={"flex"} gutter={16}>
                                <Col span={5}>
                                    <FormItem>
                                        {getFieldDecorator("icon", {
                                            required: true, message: this.i18n._t("Please upload Icon!"),
                                            initialValue: this.initialValues.iconUrl,
                                        })(
                                            <UploadFile label={this.i18n._t("Icon of application") as string}
                                                        fileType={[FILE_TYPE.IMG_PNG]}
                                                        minDimension={this.minSizeIcon}
                                                        ratio={this.minSizeIcon}
                                                        uploadModule={UPLOAD_MODULES.NATIVE_BANNER}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem>
                                        {getFieldDecorator("video", {
                                            initialValue: this.initialValues.videoUrl,
                                        })(
                                            <UploadFile label={this.i18n._t("video") as string}
                                                        fileType={[FILE_TYPE.VID_MP4]}
                                                        minDimension={this.minVideoSize}
                                                        uploadModule={UPLOAD_MODULES.NATIVE_VIDEO}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={5}>
                                    <FormItem>
                                        {getFieldDecorator("imageVertical", {
                                            initialValue: this.initialValues.imageVerticalUrl,
                                            required: true, message: this.i18n._t("Please upload Image!")
                                        })(
                                            <UploadFile label={this.i18n._t("Ad image(vertical)") as string}
                                                        fileType={[FILE_TYPE.IMG_JPG, FILE_TYPE.IMG_PNG, FILE_TYPE.IMG_GIF]}
                                                        minDimension={this.minImageVerticalSize}
                                                        uploadModule={UPLOAD_MODULES.NATIVE_BANNER}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={3}>
                                </Col>
                            </Row>
                            {this.state.moreUploadOption &&
                            <Row type={"flex"} gutter={16}>
                                <Col span={5}>
                                    <FormItem>
                                        {getFieldDecorator("logo", {
                                            initialValue: this.initialValues.logoUrl,
                                        })(
                                            <UploadFile
                                                label={this.i18n._t("Logo of site, app or corporation") as string}
                                                fileType={[FILE_TYPE.IMG_PNG]}
                                                minDimension={this.minLogoSize}
                                                uploadModule={UPLOAD_MODULES.NATIVE_BANNER}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem>
                                        {getFieldDecorator("imageHorizental", {
                                            initialValue: this.initialValues.imageHorizontalUrl,
                                        })(
                                            <UploadFile label={this.i18n._t("Ad image(horizontal)") as string}
                                                        fileType={[FILE_TYPE.IMG_JPG, FILE_TYPE.IMG_PNG, FILE_TYPE.IMG_GIF]}
                                                        minDimension={this.minImageHorizentalSize}
                                                        ratio={this.minImageHorizentalSize}
                                                        uploadModule={UPLOAD_MODULES.NATIVE_BANNER}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            }
                            {!this.state.moreUploadOption &&
                            <div className="mb-2">
                                <div className="more-option"
                                     onClick={() => this.setState({moreUploadOption: !this.state.moreUploadOption})}>
                                    <Icon name={"cif-plusbold"}/>
                                    <Translate value={"show more option"}/>
                                </div>
                            </div>
                            }
                        </Col>
                        <Col span={24} className={"column-border-bottom uploaders-container"}>
                            <Row gutter={16} type="flex">
                                <Col span={8}>
                                    <Col span={24}>
                                        <div className="upload-setting">
                                          <span className="upload-title-setting span-block">
                                           <Translate value={"Ad general information"}/>
                                           </span>
                                        </div>
                                    </Col>
                                    <CreativeGeneralInfo form={this.props.form} value={{
                                        unitCost: this.initialValues.maxBid,
                                        name: this.initialValues.adName
                                    }}/>
                                </Col>
                                <Col span={16}>
                                </Col>
                            </Row>
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
                </Form>
            </div>
        );
    }
}


function mapStateToProps(state: RootState, ownProps: IOwnProps) {
    return {
        currentStep: state.campaign.currentStep,
        selectedCampaignId: state.campaign.selectedCampaignId
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setCurrentStep: (step: STEPS) => dispatch(setCurrentStep(step)),
        setSelectedCampaignId: (id: number | null) => dispatch(setSelectedCampaignId(id)),
    };
}


export default withRouter<IOwnProps>(Form.create()(UploadUniversalApp));
