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
import {RadioButton, RadioButtonGroup, TextField, RaisedButton, SelectField, MenuItem} from "material-ui";
import UtmModal from "./UtmModal";
import "./style.less";
import Modal from "../../../../components/Modal/index";
import Icon from "../../../../components/Icon/index";
import {ControllersApi, OrmCampaign} from "../../../../api/api";
import STEPS from "../../steps";
import {RootState} from "../../../../redux/reducers/index";
import {setCurrentStep, setCurrentCampaign, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {DEVICE_TYPES, WEB_TYPES} from "../Type";

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
    setLinkForAllBanners: boolean;
    openUtmModal: boolean;
    openImageModal: boolean;
    previewImage?: IFileItem;
    editFile?: IFileItem;
    globalUtm ?: string;
    adSize?: any;
    urlType?: URL_TYPE;
    otherUrlType?: OTHER_URL_TYPE;
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
class UploadBannerVideo extends React.Component <IProps, IState> {
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
            openUtmModal: false,
            files: [],
            setLinkForAllBanners: false,
            openImageModal: false,
            urlType: URL_TYPE.BAZAAR,
            otherUrlType: OTHER_URL_TYPE.TAPSTREAM,
            adSize: (props.currentCampaign && props.currentCampaign.id === this.props.match.params.id) ?
                ((this.state.currentCampaign.kind === DEVICE_TYPES.APPLICATION) ? AppSize : BannerSize)
                : BannerSize,
        };
        let otherPlaceholder: string ;
        this.changeFileProgressState = this.changeFileProgressState.bind(this);
    }

    public componentDidMount() {
        console.log(this.props.currentCampaign);
        this.setState({
            currentCampaign: this.props.currentCampaign,
            adSize: (this.props.currentCampaign.kind === DEVICE_TYPES.APPLICATION) ? AppSize :
                ((this.props.currentCampaign.type === WEB_TYPES.VIDEO) ? VideoSize : BannerSize),
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
            this.setState({
                globalUtm: utms[Object.keys(utms)[0]],
                setLinkForAllBanners: false,
            });
        } else {
            this.setState({
                setLinkForAllBanners: true,
            });
        }
    }

    loadBanners() {
        const controllerApi = new ControllersApi();
        controllerApi.campaignIdAdGet({
            id: this.state.currentCampaign.id.toString(),
        }).then((list) => {
            console.log(list);
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
                    }
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
                            console.log(err);
                            // fixme:: handle error
                            notification.error({
                                message: "Error",
                                description: "Error in upload progress!"
                            });
                        });
                    });
                } else {
                    notification.error({
                        message: this.i18n._t("File Size").toString(),
                        description: this.i18n._t("This file size isn't acceptable!").toString(),
                    });
                }
            });
        return false;
    }

    /**
     * @func handleChangeLinkSettings
     * @desc Set state for setting link for all banners or not
     * @param e
     * @param setAll
     */
    private handleChangeLinkSettings(e: any, setAll) {
        this.setState({
            setLinkForAllBanners: setAll,
        });
    }

    /**
     * @func openUtmModal
     * @desc Set selected file for editing config and open utm modal
     * @param {IFileItem} file
     */
    private openUtmModal(file?: IFileItem) {
        this.setState({
            openUtmModal: true,
            editFile: file,
        });
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
                utm: !this.state.setLinkForAllBanners ? this.state.globalUtm : file.utm,
                src: file.state.url,
                id: file.id.toString().indexOf("tmp_") === 0 ? null : file.id,
            });
        });

        const controllerApi = new ControllersApi();
        controllerApi.adBannerIdPost({
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
     * @func onUtmModalSubmit
     * @desc Handle params that receive from utm modal
     * @param params
     */
    private onUtmModalSubmit(params) {

        let files = this.state.files;
        if (this.state.editFile) {
            const indexOfFile = files.findIndex((f) => (f.id === this.state.editFile.id));
            files[indexOfFile].name = params.name;
            files[indexOfFile].utm = params.link;
            this.setState({
                files,
                openUtmModal: false,
            });
        } else {
            this.setState({
                globalUtm: params.link,
                openUtmModal: false,
            });
        }
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
            <div dir={CONFIG.DIR} className="campaign-content">
                <div className="campaign-title">
                    <h2><Translate value="Uplaod banner"/></h2>
                    <p><Translate value="Upload banner description"/></p>
                </div>
                <Row type="flex" gutter={16} justify="center">
                    <Col span={17}>
                        <Row>
                            <Form>
                                <Row type="flex" align="middle" className="mb-1">
                                    <Col span={5}>
                                        <label><Translate value="Link settings"/></label>
                                    </Col>
                                    <Col span={19}>
                                        <FormItem>
                                            <RadioButtonGroup className="campaign-radio-group" name="setAll"
                                                              defaultSelected={this.state.setLinkForAllBanners}
                                                              onChange={this.handleChangeLinkSettings.bind(this)}>
                                                <RadioButton className="campaign-radio-button"
                                                             value={false}
                                                             label={this.i18n._t("Set link for all banners")}
                                                />
                                                <RadioButton className="campaign-radio-button"
                                                             value={true}
                                                             label={this.i18n._t("Set different config for each banner.")}
                                                />
                                            </RadioButtonGroup>
                                        </FormItem>
                                    </Col>
                                </Row>
                                {!this.state.setLinkForAllBanners && this.state.currentCampaign.kind === DEVICE_TYPES.WEB &&
                                <Row type="flex" align="middle">
                                    <Col span={5}>
                                        <label><Translate value="URL"/></label>
                                    </Col>
                                    <Col span={19}>
                                        <Row type="flex" align="middle" gutter={24}>
                                            <Col span={15}>
                                                <FormItem>
                                                    <TextField
                                                        className="upload-textfield"
                                                        fullWidth={true}
                                                        value={this.state.globalUtm}
                                                        onChange={(e, value) => {
                                                            this.setState({
                                                                globalUtm: value,
                                                            });
                                                        }}
                                                        hintText={"https://example.com/search/?utm_source=...."}
                                                    />
                                                </FormItem>
                                            </Col>
                                            <Col span={3} offset={6}>
                                                <Button
                                                    className="add-utm-btn"
                                                    onClick={() => {
                                                        this.openUtmModal();
                                                    }}>
                                                    <Icon name={"cif-gear-outline"} className="utm-icon"/>
                                                    <Translate value="set utm parameters"/>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                }
                                {!this.state.setLinkForAllBanners && this.state.currentCampaign.kind === DEVICE_TYPES.APPLICATION &&
                                <div>
                                    <Row type="flex" align="middle" className="url-row">
                                        <Col span={5}>
                                            <label><Translate value="URL"/></label>
                                        </Col>
                                        <Col span={19}>
                                            <Row type="flex" align="middle">
                                                <Col span={15}>
                                                    <FormItem>
                                                        <SelectField className={"select-list-rtl select-url"}
                                                                     onChange={(a, b, value) => {
                                                                         this.setState({
                                                                             urlType: value,
                                                                         });
                                                                     }}
                                                                     value={this.state.urlType}>
                                                            <MenuItem value={URL_TYPE.BAZAAR}
                                                                      primaryText={this.i18n._t("Coffe Bazaar")}/>
                                                            <MenuItem value={URL_TYPE.PLAY_STORE}
                                                                      primaryText={this.i18n._t("Google Playstore")}/>
                                                            <MenuItem value={URL_TYPE.URL}
                                                                      primaryText={this.i18n._t("URL")}/>
                                                            <MenuItem value={URL_TYPE.PHONE}
                                                                      primaryText={this.i18n._t("Phone")}/>
                                                            <MenuItem value={URL_TYPE.INSTAGRAM}
                                                                      primaryText={this.i18n._t("Instagram")}/>
                                                            <MenuItem value={URL_TYPE.OTHER}
                                                                      primaryText={this.i18n._t("Other")}/>
                                                        </SelectField>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    {this.state.urlType === URL_TYPE.URL &&
                                    <Row type="flex" align="middle" className={"url-row-item"}>
                                        <Col span={5}>
                                        </Col>
                                        <Col span={19}>
                                            <Row type="flex" align="middle">
                                                <Col span={15}>
                                                    <FormItem>
                                                        <TextField
                                                            className="upload-textfield"
                                                            fullWidth={true}
                                                            value={this.state.globalUtm}
                                                            onChange={(e, value) => {
                                                                this.setState({
                                                                    globalUtm: value,
                                                                });
                                                            }}
                                                            hintText={"https://example.com/search/?utm_source=...."}
                                                        />
                                                    </FormItem>
                                                </Col>
                                                <Col span={9}>
                                                    <Button
                                                        className="add-utm-btn"
                                                        onClick={() => {
                                                            this.openUtmModal();
                                                        }}>
                                                        <Icon name={"cif-gear-outline"} className="utm-icon"/>
                                                        <Translate value="set utm parameters"/>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    }
                                    {this.state.urlType === URL_TYPE.BAZAAR &&
                                    <Row type="flex" align="middle" className={"url-row-item"}>
                                        <Col span={5}>
                                        </Col>
                                        <Col span={19}>
                                            <Row type="flex" align="middle">
                                                <Col span={15}>
                                                    <FormItem>
                                                        <TextField
                                                            className="upload-textfield"
                                                            fullWidth={true}
                                                            value={this.state.globalUtm}
                                                            onChange={(e, value) => {
                                                                this.setState({
                                                                    globalUtm: value,
                                                                });
                                                            }}
                                                            hintText={this.i18n._t("/app/com.sticksports.soccer2?/?l=fa")}
                                                        />
                                                    </FormItem>
                                                </Col>
                                                <Col span={9}>
                                                    <label className="url-label">{this.i18n._t("http://cafebazaar.ir")}</label>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    }
                                    {this.state.urlType === URL_TYPE.PLAY_STORE &&
                                    <Row type="flex" align="middle" className={"url-row-item"}>
                                        <Col span={5}>
                                        </Col>
                                        <Col span={19}>
                                            <Row type="flex" align="middle">
                                                <Col span={15}>
                                                    <FormItem>
                                                        <TextField
                                                            className="upload-textfield"
                                                            fullWidth={true}
                                                            value={this.state.globalUtm}
                                                            onChange={(e, value) => {
                                                                this.setState({
                                                                    globalUtm: value,
                                                                });
                                                            }}
                                                            hintText={this.i18n._t("/store/apps/details?id=com.ustwo.monumentvalley2")}
                                                        />
                                                    </FormItem>
                                                </Col>
                                                <Col span={9}>
                                                    <label className="url-label">{this.i18n._t("http://play.google.com")}</label>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    }
                                    {this.state.urlType === URL_TYPE.PHONE &&
                                    <Row type="flex" align="middle" className={"url-row-item"}>
                                        <Col span={5}>
                                        </Col>
                                        <Col span={19}>
                                            <Row type="flex" align="middle">
                                                <Col span={15}>
                                                    <FormItem>
                                                        <TextField
                                                            className="upload-textfield"
                                                            fullWidth={true}
                                                            value={this.state.globalUtm}
                                                            onChange={(e, value) => {
                                                                this.setState({
                                                                    globalUtm: value,
                                                                });
                                                            }}
                                                            hintText={this.i18n._t("Phone number exp: 09198193915 or *100#")}
                                                        />
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    }
                                    {this.state.urlType === URL_TYPE.MARKET &&
                                    <Row type="flex" align="middle" className={"url-row-item"}>
                                        <Col span={5}>
                                        </Col>
                                        <Col span={19}>
                                            <Row type="flex" align="middle">
                                                <Col span={15}>
                                                    <FormItem>
                                                        <TextField
                                                            className="upload-textfield"
                                                            fullWidth={true}
                                                            value={this.state.globalUtm}
                                                            onChange={(e, value) => {
                                                                this.setState({
                                                                    globalUtm: value,
                                                                });
                                                            }}
                                                            hintText={this.i18n._t("package name in maket")}
                                                        />
                                                    </FormItem>
                                                </Col>
                                                <Col span={9}>
                                                    <label className="url-label">{this.i18n._t("market://details?id")}</label>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    }
                                    {this.state.urlType === URL_TYPE.OTHER &&
                                    <Row type="flex" align="middle" className={"url-row-item"}>
                                        <Col span={5}>
                                        </Col>
                                        <Col span={19}>
                                            <Row type="flex" align="middle">
                                                <Col span={15}>
                                                    <FormItem>
                                                            {this.state.otherUrlType === OTHER_URL_TYPE.TAPSTREAM &&
                                                            <TextField
                                                                className="upload-textfield"
                                                                fullWidth={true}
                                                                value={this.state.globalUtm}
                                                                onChange={(e, value) => {
                                                                    this.setState({
                                                                        globalUtm: value,
                                                                    });
                                                                }}
                                                                hintText={this.i18n._t("http://taps.io/xyzTn?__tshardware-android-android-id=...")}
                                                            />
                                                            }
                                                    </FormItem>
                                                </Col>
                                                <Col span={9}>
                                                    <FormItem className="select-other-url-form">
                                                    <SelectField className={"select-list-rtl select-url-other"}
                                                                 onChange={(a, b, value) => {
                                                                     this.setState({
                                                                         otherUrlType: value,
                                                                     });
                                                                 }}
                                                                 value={this.state.otherUrlType}>
                                                        <MenuItem value={OTHER_URL_TYPE.TAPSTREAM}
                                                                  primaryText={this.i18n._t("Tap stream")}/>
                                                    </SelectField>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    }
                                </div>
                                }
                                <Row type={"flex"}>
                                    <Col span={24}>
                                        <Row type="flex" gutter={30}>
                                            {this.state.files.map((file, index) => (
                                                <Col key={file.id} span={12}>
                                                    <Card className="upload-process-wrapper">
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
                                                        <div className="upload-process-content">
                                                            <p>{file.name}</p>
                                                            {file.fileObject &&
                                                            <small>
                                                                <Translate value="File size:"/>
                                                                {FileSizeConvertor(file.fileObject.size)}
                                                            </small>
                                                            }
                                                        </div>
                                                        <div className="upload-option">
                                                            {file.state && file.state.progress !== 100 &&
                                                            <Progress type="circle"
                                                                      percent={file.state ? file.state.progress : 1}
                                                                      width={35}/>
                                                            }
                                                            {this.state.setLinkForAllBanners && file.state && file.state.progress === 100 &&
                                                            <Button onClick={() => {
                                                                this.openUtmModal(file);
                                                            }}
                                                                    className="btn-edit"
                                                            >
                                                                <Icon name={"cif-edit"}/>
                                                            </Button>
                                                            }
                                                            <Button onClick={() => {
                                                                this.removeFile(file.id);
                                                            }}
                                                                    className="btn-cancel"
                                                            >
                                                                <Icon name={"cif-closelong"}/>
                                                            </Button>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
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
                                    </Col>
                                </Row>
                                <Row type="flex" align="middle">
                                    <RaisedButton
                                        onClick={this.handleBack.bind(this)}
                                        label={<Translate value="Back"/>}
                                        primary={false}
                                        className="button-back-step"
                                        icon={<Icon name={"cif-arrowleft-4"} className={"back-arrow"}/>}
                                    />
                                    <RaisedButton
                                        onClick={this.handleSubmit.bind(this)}
                                        label={<Translate value="Next Step"/>}
                                        primary={true}
                                        className="button-next-step"
                                        icon={<Icon name="cif-arrow-left" className={"arrow-next-step"}/>}
                                    />
                                </Row>
                            </Form>
                        </Row>
                    </Col>
                    <Col span={7}>
                        <Row type="flex" className="column-info-rtl">
                            <h6 className="full-width">
                                <Icon name="cif-lightbulb"/><Translate value={"You should know:"}/>
                            </h6>
                            <ul>
                                <li><Translate value={"Maximum file size: static banner 200KB / video 2MB"}/></li>
                                <li><Translate value={"Supported formats"}/></li>
                                <Icon className="extensions-icon" name={"cif-extensions-jpg"}/>
                                <Icon className="extensions-icon" name={"cif-extensions-png"}/>
                                <Icon className="extensions-icon" name={"cif-extensions-gif"}/>
                                <Icon className="extensions-icon" name={"cif-extensions-mp4"}/>
                                <li><Translate value={"Supported dimension Sizes"}/></li>
                                <div className="banner-size-wrapper">
                                    {this.state.adSize.map((size, index) => {
                                        return (
                                            <span className={`banner-size-tag ${size["active"] ? "active" : "" }`}
                                                  key={index}>
                        {`${size.width}x${size.height}`}
                  </span>
                                        );
                                    })}
                                </div>
                            </ul>
                        </Row>
                    </Col>
                </Row>
                {this.state.openUtmModal &&
                <UtmModal
                    link={!this.state.setLinkForAllBanners ? this.state.globalUtm : this.state.editFile.utm}
                    file={this.state.editFile}
                    onSubmit={this.onUtmModalSubmit.bind(this)}
                    onClose={() => {
                        this.setState({
                            openUtmModal: false,
                        });
                    }}
                />
                }
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


export default Form.create<IProps>()(withRouter(UploadBannerVideo as any));
