/**
 * @file Upload Dynamic Banner
 */
import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
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
import InputLimit from "../../components/InputLimit/InputLimit";
import UtmForm from "./UtmForm";
import UTMDynamicForm, {InputInfo} from "./UtmDynamicForm";
import Icon from "../../../../components/Icon";
import UploadFile, {UPLOAD_MODULES, FILE_TYPE} from "../../components/UploadFile";
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

/**
 * @interface IState
 * @desc define state object
 */
interface IState extends IStateUpload {
    manageImageItem?: any;
    showCropModal: boolean;
}

@connect(mapStateToProps, mapDispatchToProps)
class UploadDynamicBanner extends React.Component <IProps, IState> {
    private i18n = I18n.getInstance();
    private minSizeIcon = {
        width: 512,
        height: 512,
    };
    private minLogoSize = {
        width: 627,
        height: 627,
    };
    private exactWideImageSize = {
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
            required: true,
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
            name: "finalPrice",
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

        let banners = [];
        this.state.files.map((file) => {
            banners.push({
                utm: file.utm,
                src: file.state.url,
                id: file.id.toString().indexOf("tmp_") === 0 ? null : file.id,
            });
        });

        // const controllerApi = new ControllersApi();
        // controllerApi.adBannerTypeIdPost({
        //     bannerType: UPLOAD_MODULES.VIDEO,
        //     id: this.state.currentCampaign.id.toString(),
        //     payloadData: {
        //         banners
        //     }
        // }).then(() => {
        //     this.props.history.push(`/campaign/check-publish/${this.props.match.params.id}`);
        // });

    }

    /**
     * @func onUtmFormSubmit
     * @desc Handle params that receive from utm modal
     * @param params
     */
    private onUtmFormSubmit(params) {

        let files = this.state.files;
        if (this.state.editFile) {
            const indexOfFile = files.findIndex((f) => (f.id === this.state.editFile.id));
            files[indexOfFile].name = params.name;
            files[indexOfFile].utm = params.link;
            this.setState({
                files,
            });
        } else {
            this.setState({
                globalUtm: params.link,
            });
        }
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
                    <Col span={24} className={"column-border-bottom uploaders-container"}>
                        <Row type={"flex"} gutter={16}>
                            <Col span={8}>
                                <UploadFile label={this.i18n._t("wide image") as string}
                                            fileType={[FILE_TYPE.IMG_JPG, FILE_TYPE.IMG_PNG, FILE_TYPE.IMG_GIF]}
                                            exactDimension={this.exactWideImageSize}
                                            uploadModule={UPLOAD_MODULES.BANNER_IMAGE}
                                            required={true}
                                />
                            </Col>
                            <Col span={5}>
                                <UploadFile label={this.i18n._t("Icon") as string}
                                            fileType={[FILE_TYPE.IMG_PNG]}
                                            minDimension={this.minSizeIcon}
                                            ratio={{width: 1, height: 1}}
                                            uploadModule={UPLOAD_MODULES.BANNER_IMAGE}
                                />
                            </Col>
                            <Col span={5}>
                                <UploadFile label={this.i18n._t("Logo") as string}
                                            fileType={[FILE_TYPE.IMG_PNG]}
                                            minDimension={this.minLogoSize}
                                            ratio={{width: 1, height: 1}}
                                            uploadModule={UPLOAD_MODULES.BANNER_IMAGE}
                                />
                            </Col>
                            <Col span={3}>
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


export default Form.create<IProps>()(withRouter(UploadDynamicBanner as any));
