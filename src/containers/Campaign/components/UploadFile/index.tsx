import * as React from "react";
import Translate from "../../../../components/i18n/Translate";
import Dragger from "antd/es/upload/Dragger";
import {notification} from "antd";
import UploadService, {FlowUpload, UPLOAD_MODULES, UploadState} from "../../../../services/Upload";
import CONFIG from "../../../../constants/config";
import {IFileItem} from "../../containers/Upload/UploadUniversalApp";
import I18n from "../../../../services/i18n";
import Modal from "../../../../components/Modal";
import Button from "antd/es/button/button";
import Cropper from "../../../../components/Cropper/Index";
import Icon from "../../../../components/Icon";
import "./style.less";
import Progress from "antd/es/progress/progress";

export const enum FILE_TYPE {IMG_JPG = "image/jpeg", IMG_PNG = "image/png", IMG_GIF = "image/gif", VID_MP4 = "video/mp4"}

export const enum MODULE {IMAGE = "banner", VIDEO = "video"}

interface IDimension {
    width: number;
    height: number;
}

interface IProps {
    label: string;
    fileType: string[];
    minDimension?: IDimension;
    exactDimension?: IDimension;
    minSize?: number;
    ratio?: IDimension;
    uploadModule: string;
    className?: string;
    required?: boolean;
    customDragDisc?: JSX.Element;
    onChange?: (value: string) => void;
}

interface IState {
    value?: string;
    disableDragger: boolean;
    imgUrlOriginal: string;
    imgUrlCropped: string;
    videoFile: any;
    showCropModal: boolean;
    imageType?: string;
    progress: number;
}

class UploadFile extends React.Component<IProps, IState> {
    private i18n = I18n.getInstance();
    private disableUpload: boolean = false;
    private ratio: IDimension = {width: 1, height: 1};
    private tmpImg: Blob;
    id = "tmp_" + Date.now() + Math.random();

    constructor(props: IProps) {
        super(props);
        this.state = {
            disableDragger: false,
            imgUrlOriginal: "",
            imgUrlCropped: "",
            value: "",
            showCropModal: false,
            videoFile: null,
            progress: 0,
        };
        this.setRatio();
        this.changeFileProgressState = this.changeFileProgressState.bind(this);
        this.cropImg = this.cropImg.bind(this);
    }

