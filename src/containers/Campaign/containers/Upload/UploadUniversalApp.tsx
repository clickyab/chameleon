/**
 * @file Upload Universal App
 */
import * as React from "react";
import {connect} from "react-redux";
import {withRouter, RouteComponentProps} from "react-router";
import {IStateUpload} from "./UploadBanner";
import {Upload, Row, Col, Button, Form, Spin} from "antd";
import Translate from "../../../../components/i18n/Translate/index";
import CONFIG from "../../../../constants/config";
import {UploadState} from "../../../../services/Upload/index";
import I18n from "../../../../services/i18n/index";
import "./style.less";
import {ControllersApi, OrmCampaign} from "../../../../api/api";
import STEPS from "../../steps";
import {RootState} from "../../../../redux/reducers/index";
import {setCurrentStep, setCurrentCampaign, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import UTMDynamicForm, {InputInfo} from "./UtmDynamicForm";
import UploadFile, {MODULE} from "../../components/UploadFile";
import CreativeGeneralInfo from "../../../../components/CreativeGeneralInfo";


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
}

interface IProps extends RouteComponentProps<any> {
    form: any;
    currentCampaign: OrmCampaign;
    currentStep: STEPS;
    setSelectedCampaignId?: (id: number | null) => {};
    setCurrentStep?: (step: STEPS) => {};
    selectedCampaignId?: number | null;
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
    private FormObject: InputInfo[] = [
        {
            title: this.i18n._t("Title") as string,
            name: "title",
            type: "limiter",
            limit: 50,
            placeholder: "your title will display below image",
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
            placeholder: "example: online shopping",
            required: true,
        },
        {
            title: this.i18n._t("Rating") as string,
            name: "rating",
            type: "rating",
        },
        {
            title: this.i18n._t("URL") as string,
            name: "url",
            type: "url",
            placeholder: "",
            required: true,
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
        },
        {
            title: this.i18n._t("Final price with discount") as string,
            name: "salePrice",
            type: "currency-selector",
            placeholder: "20,000",
            currancyType: "IRR",
            halfSize: true,
            offset: true,
            optional: true,
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
        },
        {
            title: this.i18n._t("Contact number") as string,
            name: "phone",
            type: "textfield",
            number: true,
            className: "dir-ltr"
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
            files: [],
            moreUploadOption: false,
            openImageModal: false,
            showCropModal: false,
        };
    }

    public componentDidMount() {
        this.setState({
            currentCampaign: this.props.currentCampaign,
        });
    }

    checkAndSetUtm() {
        let utms = {};
        this.state.files.map(file => {
            utms[file.utm] = file.utm;
        });
        if (Object.keys(utms).length === 1) {
            // TODO what this part do
            // this.setState({
            //     globalUtm: utms[Object.keys(utms)[0]],
            // });
        }
    }

    private handleSubmit() {

        this.props.form.validateFields((err, values) => {
            if (err) return;
            const controllerApi = new ControllersApi();
            controllerApi.adNativePost({
                payloadData: {
                    assets: {
                        cta: values.cta,
                        description: values.description,
                        downloads: values.download ? parseInt(values.download) : null,
                        video: values.video,
                        icon: values.icon,
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

        let banners = [];
        this.state.files.map((file) => {
            banners.push({
                utm: file.utm,
                src: file.state.url,
                id: file.id.toString().indexOf("tmp_") === 0 ? null : file.id,
            });
        });

        // controllerApi.adBannerTypeIdPost({
        //   bannerType: UPLOAD_MODULES.VIDEO,
        //   id: this.state.currentCampaign.id.toString(),
        //   payloadData: {
        //     banners
        //   }
        // }).then(() => {
        //   this.props.history.push(`/campaign/check-publish/${this.props.match.params.id}`);
        // });
        //


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
                        <Col span={24} className={"column-border-bottom upload-container"}>
                            <Row type={"flex"} gutter={16}>
                                <Col span={5}>
                                    <FormItem>
                                        {getFieldDecorator("icon", {})(
                                            <UploadFile label={"Icon of application"}
                                                        fileType={[FILE_TYPE.IMG_PNG]}
                                                        minDimension={this.minSizeIcon}
                                                        ratio={this.minSizeIcon}
                                                        uploadModule={MODULE.IMAGE}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem>
                                        {getFieldDecorator("video", {})(
                                            <UploadFile label={"video"}
                                                        fileType={[FILE_TYPE.VID_MP4]}
                                                        minDimension={this.minVideoSize}
                                                        uploadModule={MODULE.VIDEO}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={5}>
                                    <FormItem>
                                        {getFieldDecorator("image", {})(
                                            <UploadFile label={"Ad image(vertical)"}
                                                        fileType={[FILE_TYPE.IMG_JPG, FILE_TYPE.IMG_PNG, FILE_TYPE.IMG_GIF]}
                                                        minDimension={this.minImageVerticalSize}
                                                        uploadModule={MODULE.IMAGE}
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
                                    {getFieldDecorator("image", {})(
                                        <UploadFile label={"Logo of site, app or corporation"}
                                                    fileType={[FILE_TYPE.IMG_PNG]}
                                                    minDimension={this.minLogoSize}
                                                    uploadModule={MODULE.IMAGE}
                                        />
                                    )}
                                </Col>
                                <Col span={8}>
                                    <UploadFile label={"Ad image(horizontal)"}
                                                fileType={[FILE_TYPE.IMG_JPG, FILE_TYPE.IMG_PNG, FILE_TYPE.IMG_GIF]}
                                                minDimension={this.minImageHorizentalSize}
                                                ratio={this.minImageHorizentalSize}
                                                uploadModule={MODULE.VIDEO}
                                    />
                                </Col>
                            </Row>
                            }
                            {!this.state.moreUploadOption &&
                            <div className="mb-2">
                                <a onClick={() => this.setState({moreUploadOption: !this.state.moreUploadOption})}><Translate
                                    value={"+show more option"}/></a>
                            </div>
                            }
                        </Col>
                        <Col span={24} className={"column-border-bottom upload-container"}>
                            <Row gutter={16}>
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
                            </Row>
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
