/**
 * @file Upload banner step
 */
import * as React from "react";
import Image from "react-image-file";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import BannerSize from "./size/CONSTsize";
import AppSize from "./size/CONST_APPsize";
import VideoSize from "./size/CONST_VIDEOsize";
import {Upload, Row, Col, notification, Card, Progress, Button, Form, Spin} from "antd";
import Translate from "../../../../components/i18n/Translate/index";
import CONFIG from "../../../../constants/config";
import {default as UploadService, UPLOAD_MODULES, UploadState, UPLOAD_STATUS} from "../../../../services/Upload/index";
import I18n from "../../../../services/i18n/index";
import FileSizeConvertor from "../../../../services/Utils/FileSizeConvertor";
import { RaisedButton, Checkbox} from "material-ui";
import "./style.less";
import Modal from "../../../../components/Modal/index";
import Icon from "../../../../components/Icon/index";
import {ControllersApi, OrmCampaign} from "../../../../api/api";
import STEPS from "../../steps";
import {RootState} from "../../../../redux/reducers/index";
import {setCurrentStep, setCurrentCampaign, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {DEVICE_TYPES} from "../Type";
import InputLimit from "../../components/InputLimit/InputLimit";
import UtmForm from "./UtmForm";
import {UTMInfo} from "./UtmForm";

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
interface IState {
    currentCampaign: OrmCampaign;
    files: IFileItem[];
    openImageModal: boolean;
    previewImage?: IFileItem;
    editFile?: IFileItem;
    globalUtm ?: string;
    adSize?: any;
    urlType?: URL_TYPE;
    otherUrlType?: OTHER_URL_TYPE;
    fileSelected?: number | null;
}
enum OTHER_URL_TYPE {
   TAPSTREAM = "tapstream",
}

enum URL_TYPE {
    BAZAAR = "bazaar",
    PLAY_STORE = "playStore",
    MARKET = "market",
    PHONE = "phone",
    URL = "url",
    INSTAGRAM = "instagram",
    OTHER = "other",
}

@connect(mapStateToProps, mapDispatchToProps)
class UploadBanner extends React.Component <IProps, IState> {
    private i18n = I18n.getInstance();

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
            urlType: URL_TYPE.BAZAAR,
            otherUrlType: OTHER_URL_TYPE.TAPSTREAM,
            fileSelected: null,
            adSize: (props.currentCampaign && props.currentCampaign.id === this.props.match.params.id) ?
                ((this.state.currentCampaign.kind === DEVICE_TYPES.APPLICATION) ? AppSize : BannerSize)
                : BannerSize,
        };
        let otherPlaceholder: string ;
        this.changeFileProgressState = this.changeFileProgressState.bind(this);
    }

    public  showEditHelper: boolean = true;
    public componentDidMount() {
        this.setState({
            currentCampaign: this.props.currentCampaign,
            adSize: (this.props.currentCampaign.kind === DEVICE_TYPES.APPLICATION) ? AppSize :
                ((this.props.currentCampaign.type === "video") ? VideoSize : BannerSize),
        }, function () {
            this.loadBanners();
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

    loadBanners() {
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
                this.updateBannerSizeObject();
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

    private updateBannerSizeObject() {
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
     * @desc Check Image size of file before upload
     * @param file
     * @returns {Promise<boolean>}
     */
    private setImageSize(file: IFileItem): Promise<IFileItem> {
        return new Promise((res, rej) => {
            const img = document.createElement("img");
            img.onload = function () {

                file.width = img.width;
                file.height = img.height;
                res(file);

                img.remove();
            };
            img.src = window.URL.createObjectURL(file.fileObject);
        });
    }

    /**
     * @func
     * @desc Check Image size of file before upload
     * @param file
     * @returns {Promise<boolean>}
     */
    private checkImageSize(file: IFileItem): boolean {
        const hasThisBannerSize = this.state.adSize.findIndex((b) => {
            return (b.height === file.height && b.width === file.width);
        });
        return (hasThisBannerSize >= 0);
    }

    /**
     * @func removeFile
     * @desc remove file from state.files array
     * @param {number} id
     */
    private removeFile(id: number | string): void {
        let files: IFileItem[] = this.state.files;
        const indexOfFile = files.findIndex((f) => (f.id === id));
        files.splice(indexOfFile, 1);
        this.setState({
            files,
        }, this.updateBannerSizeObject);
    }

    /**
     * @func uploadFile
     * @desc check file size and upload file by upload service
     * @param file
     * @returns {boolean}
     */
    private uploadFile(file) {
        const id = "tmp_" + Date.now();
        let fileItem = {
            id,
            fileObject: file,
            name: file.name,
        };
        const uploader = new UploadService(UPLOAD_MODULES.BANNER, file);
        this.setImageSize(fileItem)
            .then((fileItemObject) => {
                if (this.checkImageSize(fileItemObject)) {

                    this.setState({
                        files: [...this.state.files, fileItemObject]
                    }, () => {
                        this.updateBannerSizeObject();
                        uploader.upload((state) => {
                            this.changeFileProgressState(id, state);
                        }).then((state) => {
                            this.changeFileProgressState(id, state);
                        }).catch((err) => {
                            // fixme:: handle error
                            notification.error({
                                message: this.i18n._t("Error").toString(),
                                className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                                description: this.i18n._t("Error in upload progress!").toString(),
                            });
                        });
                    });
                } else {
                    notification.error({
                        message: this.i18n._t("File Size").toString(),
                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                        description: this.i18n._t("This file size isn't acceptable!").toString(),
                    });
                }
            });
        return false;
    }

    private imageEdit(file?: IFileItem, index?) {
        if (this.state.fileSelected !== index) {
            this.setState({
                fileSelected: index,
            });
        }
        else {
            this.setState({
                fileSelected: null,
            });
        }
        this.setState({
            editFile: file,
        });
        this.showEditHelper = true;
    }
    private openImageModal(file?: IFileItem) {
        this.setState({
            openImageModal: true,
            previewImage: file,
        });
    }

    private handleBack() {
        this.props.setCurrentStep(STEPS.SELECT_PUBLISHER);
        this.props.history.push(`/campaign/select-publisher/${this.props.match.params.id}`);
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
            bannerType: UPLOAD_MODULES.BANNER,
            id: this.state.currentCampaign.id.toString(),
            payloadData: {
                banners
            }
        }).then(() => {
            this.loadBanners();
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
     * @func handleFormData
     * @desc will change file values (state will set after submission)
     * @param file , index, item
     */
    private handleFormData(file, index, item) {
        let fileItem: IFileItem[] = this.state.files;
        fileItem[index].cta = item.CTA;
        fileItem[index].utm = item.URL;
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
     * @func handleBannerData
     * @desc fill values of banner with general form if it has not been edited
     * @param item{UTMInfo}
     */
private handleBannerData(item: UTMInfo) {
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

        if (this.props.match.params.id && !this.state.currentCampaign) {
            return <Spin/>;
        }

        return (
            <div dir={CONFIG.DIR} className="upload-content">
                <div className="title">
                    <h2><Translate value="General ad information"/></h2>
                    <p><Translate value="Upload media"/></p>
                </div>
                <Row type="flex" gutter={16} justify="center">
                    <Col span={24} className="full-width">
                            <Form>
                                <Row type={"flex"} gutter={66}>
                                    <Col span={12} className="upload-column-border">
                                        <span className="image-drag-upload"><Translate value={"Image*"}/></span>
                                        <Dragger
                                            beforeUpload={this.uploadFile.bind(this)}
                                            className="banner-dragger-comp"
                                        >
                                            <div className="dragger-content">
                                                <span className="upload-image-link"><Translate value={"upload it"}/></span>
                                                <Translate value={"Drag your image over here or"}/>
                                            </div>
                                        </Dragger>
                                        <div className="drag-description">
                                        <Translate value={"Image size:"}/>
                                        <span className="link"><Translate value={"image size guide"}/></span>
                                        <span className="span-block"><Translate value={"maximum size: 200KB"}/></span>
                                        <span className="span-block"><Translate value={"allowed extentions: GIF/PNG/JPG"}/></span>
                                        </div>
                                        <Row className="upload-setting">
                                            <span className="upload-title-setting span-block"><Translate value={"URL and uploaded banners setting"}/></span>
                                            <FormItem>
                                                <UtmForm global={true} onSubmit={(params) => {this.onUtmFormSubmit(params); }}
                                                         onChange={(item) => {this.handleBannerData(item);  }}
                                                         link={this.state.globalUtm}/>
                                            </FormItem>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row type="flex" gutter={20}>
                                            {this.state.files.map((file, index) => (
                                                <Col key={file.id} span={6}>
                                                    <div className="upload-process-wrapper">
                                                        <div className="image-wrapper">
                                                            <div className="image-overlay"
                                                                 onClick={() => this.openImageModal(file)}>
                                                                <Icon name={"cif-eye"} fontsize={20}/>
                                                            </div>
                                                            {file.fileObject && (!file.state || !file.state.url) &&
                                                            <Image file={file.fileObject} alt={file.fileObject.name}
                                                                   type={"img"}
                                                            />
                                                            }
                                                            {file.state && file.state.url &&
                                                            <img
                                                                src={`http://staging.crab.clickyab.ae/uploads/` + file.state.url}
                                                                alt={file.name}/>
                                                            }
                                                        </div>
                                                        <div className="upload-option">
                                                            {file.state && file.state.progress !== 100 &&
                                                            <Progress type="line"
                                                                      percent={file.state ? file.state.progress : 1}
                                                                      width={100}/>
                                                            }
                                                            {file.state && file.state.progress === 100 &&
                                                            <Button onClick={() => {
                                                                this.imageEdit(file, index);
                                                            }}
                                                                    className="btn-edit flex-start"
                                                            >
                                                                <Icon name={"cif-edit"}/>
                                                            </Button>
                                                            }
                                                            <Button onClick={() => {
                                                                this.removeFile(file.id);
                                                                this.setState({
                                                                    fileSelected: null,
                                                                });
                                                            }}
                                                                    className="btn-cancel"
                                                            >
                                                                <Icon name={"cif-closelong"}/>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    {this.state.fileSelected === index &&
                                                    <div className={`edit-overlay transformX-${(index % 4)}`}>
                                                        <FormItem><UtmForm onSubmit={(params) => this.onUtmFormSubmit(params)}
                                                                           onChange={(item) => this.handleFormData(file, index,  item)}
                                                                           customOnKeyPress={(item) => this.handleFlag(item, file, index)}
                                                                           link={file.utm}
                                                                           cta={file.cta}
                                                                           shouldUpdate={file.edited}
                                                        />
                                                        </FormItem></div>
                                                    }
                                                </Col>
                                            ))}
                                        </Row>
                                    </Col>
                                </Row>
                                <Row type="flex" align="middle">
                                    <Button className="btn-general btn-submit ml-1"
                                            onClick={this.handleSubmit.bind(this)}
                                    >
                                        <Translate value={"Save and creat new ad"}/>
                                    </Button>
                                    <Button className="btn-general btn-cancel"><Translate value={"Cancel"}/></Button>
                                </Row>
                            </Form>
                    </Col>
                </Row>
                {this.state.previewImage &&
                <Modal title={this.i18n._t("Banner Preview").toString()}
                       footer={[]}
                       visible={this.state.openImageModal}
                       customClass="preview-banner-modal"
                       onCancel={() => {
                           this.setState({openImageModal: false});
                       }}
                >
          <span>
          {this.state.previewImage.fileObject && (!this.state.previewImage.state || !this.state.previewImage.state.url) &&
          <Image file={this.state.previewImage.fileObject}
                 type={"img"}
          />
          }
              {this.state.previewImage.state && this.state.previewImage.state.url &&
              <img src={`http://staging.crab.clickyab.ae/uploads/` + this.state.previewImage.state.url}/>
              }
          </span>
                </Modal>
                }
            </div>
        );
    }
}

interface IOwnProps {
    match ?: any;
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


export default Form.create<IProps>()(withRouter(UploadBanner as any));