    private setRatio() {
        if (this.props.ratio) {
            this.ratio = this.props.ratio;
        }
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
            prevState.imgUrlCropped = URL.createObjectURL(this.tmpImg);
            this.uploadImage(this.id, this.tmpImg);
            prevState.value = URL.createObjectURL(this.tmpImg);
            prevState.showCropModal = false;
            this.tmpImg = null;
            return prevState;
        }));
    }

    private handleReset(e) {
        e.stopPropagation();
        this.setState({imgUrlCropped: null, value: null});
        if (this.props.onChange) {
            this.props.onChange(null);
        }
    }

    private handleEdit(e) {
        e.stopPropagation();
        this.setState({
            showCropModal: true,
        });
    }

    /**
     * @func
     * @desc Check Image Dimension of file before upload
     * @param file
     * @returns {Promise<boolean>}
     */
    private setImageDimension(file: IFileItem): Promise<IFileItem> {
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
     * @desc handle change of file uploading progress
     * @param {number} id
     * @param {UploadState} state
     */
    private changeFileProgressState(id: number | string, state: UploadState): void {
        console.log("state.progress", state.progress);
        this.setState({
            progress: state.progress,
        });
    }

    private uploadImage(id: string, file: any) {
        const uploader = new UploadService(this.props.uploadModule, file, file.name);
        uploader.upload((state) => {
            this.changeFileProgressState(id, state);
        }).then((state) => {
            this.changeFileProgressState(id, state);
            console.log(state);
            if (this.props.onChange) {
                this.props.onChange(state.url);
            }
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
    }

    /**
     * @func
     * @desc Check Video size of file before upload
     * @param file
     * @returns {Promise<boolean>}
     */
    private setVideoDimension(file: IFileItem): Promise<IFileItem> {
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
     * @desc Check Media Content Dimension of file before upload
     * @param file
     * @returns {<boolean>}
     */
    private checkMediaDimension(file: IFileItem): boolean {
        if (this.props.exactDimension) {
            if (file.height === this.props.exactDimension.height && file.width === this.props.exactDimension.width) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (this.props.minDimension) {
            if (file.height >= this.props.minDimension.height && file.width >= this.props.minDimension.width) {
                return true;
            }
            else {
                return false;
            }
        }
        // return true when no specific Dimension  has been determined
        return true;
    }

    /**
     * @func
     * @desc Check Media Content format of file before upload
     * @param file
     * @returns {<boolean>}
     */
    private checkMediaFormat(file: IFileItem, type: FILE_TYPE[]): boolean {
        return type.includes(file.fileObject.type);
    }

    private checkMediaSize(file: IFileItem): void {
        console.log("size", file.fileObject.size);
    }

    /**
     * @func uploadFile
     * @desc assign Object Url of file to ad
     * @param file
     * @returns {boolean}
     */
    private uploadFile(file, type) {
        if (!this.disableUpload) {
            let fileItem = {
                id: this.id,
                fileObject: file,
                name: file.name,
            };
            if (file.type !== FILE_TYPE.VID_MP4) {
                this.setState({
                    disableDragger: true,
                });
                this.setImageDimension(fileItem as IFileItem)
                    .then((fileItemObject) => {
                        let dimensionCheck = this.checkMediaDimension(fileItemObject);
                        let formatCheck = this.checkMediaFormat(fileItemObject, type);
                        this.checkMediaSize(fileItemObject);
                        if (dimensionCheck && formatCheck) {
                            this.setState(prevState => {
                                prevState.imgUrlOriginal = URL.createObjectURL(fileItemObject.fileObject);
                                if (this.props.exactDimension || file.type === FILE_TYPE.IMG_GIF) {
                                    this.uploadImage(this.id, fileItemObject.fileObject);
                                    prevState.imgUrlCropped = URL.createObjectURL(fileItemObject.fileObject);
                                }
                                else {
                                    prevState.showCropModal = true;
                                }
                                prevState.imageType = file.type;
                                prevState.disableDragger = false;
                                this.disableUpload = false;
                                return prevState;
                            });
                        } else {
                            this.setState({disableDragger: false});
                            if (!dimensionCheck) {
                                notification.error({
                                    message: this.i18n._t("File dimension").toString(),
                                    className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                                    description: this.i18n._t("This file dimension isn't acceptable!").toString(),
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
                const uploader = new FlowUpload(MODULE.VIDEO, file);
                this.setVideoDimension(fileItem as IFileItem)
                    .then((fileItemObject) => {
                        let dimensionCheck = this.checkMediaDimension(fileItemObject);
                        let formatCheck = this.checkMediaFormat(fileItemObject, type);
                        if (dimensionCheck && formatCheck) {
                            this.setState({
                                videoFile: fileItemObject
                            }, () => {
                                uploader.upload((state) => {
                                    this.changeFileProgressState(this.id, state);
                                }).then((state) => {
                                    this.changeFileProgressState(this.id, state);
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
                                disableDragger: false,
                            });
                            if (!dimensionCheck) {
                                notification.error({
                                    message: this.i18n._t("File dimension").toString(),
                                    className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                                    description: this.i18n._t("This file dimension isn't acceptable!").toString(),
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

    public render() {
        return (
            <div>
        <span className={`image-drag-upload ${this.props.required ? "require" : ""}`}><Translate
            value={this.props.label}/></span>
                <Dragger
                    beforeUpload={(file) => this.uploadFile(file, this.props.fileType)}
                    className="banner-dragger-comp"
                    disabled={this.state.disableDragger}
                >
                    {this.state.progress > 0 && !(this.state.imgUrlCropped && this.state.progress === 100) &&
                    <Progress type={"line"} percent={parseInt((this.state.progress).toString())} width={100}/>
                    }
                    {this.state.progress === 0 && !this.state.imgUrlCropped &&
                    <div className="dragger-content">
                        {!this.props.customDragDisc &&
                        <div>
                            <span className="upload-image-link"><Translate value={"upload it"}/></span>
                            {this.props.uploadModule === "image" &&
                            <Translate value={"Drag your image over here or"}/>
                            }
                            {this.props.uploadModule === "video" &&
                            <Translate value={"Drag your video over here or"}/>
                            }
                        </div>
                        }
                        {this.props.customDragDisc &&
                        <div>
                            {this.props.customDragDisc}
                        </div>
                        }
                    </div>
                    }
                    {this.state.imgUrlCropped &&
                    <div className="upload-thumb-container">
                        <div className="edit-upload" onClick={(e) => this.handleEdit(e)}>
                            <Icon name="cif-edit"/>
                        </div>
                        <div className="remove-upload" onClick={(e) => this.handleReset(e)}>
                            <Icon name="cif-close"/>
                        </div>
                        <img src={this.state.imgUrlCropped}/>
                    </div>
                    }
                </Dragger>
                <div className="drag-description">

                    {this.props.minDimension &&
                    <span className="span-block">
            <Translate value={"Minimum dimension: %sx%spx"}
                       params={[this.props.minDimension.width, this.props.minDimension.height]}/></span>
                    }

                    {this.props.exactDimension &&
                    <span className="span-block">
            <Translate value={"Allowed dimension: %sx%spx"}
                       params={[this.props.exactDimension.width, this.props.exactDimension.height]}/></span>
                    }

                    {this.props.minSize &&
                    <span className="span-block"><Translate value={"Allowed size: 20MB"}/></span>
                    }

                    {this.props.ratio &&
                    <span className="span-block"><Translate value={"image ratio: %s.%s"}
                                                            params={[this.ratio.width, this.ratio.height]}/></span>
                    }
                    <span className="span-block"><Translate
                        value={"allowed extensions:"}/>{this.props.fileType.join("/").replace(/image\//g, "").replace(/video\//g, "").toUpperCase()}</span>
                </div>
                {this.state.imgUrlOriginal && this.state.showCropModal &&
                <Modal
                    maskClosable={false}
                    closable={false}
                    title={this.i18n._t("Crop image").toString()}
                    visible={this.state.showCropModal}
                    onOk={this.cropImg}
                    footer={<Button type={"primary"} onClick={this.cropImg}>{this.i18n._t("Crop")}</Button>}>
                    <div>
                        <Cropper
                            source={this.state.imgUrlOriginal}
                            type={this.state.imageType}
                            aspect={(this.ratio.width / this.ratio.height)}
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

export default UploadFile;
