/**
 * @file Upload banner step
 */
import * as React from "react";
import Image from "react-image-file";
import {withRouter} from "react-router";
import BannerSize from "./CONSTsize";
import {Upload, Row, Col, notification, Card, Progress, Button, Form, Icon} from "antd";
import Translate from "../../../../components/i18n/Translate/index";
import CONFIG from "../../../../constants/config";
import {default as UploadService, UPLOAD_MODULES, UploadState} from "../../../../services/Upload/index";
import I18n from "../../../../services/i18n/index";
import FileSizeConvertor from "../../../../services/Utils/FileSizeConvertor";
import {RadioButton, RadioButtonGroup, TextField, RaisedButton} from "material-ui";
import UtmModal from "./UtmModal";
import "./style.less";
import Modal from "../../../../components/Modal/index";

const Dragger = Upload.Dragger;
const FormItem = Form.Item;

/**
 * @interface IFileItem
 * @desc define single file object
 */
export interface IFileItem {
  id: number;
  fileObject: any;
  state?: UploadState;
  utm?: string;
  name: string;
  width?: number;
  height?: number;
}

interface IProps {
}

/**
 * @interface IState
 * @desc define state object
 */
interface IState {
  files: IFileItem[];
  setLinkForAllBanners: boolean;
  openUtmModal: boolean;
  openImageModal: boolean;
  previewImage?: IFileItem;
  editFile?: IFileItem;
  globalUtm ?: string;
}

class UploadComponent extends React.Component <IProps, IState> {
  private i18n = I18n.getInstance();

  /**
   * @constructor
   * @desc Set initial state and binding
   * @param {IProps} props
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      openUtmModal: false,
      files: [],
      setLinkForAllBanners: false,
      openImageModal: false,
    };
    this.changeFileProgressState = this.changeFileProgressState.bind(this);
  }

  /**
   * @func
   * @desc handle change of file uploading progress
   * @param {number} id
   * @param {UploadState} state
   */
  private changeFileProgressState(id: number, state: UploadState): void {
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
  private checkImageSize(file): Promise<boolean> {
    return new Promise((res, rej) => {
      const img = document.createElement("img");
      img.onload = function () {
        const hasThisBannerSize = BannerSize.findIndex((b) => {
          return (b.height === img.height && b.width === img.width);
        });
        if (hasThisBannerSize >= 0) {
          res(true);
        } else {
          rej();
        }
        img.remove();
      };
      img.src = window.URL.createObjectURL(file);
    });
  }

  /**
   * @func removeFile
   * @desc remove file from state.files array
   * @param {number} id
   */
  private removeFile(id: number): void {
    let files: IFileItem[] = this.state.files;
    const indexOfFile = files.findIndex((f) => (f.id === id));
    files.splice(indexOfFile, 1);
    this.setState({
      files,
    });
  }

  /**
   * @func uploadFile
   * @desc check file size and upload file by upload service
   * @param file
   * @returns {boolean}
   */
  private uploadFile(file) {
    const id = Date.now();
    const uploader = new UploadService(UPLOAD_MODULES.BANNER, file);
    this.checkImageSize(file)
      .then(() => {
        this.setState({
          files: [...this.state.files,
            {
              id,
              fileObject: file,
              name: file.name,
            }
          ]
        }, () => {

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
      })
      .catch(() => {
        notification.error({
          message: this.i18n._t("File Size").toString(),
          description: this.i18n._t("This file size isn't acceptable!").toString(),
        });
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
    console.log("back");
  }
  private handleSubmit() {
    console.log("S");
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
                <Row type="flex" align="middle">
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
                {!this.state.setLinkForAllBanners &&
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
                          icon={"setting"}
                          className="add-utm-btn"
                          onClick={() => {
                            this.openUtmModal();
                          }}><Translate value="set utm parameters"/></Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                }
                <Row type={"flex"}>
                <Col span={24}>
                  <Row type="flex" gutter={30}>
                    {this.state.files.map((file, index) => (
                      <Col key={file.id} span={12}>
                        <Card className="upload-process-wrapper">
                          <div className="image-wrapper">
                            <div className="image-overlay" onClick={() => this.openImageModal(file)}>
                              <Icon style={{fontSize: "18px"}} type={"eye-o"}/>
                            </div>
                            <Image file={file.fileObject} alt={file.fileObject.name}
                                   type={"img"}
                            />
                          </div>
                          <div className="upload-process-content">
                            <p>{file.name}</p>
                            <small>
                              <Translate value="File size:"/>
                              {FileSizeConvertor(file.fileObject.size)}
                            </small>
                          </div>
                          <div className="upload-option">
                            <Progress type="circle" percent={file.state ? file.state.progress : 1} width={35}/>
                            {this.state.setLinkForAllBanners &&
                            <Button onClick={() => {
                              this.openUtmModal(file);
                            }}><Translate value="edit"/></Button>
                            }
                            <Button onClick={() => {
                              this.removeFile(file.id);
                            }}
                                    icon="close"
                                    className="btn-cancel"
                            />
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <Dragger
                    beforeUpload={this.uploadFile.bind(this)}
                  >
                    <h2>Drag Here</h2>
                    <RaisedButton
                      label={<Translate value="Select and Uplaod"/>}
                      primary={false}
                      className="btn-dragger"
                    />
                  </Dragger>
                </Col>
                </Row>
                <Row type="flex" align="middle">
                  <RaisedButton
                    onClick={this.handleBack.bind(this)}
                    label={<Translate value="Back"/>}
                    primary={false}
                    className="button-back-step"
                    disableTouchRipple={true}
                  />
                  <RaisedButton
                    onClick={this.handleSubmit.bind(this)}
                    label={<Translate value="Next Step"/>}
                    primary={true}
                    className="button-next-step"
                  />
                </Row>
              </Form>
            </Row>
          </Col>
          <Col span={7}>
            <Row type="flex" className="column-info-rtl">
              <h6><Translate value={"You should know:"}/></h6>
              <ul>
                <li><Translate value={"Maximum file size: static banner 200KB / video 2MB"}/></li>
                <li><Translate value={"Supported formats"}/></li>
              </ul>
              <div className="banner-size-wrapper">
                {BannerSize.map((size, index) => {
                  return (
                    <span className={"banner-size-tag active"}
                          key={index}>
                        {`${size.width}x${size.height}`}
                  </span>
                  );
                })}
              </div>
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
          <Image file={this.state.previewImage.fileObject}
                 type={"img"}
          />
        </Modal>
        }
      </div>
    );
  }
}

export default Form.create()(withRouter(UploadComponent as any));
