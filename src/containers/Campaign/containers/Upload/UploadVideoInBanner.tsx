/**
 * @file Upload Video step
 */
import * as React from "react";
import Image from "react-image-file";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import VideoSize from "./size/CONST_VIDEOsize";
import {IStateUpload} from "./UploadBanner";
import {Upload, Row, Col, notification, Card, Progress, Button, Form, Spin} from "antd";
import Translate from "../../../../components/i18n/Translate/index";
import CONFIG from "../../../../constants/config";
import {UPLOAD_MODULES, UploadState, UPLOAD_STATUS, FlowUpload} from "../../../../services/Upload/index";
import I18n from "../../../../services/i18n/index";
import "./style.less";
import {ControllersApi, OrmCampaign} from "../../../../api/api";
import STEPS from "../../steps";
import {RootState} from "../../../../redux/reducers/index";
import {setCurrentStep, setCurrentCampaign, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import InputLimit from "../../components/InputLimit/InputLimit";
import UtmForm from "./UtmForm";
import UTMDynamicForm, {InputInfo} from "./UtmDynamicForm";
import {UTMInfo} from "./UtmForm";
import {Checkbox} from "material-ui";

const Dragger = Upload.Dragger;
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
    disableDragger: boolean;
}

@connect(mapStateToProps, mapDispatchToProps)
class UploadVideoInBanner extends React.Component <IProps, IState> {
    private i18n = I18n.getInstance();
    private disableUpload: boolean = false;
    private FormObject: InputInfo[] = [{
        title: this.i18n._t("Title") as string,
        name: "title",
        type: "limiter",
        limit: 50,
        placeholder: this.i18n._t("Ad title") as string,
        required: true,
    },
         {
            title: this.i18n._t("Call to Action text") as string,
            name: "cta",
            type: "limiter",
            limit: 15,
            placeholder: this.i18n._t("example: online shopping") as string,
            required: true,
        },
        {
            title: this.i18n._t("URL") as string,
            name: "url",
            type: "url" ,
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
            files: [],
            openImageModal: false,
            fileSelected: null,
            disableDragger: false,
            adSize: VideoSize,
        };
        let otherPlaceholder: string;
        this.changeFileProgressState = this.changeFileProgressState.bind(this);
    }

    public showEditHelper: boolean = true;

