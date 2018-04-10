/**
 * @file Upload Universal App
 */
import * as React from "react";
import {connect} from "react-redux";
import {withRouter, RouteComponentProps} from "react-router";
import {IStateUpload} from "./UploadBanner";
import {Upload, Row, Col, notification, Button, Form, Spin, Modal} from "antd";
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

const enum IMG_TYPE {LOGO, IMAGE_VER, IMAGE_HOR, ICON, VIDEO}

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
  disableDraggerImageVer: boolean;
  disableDraggerImageHor: boolean;
  disableDraggerVideo: boolean;
  disableDraggerLogo: boolean;
  disableDraggerIcon: boolean;
  manageImageItem?: any;
  showCropModal: boolean;
  moreUploadOption: boolean;
  imgVerUrlOriginal: string;
  imgHorUrlOriginal: string;
  logoUrlOriginal: string;
  iconUrlOriginal: string;
  imgVerUrlCropped: string;
  imgHorUrlCropped: string;
  logoUrlCropped: string;
  iconUrlCropped: string;
  videoFile: any;
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
      disableDraggerImageVer: false,
      disableDraggerImageHor: false,
      disableDraggerVideo: false,
      disableDraggerLogo: false,
      disableDraggerIcon: false,
      showCropModal: false,
      imgVerUrlOriginal: "",
      logoUrlOriginal: "",
      imgHorUrlOriginal: "",
      iconUrlOriginal: "",
      imgVerUrlCropped: "",
      imgHorUrlCropped: "",
      logoUrlCropped: "",
      iconUrlCropped: "",
      videoFile: null,
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
    // let files: IFileItem[] = this.state.files;
    // const indexOfFile = files.findIndex((f) => (f.id === id));
    //
    // files[indexOfFile].state = state;
    // this.setState({
    //   files,
    // });
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
   * @desc Check Media Content size of file before upload
   * @param file
   * @returns {<boolean>}
   */
  private checkMediaSize(file: IFileItem, type: IMG_TYPE): boolean {
    if (type === IMG_TYPE.IMAGE_HOR) {
      if (file.height >= this.minImageHorizentalSize.height && file.width >= this.minImageHorizentalSize.width) {
        return true;
      }
    }
    if (type === IMG_TYPE.IMAGE_VER) {
      if (file.height === this.minImageVerticalSize.height && file.width === this.minImageVerticalSize.width) {
        return true;
      }
    }
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
    if (type === IMG_TYPE.VIDEO) {
      if (file.height === this.minVideoSize.height && file.width === this.minVideoSize.width) {
        return true;
      }
    }
    else {
      return false;
    }
  }

  /**
   * @func
   * @desc Check Media Content format of file before upload
   * @param file
   * @returns {<boolean>}
   */
  private checkMediaFormat(file: IFileItem, type: IMG_TYPE): boolean {
    if (type === IMG_TYPE.IMAGE_HOR) {
      if (file.fileObject.type === FILE_TYPE.IMG_JPG || file.fileObject.type === FILE_TYPE.IMG_GIF || file.fileObject.type === FILE_TYPE.IMG_PNG) {
        return true;
      }
    }
    if (type === IMG_TYPE.IMAGE_VER) {
      if (file.fileObject.type === FILE_TYPE.IMG_JPG || file.fileObject.type === FILE_TYPE.IMG_GIF || file.fileObject.type === FILE_TYPE.IMG_PNG) {
        return true;
      }
    }
    if (type === IMG_TYPE.ICON) {
      if (file.fileObject.type === FILE_TYPE.IMG_PNG) {
        return true;
      }
    }
    if (type === IMG_TYPE.LOGO) {
      if (file.fileObject.type === FILE_TYPE.IMG_PNG) {
        return true;
      }
    }
    if (type === IMG_TYPE.VIDEO) {
      if (file.fileObject.type === FILE_TYPE.VID_MP4) {
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
      if (type !== IMG_TYPE.VIDEO) {
        if (type === IMG_TYPE.IMAGE_HOR) {
          this.setState({
            disableDraggerImageHor: true
          });
        } else if (type === IMG_TYPE.IMAGE_VER) {
          this.setState({
            disableDraggerImageVer: true
          });
        } else if (type === IMG_TYPE.ICON) {
          this.setState({
            disableDraggerIcon: true
          });
        }
        else if (type === IMG_TYPE.LOGO) {
          this.setState({
            disableDraggerLogo: true
          });
        }
        this.setImageSize(fileItem as IFileItem)
          .then((fileItemObject) => {
            let sizeCheck = this.checkMediaSize(fileItemObject, type);
            let formatCheck = this.checkMediaFormat(fileItemObject, type);
            if (sizeCheck && formatCheck) {
              this.setState(prevState => {
                this.imageType = type;
                if (type === IMG_TYPE.IMAGE_HOR) {
                  prevState.imgHorUrlOriginal = URL.createObjectURL(fileItemObject.fileObject);
                  prevState.disableDraggerImageHor = false;
                } else if (type === IMG_TYPE.IMAGE_VER) {
                  prevState.imgVerUrlOriginal = URL.createObjectURL(fileItemObject.fileObject);
                  prevState.disableDraggerImageVer = false;
                } else if (type === IMG_TYPE.ICON) {
                  prevState.iconUrlOriginal = URL.createObjectURL(fileItemObject.fileObject);
                  prevState.disableDraggerIcon = false;
                }
                else if (type === IMG_TYPE.LOGO) {
                  prevState.logoUrlOriginal = URL.createObjectURL(fileItemObject.fileObject);
                  prevState.disableDraggerLogo = false;
                }
                this.disableUpload = false;
                return prevState;
              });
            } else {
              if (type === IMG_TYPE.IMAGE_HOR) {
                this.setState({disableDraggerImageHor: false});
              } else if (type === IMG_TYPE.IMAGE_VER) {
                this.setState({disableDraggerImageVer: false});
              } else if (type === IMG_TYPE.ICON) {
                this.setState({disableDraggerIcon: false});
              }
              else if (type === IMG_TYPE.LOGO) {
                this.setState({disableDraggerLogo: false});
              }
              if (!sizeCheck) {
                notification.error({
                  message: this.i18n._t("File Size").toString(),
                  className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                  description: this.i18n._t("This file size isn't acceptable!").toString(),
                });
              }
              if (!formatCheck) {
                notification.error({
                  message: this.i18n._t("File Format").toString(),
                  className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                  description: this.i18n._t("This file format isn't acceptable!").toString(),
                });
              }
            }
          });
      }
      else {
        const uploader = new FlowUpload(UPLOAD_MODULES.VIDEO, file);
        this.setVideoSize(fileItem as IFileItem)
          .then((fileItemObject) => {
            let sizeCheck = this.checkMediaSize(fileItemObject, type);
            let formatCheck = this.checkMediaFormat(fileItemObject, type);
            if (sizeCheck && formatCheck) {
              this.setState({
                videoFile: fileItemObject
              }, () => {
                uploader.upload((state) => {
                  this.changeFileProgressState(id, state);
                }).then((state) => {
                  this.changeFileProgressState(id, state);
                  this.setState({
                    disableDraggerVideo: false
                  });
                  this.disableUpload = false;
                }).catch((err) => {
                  this.setState({
                    disableDraggerVideo: false
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
                disableDraggerVideo: false,
              });
              if (sizeCheck) {
                notification.error({
                  message: this.i18n._t("File Size").toString(),
                  className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                  description: this.i18n._t("This file size isn't acceptable!").toString(),
                });
              } else {
                notification.error({
                  message: this.i18n._t("File Format").toString(),
                  className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                  description: this.i18n._t("This file format isn't acceptable!").toString(),
                });
              }
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
      if (this.imageType === IMG_TYPE.IMAGE_VER) {
        prevState.imgVerUrlCropped = URL.createObjectURL(this.tmpImg);
      }
      if (this.imageType === IMG_TYPE.IMAGE_HOR) {
        prevState.imgHorUrlCropped = URL.createObjectURL(this.tmpImg);
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

    this.props.form.validateFields((err, values) => {
      if (err) return;
      const controllerApi = new ControllersApi();
      controllerApi.adNativePost({
        payloadData: {
          assets: {
            "cta": values.cta,
            "description": values.description,
            "downloads": values.download ? parseInt(values.download) : null,
            // "icon": string,
            // "image": string,
            // "logo": string,
            "phone": values.phone || null,
            "price": values.price ? parseInt(values.price) : null,
            "rating": values.rating ? parseFloat(values.rating) : null,
            "saleprice": values.salePrice ? parseInt(values.salePrice) : null,
            "title": values.title,
            // "video": string,
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
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row type="flex" gutter={16}>
            <Col span={24} className={"column-border-bottom"}>
              <Row gutter={16}>
                <Col span={8} offset={16}>
                  <FormItem>
                  <span className="span-block input-title">
                    <Translate value="Choose name for Ad*"/>
                  </span>
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
                <Col span={5}>
                                <span className="image-drag-upload"><Translate
                                  value={"Icon of application"}/></span>
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
                      <div className="edit-upload" onClick={(e) => this.handleEdit(e, IMG_TYPE.ICON)}>
                        <Icon name="cif-edit"/>
                      </div>
                      <div className="remove-upload" onClick={(e) => this.handleReset(e, "iconUrlCropped")}>
                        <Icon name="cif-close"/>
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
                <Col span={8}>
                  <span className="image-drag-upload"><Translate value={"video"}/></span>
                  <Dragger
                    beforeUpload={(file) => this.uploadFile(file, IMG_TYPE.VIDEO)}
                    className="banner-dragger-comp"
                    disabled={this.state.disableDraggerImageVer}
                  >
                    <div className="dragger-content">
                      <span className="upload-image-link"><Translate value={"upload it"}/></span>
                      <Translate value={"Drag your video over here or"}/>
                    </div>
                  </Dragger>
                  <div className="drag-description">
                    <span className="span-block"><Translate value={"Allowed dimension: 320x480px"}/></span>
                    <span className="span-block"><Translate value={"Allowed size: 20MB"}/></span>
                    <span className="span-block"><Translate value={"allowed extensions: MP4"}/></span>
                  </div>
                </Col>
                <Col span={5}>
                                    <span className="image-drag-upload"><Translate
                                      value={"Ad image(vertical)"}/></span>
                  <Dragger
                    beforeUpload={(file) => this.uploadFile(file, IMG_TYPE.IMAGE_VER)}
                    className="banner-dragger-comp"
                    disabled={this.state.disableDraggerLogo}
                  > {!this.state.imgVerUrlCropped &&
                  <div className="dragger-content">
                    <span className="upload-image-link"><Translate value={"upload it"}/></span>
                    <Translate value={"Drag your image over here or"}/>
                  </div>
                  }
                    {this.state.imgVerUrlCropped &&
                    <div className="upload-thumb-container">
                      <div className="edit-upload" onClick={(e) => this.handleEdit(e, IMG_TYPE.IMAGE_VER)}>
                        <Icon name="cif-edit"/>
                      </div>
                      <div className="remove-upload" onClick={(e) => this.handleReset(e, "imgVerUrlCropped")}>
                        <Icon name="cif-close"/>
                      </div>
                      <img src={this.state.imgVerUrlCropped}/>
                    </div>
                    }
                  </Dragger>
                  <div className="drag-description">
                    <span className="span-block"><Translate value={"Minimum size: 320x480px"}/></span>
                    <span className="span-block"><Translate value={"Allowed Size: 200KB"}/></span>
                    <span className="span-block"><Translate value={"allowed extensions: JPG/PNG/GIF"}/></span>
                  </div>
                </Col>
                <Col span={3}>
                </Col>
              </Row>
              {this.state.moreUploadOption &&
              <Row type={"flex"} gutter={16}>
                <Col span={5}>
                                    <span className="image-drag-upload"><Translate
                                      value={"Logo of site, app or corpration"}/></span>
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
                        <Icon name="cif-edit"/>
                      </div>
                      <div className="remove-upload"
                           onClick={(e) => this.handleReset(e, "logoUrlCropped")}>
                        <Icon name="cif-close"/>
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
                <Col span={8}>
                  <span className="image-drag-upload"><Translate value={"Ad image(horizental)"}/></span>
                  <Dragger
                    beforeUpload={(file) => this.uploadFile(file, IMG_TYPE.IMAGE_HOR)}
                    className="banner-dragger-comp"
                    disabled={this.state.disableDraggerImageVer}
                  >
                    {!this.state.imgHorUrlCropped &&
                    <div className="dragger-content">
                      <span className="upload-image-link"><Translate value={"upload it"}/></span>
                      <Translate value={"Drag your image over here or"}/>
                    </div>
                    }
                    {this.state.imgHorUrlCropped &&
                    <div className="upload-thumb-container">
                      <div className="edit-upload"
                           onClick={(e) => this.handleEdit(e, IMG_TYPE.IMAGE_HOR)}>
                        <Icon name="cif-edit"/>
                      </div>
                      <div className="remove-upload"
                           onClick={(e) => this.handleReset(e, "imgHorUrlCropped")}>
                        <Icon name="cif-close"/>
                      </div>
                      <img src={this.state.imgHorUrlCropped}/>
                    </div>
                    }
                  </Dragger>
                  <div className="drag-description">
                    <span className="span-block"><Translate value={"Allowed size: 480x320px"}/></span>
                    <span className="span-block"><Translate value={"Image ratio: 1.9:1"}/></span>
                    <span className="span-block"><Translate value={"allowed extensions: JPG/PNG/GIF"}/></span>
                  </div>
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
        {(this.state.imgVerUrlOriginal || this.state.imgHorUrlOriginal || this.state.logoUrlOriginal || this.state.iconUrlOriginal) && this.state.showCropModal &&
        <Modal
          maskClosable={false}
          closable={false}
          title={this.i18n._t("Crop image").toString()}
          visible={this.state.showCropModal}
          onOk={this.cropImg}
          footer={<Button type={"primary"} onClick={this.cropImg}>{this.i18n._t("Crop")}</Button>}>
          <div>
            <Cropper
              source={this.imageType === IMG_TYPE.IMAGE_VER ? this.state.imgVerUrlOriginal : (this.imageType === IMG_TYPE.IMAGE_HOR) ? this.state.imgHorUrlOriginal : this.imageType === IMG_TYPE.LOGO ? this.state.logoUrlOriginal : this.state.iconUrlOriginal}
              aspect={this.imageType === IMG_TYPE.IMAGE_VER ? (1 / 1.9) : (this.imageType === IMG_TYPE.IMAGE_HOR ? (1.9) : 1)}
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
