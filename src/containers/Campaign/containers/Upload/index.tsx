/**
 * @file Upload banner step
 */
import * as React from "react";
import Image from "react-image-file";

import BannerSize from "./CONSTsize";
import {Upload, Row, Col, notification, Card, Progress, Button} from "antd";
import Translate from "../../../../components/i18n/Translate/index";
import CONFIG from "../../../../constants/config";
import {default as UploadService, UPLOAD_MODULES, UploadState} from "../../../../services/Upload/index";
import I18n from "../../../../services/i18n/index";
import FileSizeConvertor from "../../../../services/Utils/FileSizeConvertor";
import {RadioButton, RadioButtonGroup, TextField} from "material-ui";
import UtmModal from "./UtmModal";

const Dragger = Upload.Dragger;

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
  editFile?: IFileItem;
  globalUtm ?: string;
}

export default class UploadComponent extends React.Component <IProps, IState> {
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
        <h2><Translate value="Select Publishers"/></h2>
        <p><Translate value="Select Publishers description"/></p>
        <Row type="flex">
          <Col span={19}>
            <Row>
              <Row type="flex">
                <Col span={5}>
                  <label><Translate value="Link settings"/></label>
                </Col>
                <Col span={19}>
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
                </Col>
              </Row>
              {!this.state.setLinkForAllBanners &&
              <Row type="flex">
                <Col span={5}>
                  <label><Translate value="URL"/></label>
                </Col>
                <Col span={19}>
                  <Row>
                    <Col>
                      <TextField
                        value={this.state.globalUtm}
                        onChange={(e, value) => {
                          this.setState({
                            globalUtm: value,
                          });
                        }}
                        hintText={"https://example.com/search/?utm_source=...."}
                      />
                    </Col>
                    <Col>
                      <Button onClick={() => {
                        this.openUtmModal();
                      }}><Translate value="set utm parameters"/></Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              }
              <Col span={24}>
                <Row type="flex" gutter={5}>
                  {this.state.files.map((file, index) => (
                    <Col key={file.id} span={12}>
                      <Card>
                        <Image file={file.fileObject} alt={file.fileObject.name}
                               height={100}/>
                        <p>{file.name}</p>
                        <small>
                          <Translate value="File size:"/>
                          {FileSizeConvertor(file.fileObject.size)}
                        </small>
                        <Progress type="circle" percent={file.state ? file.state.progress : 1} width={40}/>
                        {this.state.setLinkForAllBanners &&
                        <Button onClick={() => {
                          this.openUtmModal(file);
                        }}><Translate value="edit"/></Button>
                        }
                        <Button onClick={() => {
                          this.removeFile(file.id);
                        }}>X</Button>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Dragger
                  beforeUpload={this.uploadFile.bind(this)}
                >
                  <h2>Drag Here</h2>
                </Dragger>
              </Col>
            </Row>
          </Col>
          <Col span={5}>
            <Row type="flex">
              {BannerSize.map((size, index) => {
                return (
                  <span key={index}
                        style={{
                          padding: 2,
                          margin: "2px 3px",
                          backgroundColor: "#fff",
                          color: "#999",
                          boxShadow: "0 0 0 1px #d9d9d9 inset"
                        }}>
                        {`${size.width}x${size.height}`}
                  </span>
                );
              })}
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
      </div>
    );
  }
}
