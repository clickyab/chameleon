/**
 * @file Upload Dynamic Banner
 */
import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {IStateUpload} from "./UploadBanner";
import {Upload, Row, Col, notification, Card, Progress, Button, Form, Spin, Modal} from "antd";
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
import Cropper from "../../../../components/Cropper/Index";
import UTMDynamicForm, {InputInfo} from "./UtmDynamicForm";
import {default as UploadService} from "../../../../services/Upload";
import Icon from "../../../../components/Icon";

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
const enum IMG_TYPE {LOGO , IMAGE , ICON}
/**
 * @interface IState
 * @desc define state object
 */
interface IState extends IStateUpload {
    disableDraggerImage: boolean;
    disableDraggerLogo: boolean;
    disableDraggerIcon: boolean;
    manageImageItem?: any;
    showCropModal: boolean;
    fileUrlOriginal: string;
    logoUrlOriginal: string;
    iconUrlOriginal: string;
    fileUrlCropped: string;
    logoUrlCropped: string;
    iconUrlCropped: string;
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
    private disableUpload: boolean = false;
    private tmpImg: Blob;
    private imageType: IMG_TYPE;
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
            disableDraggerImage: false,
            disableDraggerLogo: false,
            disableDraggerIcon: false,
            showCropModal: false,
            fileUrlOriginal: "",
            logoUrlOriginal: "",
            iconUrlOriginal: "",
            fileUrlCropped: "",
            logoUrlCropped: "",
            iconUrlCropped: "",
        };
        this.changeFileProgressState = this.changeFileProgressState.bind(this);
        this.cropImg = this.cropImg.bind(this);
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
     * @desc Check Image Content size of file before upload
     * @param file
     * @returns {<boolean>}
     */
    private checkImageSize(file: IFileItem , type: IMG_TYPE): boolean {
        if (type === IMG_TYPE.ICON) {
            if (file.height >= this.minSizeIcon.height && file.width >= this.minSizeIcon.width) {
                return true;
            }
        }
        if (type === IMG_TYPE.LOGO) {
            if (file.height >= this.minLogoSize.height && file.width >= this.minLogoSize.width) {
                return true;
            }
        }
        else {
         return false;
        }
    }

  /**
   * @func uploadFile
   * @desc assign Object Url of file to ad
   * @param file
   * @returns {boolean}
   */
  private uploadFile(file, type) {
      console.log("disable", this.disableUpload);
      if (!this.disableUpload) {
          const id = "tmp_" + Date.now();
          let fileItem = {
              id,
              fileObject: file,
              name: file.name,
          };
          if (type === IMG_TYPE.IMAGE) {
              this.setState({
                  disableDraggerImage: true
              });
              this.setImageSize(fileItem)
                  .then((fileItemObject) => {
                      if (this.checkImageSize(fileItemObject , type)) {
                          this.setState(prevState => {
                              prevState.showCropModal = true;
                              this.imageType = IMG_TYPE.IMAGE;
                              prevState.fileUrlOriginal = URL.createObjectURL(fileItemObject.fileObject);
                              prevState.disableDraggerImage = false;
                              this.disableUpload = false;
                              return prevState;
                          });
                      }
                      else {
                          notification.error({
                              message: this.i18n._t("File Size").toString(),
                              className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                              description: this.i18n._t("This file size isn't acceptable!").toString(),
                          });
                      }
                  });
          }
          if ( type === IMG_TYPE.LOGO) {
              this.setState({
                  disableDraggerLogo: true
              });
              this.setImageSize(fileItem)
                  .then((fileItemObject) => {
                      if (this.checkImageSize(fileItemObject , type)) {
                          this.setState(prevState => {
                              prevState.showCropModal = true;
                              this.imageType = IMG_TYPE.LOGO;
                              prevState.logoUrlOriginal = URL.createObjectURL(fileItemObject.fileObject);
                              prevState.disableDraggerLogo = false;
                              this.disableUpload = false;
                              return prevState;
                          });
                      }
                      else {
                          notification.error({
                              message: this.i18n._t("File Size").toString(),
                              className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                              description: this.i18n._t("This file size isn't acceptable!").toString(),
                          });
                      }
                  });
          }
          if ( type === IMG_TYPE.ICON) {
              this.setState({
                  disableDraggerIcon: true
              });
              this.setImageSize(fileItem)
                  .then((fileItemObject) => {
                      if (this.checkImageSize(fileItemObject , type)) {
                          this.setState(prevState => {
                              prevState.showCropModal = true;
                              this.imageType = IMG_TYPE.ICON;
                              prevState.iconUrlOriginal = URL.createObjectURL(fileItemObject.fileObject);
                              prevState.disableDraggerIcon = false;
                              this.disableUpload = false;
                              return prevState;
                          });
                      }
                      else {
                          notification.error({
                              message: this.i18n._t("File Size").toString(),
                              className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                              description: this.i18n._t("This file size isn't acceptable!").toString(),
                          });
                      }
                  });
          }
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
    /**
     * @func cropImg
     * @desc handle crop image
     */
    private cropImg() {
        if (!this.tmpImg) {
            notification.error({
                message: this.i18n._t("Crop Image").toString(),
                description: this.i18n._t("Please crop image!").toString(),
            });
            return;
        }
        this.setState((prevState => {
            if (this.imageType === IMG_TYPE.IMAGE) {
                prevState.fileUrlCropped = URL.createObjectURL(this.tmpImg);
            }
            if (this.imageType === IMG_TYPE.LOGO) {
                prevState.logoUrlCropped = URL.createObjectURL(this.tmpImg);
            }
            if (this.imageType === IMG_TYPE.ICON) {
                prevState.iconUrlCropped = URL.createObjectURL(this.tmpImg);
            }
            prevState.showCropModal = false;
            this.tmpImg = null;
            return prevState;
        }));
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
            this.props.history.push(`/campaign/check-publish/${this.props.match.params.id}`);
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

    private handleReset(e, item) {
        e.stopPropagation();
        this.setState({[item]: null});
        console.log("here");
    }
    private handleEdit(e, type: IMG_TYPE) {
        e.stopPropagation();
        this.imageType = type;
        this.setState({
            showCropModal: true,
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
                                <span className="image-drag-upload require"><Translate value={"wide image"}/></span>
                                <Dragger
                                    beforeUpload={(file) => this.uploadFile(file, IMG_TYPE.IMAGE)}
                                    className="banner-dragger-comp"
                                    disabled={this.state.disableDraggerImage}
                                >
                                    {!this.state.fileUrlCropped &&
                                    <div className="dragger-content">
                                        <span className="upload-image-link"><Translate value={"upload it"}/></span>
                                        <Translate value={"Drag your image over here or"}/>
                                    </div>
                                    }
                                    {this.state.fileUrlCropped &&
                                    <div className="upload-thumb-container">
                                        <div className="edit-upload" onClick={(e) => this.handleEdit(e, IMG_TYPE.IMAGE)}>
                                            <Icon name="cif-edit"  />
                                        </div>
                                        <div className="remove-upload" onClick={(e) => this.handleReset(e , "fileUrlCropped")}>
                                            <Icon name="cif-close"  />
                                        </div>
                                        <img src={this.state.fileUrlCropped}/>
                                    </div>
                                    }
                                </Dragger>
                                <div className="drag-description">
                                    <span className="span-block"><Translate value={"Allowed size: 480x320px"}/></span>
                                    <span className="span-block"><Translate value={"Image ratio: 1.9:1"}/></span>
                                    <span className="span-block"><Translate value={"allowed extensions: JPG/PNG/GIF"}/></span>
                                </div>
                            </Col>
                            <Col span={5}>
                                <span className="image-drag-upload"><Translate
                                    value={"Icon"}/></span>
                                <Dragger
                                    beforeUpload={(file) => this.uploadFile(file, IMG_TYPE.ICON)}
                                    className="banner-dragger-comp"
                                    disabled={this.state.disableDraggerLogo}
                                > {!this.state.iconUrlCropped &&
                                <div className="dragger-content">
                                    <span className="upload-image-link"><Translate value={"upload it"}/></span>
                                    <Translate value={"Drag your Icon over here or"}/>
                                </div>
                                }
                                    {this.state.iconUrlCropped &&
                                        <div className="upload-thumb-container">
                                            <div className="edit-upload" onClick={(e) => this.handleEdit(e, IMG_TYPE.LOGO)}>
                                                <Icon name="cif-edit"  />
                                            </div>
                                            <div className="remove-upload" onClick={(e) => this.handleReset(e , "iconUrlCropped")}>
                                                <Icon name="cif-close"  />
                                            </div>
                                            <img src={this.state.iconUrlCropped}/>
                                        </div>
                                    }
                                </Dragger>
                                <div className="drag-description">
                                    <span className="span-block"><Translate value={"Minimum size: 512x512px"}/></span>
                                    <span className="span-block"><Translate value={"Image ratio: 1:1"}/></span>
                                    <span className="span-block"><Translate value={"allowed extensions: PNG"}/></span>
                                </div>
                            </Col>
                            <Col span={5}>
                                    <span className="image-drag-upload"><Translate
                                        value={"Logo"}/></span>
                                <Dragger
                                    beforeUpload={(file) => this.uploadFile(file, IMG_TYPE.LOGO)}
                                    className="banner-dragger-comp"
                                    disabled={this.state.disableDraggerLogo}
                                > {!this.state.logoUrlCropped &&
                                <div className="dragger-content">
                                    <span className="upload-image-link"><Translate value={"upload it"}/></span>
                                    <Translate value={"Drag your Logo over here or"}/>
                                </div>
                                }
                                    {this.state.logoUrlCropped &&
                                    <div className="upload-thumb-container">
                                        <div className="edit-upload" onClick={(e) => this.handleEdit(e, IMG_TYPE.LOGO)}>
                                            <Icon name="cif-edit"  />
                                        </div>
                                        <div className="remove-upload" onClick={(e) => this.handleReset(e , "logoUrlCropped")}>
                                            <Icon name="cif-close"  />
                                        </div>
                                        <img src={this.state.logoUrlCropped}/>
                                    </div>
                                    }
                                </Dragger>
                                <div className="drag-description">
                                    <span className="span-block"><Translate value={"Minimum size: 627x627px"}/></span>
                                    <span className="span-block"><Translate value={"Image ratio: 1:1"}/></span>
                                    <span className="span-block"><Translate value={"allowed extensions: PNG"}/></span>
                                </div>
                            </Col>
                            <Col span={3}>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <Row className="upload-setting">
                            <UTMDynamicForm inputObject={this.FormObject} />
                        </Row>
                    </Col>
                    <Row type="flex" align="middle" className="full-width">
                        <Button className="btn-general btn-submit ml-1"
                                onClick={this.handleSubmit.bind(this)}
                        >
                            <Translate value={"Save and create new ad"}/>
                        </Button>
                        <Button className="btn-general btn-cancel"><Translate value={"Cancel"}/></Button>
                    </Row>
                </Row>
                {(this.state.fileUrlOriginal || this.state.logoUrlOriginal || this.state.iconUrlOriginal) && this.state.showCropModal &&
                <Modal
                    maskClosable={false}
                    closable={false}
                    title={this.i18n._t("Crop image").toString()}
                    visible={this.state.showCropModal}
                    onOk={this.cropImg}
                    footer={<Button type={"primary"} onClick={this.cropImg}>{this.i18n._t("Crop")}</Button>}>
                    <div>
                        <Cropper source={this.imageType === IMG_TYPE.IMAGE ? this.state.fileUrlOriginal : this.imageType === IMG_TYPE.LOGO ? this.state.logoUrlOriginal : this.state.iconUrlOriginal }
                                 aspect={this.imageType === IMG_TYPE.IMAGE ? (1.9 / 1) : 1}
                                 onChange={(img: Blob) => {
                                     this.tmpImg = img;
                                 }}/>
                    </div>
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


export default Form.create<IProps>()(withRouter(UploadDynamicBanner as any));
