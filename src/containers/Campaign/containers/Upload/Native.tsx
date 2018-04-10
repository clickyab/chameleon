/**
 * @file Native
 */
import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {Upload, Row, Col, notification, Card, Progress, Form, Spin} from "antd";
import Translate from "../../../../components/i18n/Translate/index";
import CONFIG from "../../../../constants/config";
import {default as UploadService, UPLOAD_MODULES, UploadState, UPLOAD_STATUS} from "../../../../services/Upload/index";
import I18n from "../../../../services/i18n/index";
import UtmModal from "./UtmModal";
import "./style.less";
import Modal from "../../../../components/Modal/index";
import Icon from "../../../../components/Icon/index";
import {ControllersApi, OrmCampaign, ControllersGetNativeDataResp} from "../../../../api/api";
import STEPS from "../../steps";
import {RootState} from "../../../../redux/reducers/index";
import {setCurrentStep, setCurrentCampaign, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {RaisedButton, TextField} from "material-ui";
import Tooltip from "../../../../components/Tooltip";
import {DesktopPreview} from "./previewComponent/desktop";
import {TabletPreview} from "./previewComponent/tablet";
import {PhonePreview} from "./previewComponent/phone";
import Cropper from "../../../../components/Cropper/Index";
import Button from "antd/es/button/button";
import Image from "react-image-file";
import FileSizeConvertor from "../../../../services/Utils/FileSizeConvertor";

const Dragger = Upload.Dragger;

/**
 * @interface IProps
 * @desc define Prop object
 */
interface IProps {
  currentCampaign?: OrmCampaign;
  setCurrentStep?: (step: STEPS) => {};
  form?: any;
  setSelectedCampaignId?: (id: number | null) => {};
  currentStep?: STEPS;
  selectedCampaignId?: number | null;
  match?: any;
  history?: any;
  nativeItems?: NativeAd[];
  previewType?: PREVIEW;
}

/**
 * @interface IFileItem
 * @desc define single file object
 */
export interface IFileItem {
  id?: number | string;
  fileObject?: any;
  state?: UploadState;
  name: string;
}

interface NativeAd extends ControllersGetNativeDataResp {
  id: string;
  loading: boolean;
  preViewImg?: string;
  utm?: string;
}

enum PREVIEW {DESKTOP, TABLET, PHONE}

/**
 * @interface IState
 * @desc define state object
 */
interface IState {
  currentCampaign: OrmCampaign;
  nativeItems: NativeAd[];
  addAddURLField: string;
  previewType: PREVIEW;
  inputIndex: number | null;
  showUploadModal: boolean;
  showCropModal: boolean;
  showUtmModal: boolean;
  manageImageItem?: NativeAd;
  crop?: object;
  UploadFiles?: IFileItem;
}

@connect(mapStateToProps, mapDispatchToProps)
class NativeComponent extends React.Component <IProps, IState> {
  private i18n = I18n.getInstance();
  private tmpImg: Blob;
  private controllersApi = new ControllersApi();

  /**
   * @constructor
   * @desc Set initial state and binding
   * @param {IProps} props
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      currentCampaign: props.currentCampaign && props.currentCampaign.id === this.props.match.params.id ? props.currentCampaign : null,
      nativeItems: props.nativeItems ? props.nativeItems : [],
      addAddURLField: "",
      previewType: props.previewType ? props.previewType : PREVIEW.DESKTOP,
      inputIndex: null,
      showCropModal: false,
      showUploadModal: false,
      showUtmModal: false,
    };

    this.cropImg = this.cropImg.bind(this);
  }

  public componentDidMount() {
    this.setState({
      currentCampaign: this.props.currentCampaign,
    }, this.loadBanners);
  }

  /**
   * @func loadBanners
   * @desc load ads of native campaign
   */
  private loadBanners() {
    const controllerApi = new ControllersApi();
    controllerApi.campaignGetIdAdGet({
      id: this.state.currentCampaign.id.toString(),
    }).then((list) => {
      // this.setState({
      //   nativeItems: list.map(ad => {
      //     let inputData: NativeAd = {
      //       id: ad.id.toString(),
      //       image: "http://staging.crab.clickyab.ae/uploads/" + ad.src,
      //       preViewImg: "http://staging.crab.clickyab.ae/uploads/" + ad.src,
      //       url: ad.target,
      //       description: "",
      //       title: ad.attr.native.title,
      //       site_name: "",
      //       loading: false,
      //     };
      //     return inputData;
      //   }),
      // });
    });
  }

  /**
   * @func handleBack
   * @desc handle click on back button
   */
  private handleBack() {
    this.props.setCurrentStep(STEPS.SELECT_PUBLISHER);
    this.props.history.push(`/campaign/select-publisher/${this.props.match.params.id}`);
  }

  /**
   * @func uploadFinalImages
   * @desc upload ad's image
   * @param {NativeAd} item
   * @returns {Promise<NativeAd>}
   */
  private uploadFinalImages(item: NativeAd): Promise<NativeAd> {
    return new Promise((resolve, reject) => {
      let ad = Object.assign({}, item);
      if (ad.image.indexOf("http") === 0) {
        ad.image = ad.image.replace("http://staging.crab.clickyab.ae/uploads/", "");
        resolve(ad);
        return;
      }
      let xhr = new XMLHttpRequest();
      xhr.open("GET", ad.preViewImg, true);
      xhr.responseType = "blob";
      xhr.onload = function (e) {
        const blob = xhr.response;
        const uploader = new UploadService(UPLOAD_MODULES.NATIVE, blob, "file.jpg");
        uploader.upload()
          .then(status => {
            if (status.url && status.progress === 100) {
              ad.image = status.url;
              resolve(ad);
            } else {
              reject(status);
            }
          })
          .catch(err => {
            reject(err);
          });
      };
      xhr.send();

    });
  }

  /**
   * @func handleSubmit
   * @desc handle submit form. after upload all ad's images, assign ads to campaign
   */
  private handleSubmit() {
    let uploadPromises = this.state.nativeItems.map(this.uploadFinalImages);

    Promise.all(uploadPromises)
      .then(items => {
        this.setState({
          nativeItems: items
        });
        let ads = [];
        items.map((ad) => {
          let adObj = {
            utm: ad.url,
            src: ad.image,
            title: ad.title
          };

          if (ad.id.indexOf("tmp_") === -1) {
            adObj["id"] = parseInt(ad.id);
          }
          ads.push(adObj);
        });

        // this.controllersApi.adBannerTypeIdPost({
        //   id: this.state.currentCampaign.id.toString(),
        //   bannerType: UPLOAD_MODULES.NATIVE,
        //   payloadData: {
        //     banners: ads
        //   }
        // }).then(() => {
        //   this.props.history.push(`/campaign/check-publish/${this.props.match.params.id}`);
        // });
      });
  }

  /**
   * @func handelPreview
   * @desc set preview type
   * @param {PREVIEW} preview
   */
  private handlePreview(preview: PREVIEW): void {
    this.setState({previewType: preview});
  }

  /**
   * @func handleAdd
   * @desc add new item to state
   */
  private handleAdd(): void {
    let inputData: NativeAd = {
      id: "tmp_" + Date.now(),
      image: "",
      url: "",
      description: "",
      title: "",
      site_name: "",
      loading: true,
    };
    inputData.image = this.state.addAddURLField;

    this.setState({
      manageImageItem: inputData,
    });

    this.controllersApi.campaignNativeFetchPost({
      payloadData: {
        url: this.state.addAddURLField,
      }
    }).then((data: ControllersGetNativeDataResp) => {
      const hasImage = !!data.image;
      if (!data.url) {
        notification.error({
          message: this.i18n._t("Failed Add New Link").toString(),
          description: this.i18n._t("Cannot fetch your link!").toString(),
        });
        return;
      }
      data.image = "http://staging.crab.clickyab.ae/uploads/" + data.image;
      let remoteObject = Object.assign({}, inputData, data);
      remoteObject.loading = false;
      this.setState(prevState => {
        let itemّIndex = prevState.nativeItems.findIndex(item => (item.id === inputData.id));
        prevState.nativeItems[itemّIndex] = remoteObject;
        if (hasImage) {
          prevState.showCropModal = true;
          prevState.manageImageItem = remoteObject;
          console.log(data);
        } else {
          prevState.showUploadModal = true;
          prevState.manageImageItem = remoteObject;
        }

        prevState.addAddURLField = "";
        return prevState;
      });

    });
  }

  /**
   * @func removeItem
   * @desc remove item after click on x icon
   */
  private removeItem(item) {
    let index: number = this.state.nativeItems.indexOf(item);
    if (index >= 0) {
      let tempState = this.state.nativeItems;
      tempState.splice(index, 1);
      this.setState({nativeItems: tempState});
    }
  }

  // TODO: Remove this part only for Demo
  private handleAddField(value) {
    this.setState({addAddURLField: value});
  }

  /**
   * @func handleDescChange
   * @desc handle Description change of item onChange
   */
  public handleTitleChange(e, item) {
    let index: number = this.state.nativeItems.findIndex(i => (i.id === item.id));
    if (index >= 0 && e.target.value.length <= 50) {
      let tempState = this.state.nativeItems;
      tempState[index].title = e.target.value;
      this.setState({nativeItems: tempState});
    }
  }

  /**
   * @func handleUrlChange
   * @desc handle url of item onChange
   */
  public handleUrlChange(e, item) {
    let index: number = this.state.nativeItems.indexOf(item);
    if (index >= 0 && e.target.value.length <= 50) {
      let tempState = this.state.nativeItems;
      tempState[index].url = e.target.value;
      this.setState({nativeItems: tempState});
    }
  }

  /**
   * @func handleEnable
   * @desc Enable input of url items (Set index onClick of edit icon)
   */
  public handleEnable(index) {
    this.setState({inputIndex: index});
  }

  /**
   * @func handleDisable
   * @desc Disable input of url items (Set index to null)
   */
  public handleDisable() {
    this.setState({inputIndex: null});
  }

  /**
   * @func openUtmModal
   * @desc set ad as `manageImageItem` in state and open utm modal
   * @param {NativeAd} ad
   */
  private openUtmModal(ad: NativeAd) {
    this.setState({
      showUtmModal: true,
      manageImageItem: ad,
    });
  }

  /**
   * @func onUtmModalSubmit
   * @desc assign utm link to ad'a url and close modal
   * @param params
   */
  private onUtmModalSubmit(params) {
    console.log(params);
    this.setState(prevState => {
      const indexOfItem = this.state.nativeItems.findIndex((item) => (item.id === prevState.manageImageItem.id));
      prevState.nativeItems[indexOfItem].url = params.link;

      prevState.showUtmModal = false;
      prevState.manageImageItem = null;

      return prevState;
    });
  }

  /**
   * @func listItemMap
   * @desc create a map of list's item element
   * @returns {JSX.Element[]}
   */
  private listItemMap(): JSX.Element[] {
    return this.state.nativeItems.map((item, index) => {
      return (
        <Spin key={item.id} spinning={item.loading}>
          <Row type="flex" className="native-item-wrapper" gutter={24}>
            <div className="native-img-wrapper">
              <div className="img-container" onClick={() => {
                this.showUploadModal(item);
              }}>
                <img className="native-img" src={item.preViewImg}/>
              </div>
            </div>
            <div className="native-info-col">
              <Row align="middle" className={"pt-1 pb-1"}>
                <Row>
                  <Col span={5} className="native-item-icon">
                    {item.id.indexOf("tmp_") === 0 &&
                    <Icon name={"cif-closelong"} onClick={() => this.removeItem(item)}/>
                    }
                    <Icon name={"cif-edit"} className={this.state.inputIndex === index ? "selected-edit" : ""}
                          onClick={() => this.openUtmModal(item)}/>
                  </Col>
                  <Col span={19} className="native-item-url">
                    <TextField
                      className="native-url-input"
                      fullWidth={true}
                      disabled={true}
                      value={item.url}
                      onChange={(e, value) => this.handleUrlChange(e, item)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>

                    <TextField
                      className="native-input"
                      fullWidth={true}
                      defaultValue={item.title}
                      onChange={(e, value) => this.handleTitleChange(e, item)}
                    />
                    <span className={`item-desc-num ${ (item.title.length > 10) ? "green" : "red"}`}>
                                        {item.title.length}
                                    </span>
                  </Col>
                </Row>
              </Row>
            </div>
          </Row>
        </Spin>
      );
    });
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
    const indexOfItem = this.state.nativeItems.findIndex(item => ( item.id === this.state.manageImageItem.id));
    this.setState((prevState => {
      let item = Object.assign({}, prevState.manageImageItem);
      item.preViewImg = URL.createObjectURL(this.tmpImg);
      if (indexOfItem === -1) {
        prevState.nativeItems.push(item);
      } else {
        prevState.nativeItems[indexOfItem] = item;
      }
      prevState.manageImageItem = null;
      prevState.showCropModal = false;
      this.tmpImg = null;
      return prevState;
    }));
  }

  /**
   * @func showUploadModal
   * @desc set ad as `manageImageItem` and open upload modal
   * @param item
   */
  private showUploadModal(item) {
    this.setState({
      manageImageItem: item,
      showUploadModal: true,
    });
  }

  /**
   * @func uploadFile
   * @desc assign Object Url of file to ad
   * @param file
   * @returns {boolean}
   */
  private uploadFile(file) {
    this.setState(prevState => {
      prevState.showCropModal = true;
      prevState.UploadFiles = null;
      prevState.manageImageItem.image = URL.createObjectURL(file);
      return prevState;
    });
    return false;
  }

  public render() {

    if (this.props.match.params.id && !this.state.currentCampaign) {
      return <Spin/>;
    }

    return (
      <div dir={CONFIG.DIR} className="campaign-content">
        <div className="campaign-title">
          <h2><Translate value="Uplaod banner"/></h2>
          <p><Translate value="Upload banner description"/></p>
        </div>
        <Row type="flex" gutter={32} justify="center">
          <Col sm={{span: 24}} md={{span: 12}}>
            <Row>
              <Row className="native-title">
                <Translate value={"Your content"}/>
              </Row>
              {this.listItemMap()}
            </Row>
            <Row type="flex" className={"mt-2"} gutter={12} align="middle">
              <Col span={4}>
                <label>
                  <Tooltip/>
                  <Translate value={"URL"}/>
                </label>
              </Col>
              <Col span={17}>
                <TextField
                  fullWidth={true}
                  hintText={<Translate
                    value={"http://example.com/search/?utm_source=summer&utm..."}/>}
                  onChange={(e, value) => this.handleAddField(value)}
                  className="url-textfield"
                />
              </Col>
              <Col span={3}>
                <RaisedButton
                  label={<Translate value="Add"/>}
                  primary={false}
                  className="btn-add-url"
                  icon={<Icon name="cif-plusregular plus-icon "/>}
                  onClick={() => this.handleAdd()}
                />
              </Col>
            </Row>
          </Col>
          <Col sm={{span: 24}} md={{span: 12}}>
            <Row type="flex" justify="center" style={{height: "100%"}} gutter={21}>
              <Col span={20}>
                <div className="native-svg-wrapper">
                  {this.state.previewType === PREVIEW.DESKTOP &&
                  <div className="display-wrapper">
                    {DesktopPreview(this.state.nativeItems[this.state.nativeItems.length - 1])}
                  </div>
                  }
                  {this.state.previewType === PREVIEW.TABLET &&
                  <div className="tablet-wrapper">
                    {TabletPreview(this.state.nativeItems[this.state.nativeItems.length - 1])}
                  </div>
                  }
                  {this.state.previewType === PREVIEW.PHONE &&
                  <div className="phone-wrapper">
                    {PhonePreview(this.state.nativeItems[this.state.nativeItems.length - 1])}
                  </div>
                  }
                </div>
              </Col>
              <Col span={1} className="icon-native-wrapper">
                <Icon name={"cif-edit  icon-native"} onClick={() => {
                  this.handlePreview(PREVIEW.DESKTOP);
                }}/>
                <Icon name={"cif-edit  icon-native"} onClick={() => {
                  this.handlePreview(PREVIEW.TABLET);
                }}/>
                <Icon name={"cif-edit  icon-native"} onClick={() => {
                  this.handlePreview(PREVIEW.PHONE);
                }}/>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={4}>
            <RaisedButton
              onClick={this.handleBack.bind(this)}
              label={<Translate value="Back"/>}
              primary={false}
              className="button-back-step"
              icon={<Icon name={"cif-arrowleft-4"} className={"back-arrow"}/>}
            />
          </Col>
          <Col span={20}>
            <RaisedButton
              onClick={this.handleSubmit.bind(this)}
              label={<Translate value="Next Step"/>}
              primary={true}
              className="button-next-step"
              icon={<Icon name="cif-arrow-left" className={"arrow-next-step"}/>}
            />
          </Col>
        </Row>
        {this.state.manageImageItem && this.state.manageImageItem.image && this.state.showCropModal &&
        <Modal
          maskClosable={false}
          closable={false}
          title={this.i18n._t("Crop image").toString()}
          visible={this.state.showCropModal}
          onOk={this.cropImg}
          footer={<Button type={"primary"} onClick={this.cropImg}>{this.i18n._t("Crop")}</Button>}>
          <div>
            <Cropper source={this.state.manageImageItem.image}
                     aspect={170 / 105}
                     onChange={(img: Blob) => {
                       this.tmpImg = img;
                     }}/>
          </div>
        </Modal>
        }
        {this.state.manageImageItem && this.state.showUploadModal &&
        <Modal
          maskClosable={false}
          closable={false}
          title={this.i18n._t("Upload Image").toString()}
          visible={this.state.showUploadModal}
          footer={this.state.manageImageItem.image ?
            <Button onClick={() => {
              this.setState({manageImageItem: null, showUploadModal: false});
            }}>{this.i18n._t("Cancel")}</Button> : null}>
          <div>
            {this.state.UploadFiles &&
            <Row type="flex" gutter={30}>
              <Col span={24}>
                <Card className="upload-process-wrapper">
                  <div className="image-wrapper">
                    {this.state.UploadFiles.fileObject && (!this.state.UploadFiles.state || !this.state.UploadFiles.state.url) &&
                    <Image file={this.state.UploadFiles.fileObject} alt={this.state.UploadFiles.fileObject.name}
                           type={"img"}
                    />
                    }
                    {this.state.UploadFiles.state && this.state.UploadFiles.state.url &&
                    <img
                      src={`http://staging.crab.clickyab.ae/uploads/` + this.state.UploadFiles.state.url}
                      alt={this.state.UploadFiles.name}/>
                    }
                  </div>
                  <div className="upload-process-content">
                    <p>{this.state.UploadFiles.name}</p>
                    {this.state.UploadFiles.fileObject &&
                    <small>
                      <Translate value="File size:"/>
                      {FileSizeConvertor(this.state.UploadFiles.fileObject.size)}
                    </small>
                    }
                  </div>
                  <div className="upload-option">
                    {this.state.UploadFiles.state && this.state.UploadFiles.state.progress !== 100 &&
                    <Progress type="circle"
                              percent={this.state.UploadFiles.state ? this.state.UploadFiles.state.progress : 1}
                              width={35}/>
                    }
                  </div>
                </Card>
              </Col>
            </Row>
            }
            {!this.state.UploadFiles &&
            <Dragger
              beforeUpload={this.uploadFile.bind(this)}
            >
              <div className={"dragger-content"}>
                <Icon name={"cif-cloud-upload"} className={"upload-icon"}/>
                <h2>Drag &amp; <b>Drop</b></h2>
                <Translate value={"Drag your file over here"}/>
                <RaisedButton
                  label={<Translate value="Select and Uplaod"/>}
                  primary={false}
                  className="btn-dragger"
                />
              </div>
            </Dragger>
            }
          </div>
        </Modal>
        }
        {this.state.manageImageItem && this.state.showUtmModal &&
        <UtmModal
          link={this.state.manageImageItem.url}
          onSubmit={this.onUtmModalSubmit.bind(this)}
          onClose={() => {
            this.setState({
              showUtmModal: false,
              manageImageItem: null,
            });
          }}
        />
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


export default Form.create<IProps>()(withRouter(NativeComponent as any));