    public componentDidMount() {
        this.setState({
            currentCampaign: this.props.currentCampaign,
            adSize: VideoSize,
        }, function () {
            this.loadVideo();
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

    loadVideo() {
        const controllerApi = new ControllersApi();
        controllerApi.campaignGetIdAdGet({
            id: this.state.currentCampaign.id.toString(),
        }).then((list) => {
            let files: IFileItem[] = [];
            list.map((item) => {
                let file: IFileItem = {
                    id: item.id,
                    utm: item.target,
                    height: item.height,
                    width: item.width,
                    name: `${this.state.currentCampaign.title} ${item.width}x${item.width}`,
                    state: {
                        status: UPLOAD_STATUS.FINISHED,
                        progress: 100,
                        url: item.src,
                    },
                    // TODO
                    cta: "",
                };
                files.push(file);
            });
            this.setState({
                files
            }, () => {
                this.updateVideoSizeObject();
                this.checkAndSetUtm();
            });
        });
    }

    /**
     * @func
     * @desc handle change of file uploading progress
     * @param {number} id
     * @param {UploadState} state
     */
    private changeFileProgressState(id: number | string, state: UploadState): void {
        let files: IFileItem[] = this.state.files;
        const indexOfFile = files.findIndex((f) => (f.id === id));

        files[indexOfFile].state = state;
        this.setState({
            files,
        });
    }

    private updateVideoSizeObject() {
        let newObject = [];
        this.state.adSize.map((size) => {
            const validSizes = this.state.files.filter(file => {
                return file.width === size.width && file.height === size.height;
            });
            newObject.push({
                ...size,
                active: validSizes.length > 0,
            });
        });
        this.setState({
            adSize: newObject
        });
        this.forceUpdate();
    }

    /**
     * @func
     * @desc Check Video size of file before upload
     * @param file
     * @returns {Promise<boolean>}
     */
    private setVideoSize(file: IFileItem): Promise<IFileItem> {
        return new Promise((res, rej) => {
            const vid = document.createElement("video");
            vid.onloadedmetadata = function () {
                file.width = vid.videoWidth;
                file.height = vid.videoHeight;
                res(file);

                vid.remove();
            };
            vid.src = window.URL.createObjectURL(file.fileObject);
        });
    }

    /**
     * @func
     * @desc Check Video size of file before upload
     * @param file
     * @returns {Promise<boolean>}
     */
    private checkVideoSize(file: IFileItem): boolean {
        const hasThisVideoSize = this.state.adSize.findIndex((b) => {
            return (b.height === file.height && b.width === file.width);
        });
        return (hasThisVideoSize >= 0);
    }

    /**
     * @func uploadFile
     * @desc check file size and upload file by upload service
     * @param file
     * @returns {boolean}
     */
    private uploadFile(file) {
        if (!this.disableUpload) {
            this.setState({
                disableDragger: true
            });
            this.disableUpload = true;
            const id = "tmp_" + Date.now();
            let fileItem = {
                id,
                fileObject: file,
                name: file.name,
            };
            const uploader = new FlowUpload(UPLOAD_MODULES.VIDEO, file);
            this.setVideoSize(fileItem)
                .then((fileItemObject) => {
                    if (this.checkVideoSize(fileItemObject)) {

                        this.setState({
                            files: [...this.state.files, fileItemObject]
                        }, () => {
                            this.updateVideoSizeObject();
                            uploader.upload((state) => {
                                this.changeFileProgressState(id, state);
                            }).then((state) => {
                                this.changeFileProgressState(id, state);
                                this.setState({
                                    disableDragger: false
                                });
                                this.disableUpload = false;
                            }).catch((err) => {
                                this.setState({
                                    disableDragger: false
                                });
                                this.disableUpload = false;

                                console.log(err);
                                // fixme:: handle error
                                notification.error({
                                    message: this.i18n._t("Error").toString(),
                                    className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                                    description: this.i18n._t("Error in upload progress!").toString(),
                                });
                            });
                        });
                    } else {
                        this.setState({
                            disableDragger: false
                        });
                        notification.error({
                            message: this.i18n._t("File Size").toString(),
                            className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                            description: this.i18n._t("This file size isn't acceptable!").toString(),
                        });
                    }
                });
        }
        else {
            notification.error({
                message: this.i18n._t("One File").toString(),
                className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                description: this.i18n._t("Only One File can be Uploaded").toString(),
            });
        }
        return false;
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

        const controllerApi = new ControllersApi();
        controllerApi.adBannerTypeIdPost({
            bannerType: UPLOAD_MODULES.VIDEO,
            id: this.state.currentCampaign.id.toString(),
            payloadData: {
                banners
            }
        }).then(() => {
            this.loadVideo();
            this.props.history.push(`/campaign/check-publish/${this.props.match.params.id}`);
        });

    }

    /**
     * @func handleFlag
     * @desc On keyPress it will be called and set edited flag for banner (banner will not get general values from general form)
     * set state will be used for reRendering
     * @param item , file , index
     */
    private handleFlag(item, file, index) {
        let fileItem: IFileItem[] = this.state.files;
        fileItem[index].edited = item;
        this.setState({
            files: fileItem
        });
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
     * @func handleVideoData
     * @desc fill values of banner with general form if it has not been edited
     * @param item{UTMInfo}
     */
    private handleVideoData(item: UTMInfo) {
        this.state.files.map((file: IFileItem, index) => {
            let fileItem: IFileItem[] = this.state.files;
            if (!file.edited) {
                fileItem[index].cta = item.CTA;
            }
            if (!file.edited) {
                fileItem[index].utm = item.URL;
            }
            this.setState({
                files: fileItem
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
                    <h2><Translate value="General ad information"/></h2>
                </div>
                <Row type="flex" gutter={16}>
                    <Col span={24} className={"column-border-bottom"}>
                        <Row gutter={16}>
                            <Col span={8} offset={16}>
                                <FormItem>
                                    <span className="span-block input-title"><Translate
                                        value="Choose name for Ad*"/></span>
                                    {getFieldDecorator("adName", {
                                        rules: [{required: true, message: this.i18n._t("Please input your adName!")}],
                                    })(
                                        <InputLimit
                                            placeholder={this.i18n._t("Name for Creative") as string}
                                            className="input-campaign full-width"
                                            limit={10}
                                        />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={16} offset={8}>
                        <span className="span-block upload-media mb-1"><Translate value={"Upload media"}/></span>
                    </Col>
                    <Col span={24} className={"column-border-bottom"}>
                        <Row type={"flex"} gutter={16}>
                            <Col span={8}>
                                <span className="image-drag-upload require"><Translate value={"video"}/></span>
                                <Dragger
                                    beforeUpload={this.uploadFile.bind(this)}
                                    className="banner-dragger-comp"
                                    disabled={this.state.disableDragger}
                                >
                                    <div className="dragger-content">
                                        <span className="upload-image-link"><Translate value={"upload it"}/></span>
                                        <Translate value={"Drag your video over here or"}/>
                                    </div>
                                </Dragger>
                                <div className="drag-description">
                                    <Translate value={"Minimum size of video 640x360px"}/>
                                    <span className="span-block"><Translate value={"allowed extentions: MP4"}/></span>
                                </div>
                            </Col>
                            <Col span={8}>
                                <span className="image-drag-upload require"><Translate
                                    value={"video poster(wide with 16:9 aspect ratio)"}/></span>
                                <Dragger
                                    beforeUpload={this.uploadFile.bind(this)}
                                    className="banner-dragger-comp"
                                    disabled={this.state.disableDragger}
                                >
                                    <div className="dragger-content">
                                        <span className="upload-image-link"><Translate value={"upload it"}/></span>
                                        <Translate value={"Drag your image over here or"}/>
                                    </div>
                                </Dragger>
                                <div className="drag-description">
                                    <Translate value={"Minimum size of image 640x360px"}/>
                                    <span className="span-block"><Translate value={"image aspect ratio: 1.9:1"}/></span>
                                    <span className="span-block"><Translate value={"allowed extentions: MP4"}/></span>
                                </div>
                            </Col>
                            <Col span={8}>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <Row className="upload-setting">
                            <UTMDynamicForm form={this.props.form} inputObject={this.FormObject} />
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
    match ?: any;
    history?: any;
}
// TODO API should Implement
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


export default Form.create<IProps>()(withRouter(UploadVideoInBanner as any));
