/**
 * @file UTM Modal
 * @desc A modal for editing utm and file upload config
 */

import * as React from "react";
import Modal from "../../../../components/Modal/index";
import {Form, Row, Col, notification, Switch} from "antd";
import {RaisedButton, TextField} from "material-ui";
import I18n from "../../../../services/i18n/index";
import CONFIG from "../../../../constants/config";
import Translate from "../../../../components/i18n/Translate/index";
import Image from "react-image-file";
import {IFileItem} from "./index";
import "./style.less";

const FormItem = Form.Item;

/**
 * @interface ISubmitParams
 * @desc define exported object on submit modal's form
 */
interface ISubmitParams {
  link: string;
  name: string;
}

/**
 * @interface IProps
 * @desc define component input parameters
 */
interface IProps {
  form?: any;
  onSubmit: (params: ISubmitParams) => void;
  onClose: () => void;
  link?: string;
  file?: IFileItem;
}

/**
 * @interface IState
 * @desc define state params
 */
interface IState {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  file?: IFileItem;
  url: string;
  utm_setting: boolean;
}

class UtmModal extends React.Component<IProps, IState> {
  private i18n = I18n.getInstance();

  /**
   * @constructor
   * @desc set initial state
   * @param {IProps} props
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      url: "",
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_content: "",
      utm_setting: false,
    };
  }

  /**
   * @func
   * @desc set params and file from props
   */
  public componentDidMount() {
    if (this.props.link) {
      this.setParamsValues(this.props.link);
    }
    if (this.props.file) {
      this.setState({
        file: this.props.file,
      });
    }
  }

  /**
   * @func
   * @desc update state by new props
   * @param {IProps} props
   */
  public componentWillReceiveProps(props: IProps) {
    if (props.link) {
      this.setParamsValues(props.link);
    }
    if (props.file) {
      this.setState({
        file: props.file,
      });
    }
  }

  /**
   * @file getQuery
   * @desc extract params from url (query string)
   * @param link
   * @param parameter
   * @returns {any}
   */
  private getQuery(link, parameter) {
    const query = link.split("?")[1];
    if (!query) return "";

    const params = query.split("&");
    let value = "";
    params.forEach((p) => {
      const keyValue = p.split("=");
      if (keyValue[0] === parameter) value = keyValue[1];
    });
    return value;
  }

  /**
   * @file setParamsValues
   * @desc try to extract utm params from link and set state
   * @param value
   */
  private setParamsValues(value) {
    value = value.toLowerCase();
    const url = value;
    const utm_source = this.getQuery(value, "utm_source");
    const utm_medium = this.getQuery(value, "utm_medium");
    const utm_campaign = this.getQuery(value, "utm_campaign");
    const utm_content = this.getQuery(value, "utm_content");

    this.setState({
      url,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
    });
  }

  /**
   * @func handleSubmit
   * @desc handle form submit and call onSubmit function
   * @param e
   */
  private handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        notification.error({
          message: "Submit failed!",
          description: this.i18n._t("Please check all fields and try again!").toString(),
        });
        return;
      }

      if (this.props.onSubmit) {
        this.props.onSubmit(
          {
            name: values.name,
            link: this.state.url,
          }
        );
      }

    });
  }

  /**
   * @func onFormChange
   * @desc handle parameter change in form and update link
   * @param name
   * @param value
   */
  private onFormChange(name, value) {
    this.setState((prevState => {
      if (prevState.url.indexOf(`${name}=`) === -1) {
        if (prevState.url.indexOf("?") === -1) {
          prevState.url = prevState.url + `?${name}=${value}`;
        } else {
          prevState.url = prevState.url + `&${name}=${value}`;
        }
      } else {
        prevState.url = prevState.url.replace(`${name}=${prevState[name]}`, `${name}=${value}`);
      }
      prevState[name] = value;
      return prevState;
    }));
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Modal
        title={this.i18n._t("UTM Configuration")}
        visible={true}
        onOk={this.handleSubmit.bind(this)}
        onCancel={this.props.onClose}
        customClass="utm-img-modal">
        <Form onSubmit={this.handleSubmit.bind(this)} className="utm-form-img-wrapper">
          <div dir={CONFIG.DIR}>
            <Row type="flex">
              {this.props.file &&
              <Col span={10} className="utm-img-column">
                <Image file={this.props.file.fileObject} alt={this.props.file.fileObject.name}
                       type={"img"}
                />
              </Col>
              }
              <Col span={this.props.file ? 14 : 24} className="utm-form-column">
                {this.props.file &&
                <Row type="flex" align="middle"  gutter={16}>
                  <Col span={7}>
                    <label><Translate value="Name"/></label>
                  </Col>
                  <Col span={17}>
                    <FormItem>
                      {getFieldDecorator("name", {
                        initialValue: this.props.file.name,
                      })(
                        <TextField
                          className="utm-input"
                          fullWidth={true}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                }
                <Row type="flex" align="middle"  gutter={16}>
                  <Col span={7}>
                    <label><Translate value="url"/></label>
                  </Col>
                  <Col span={17}>
                    <FormItem>
                      <TextField
                        value={this.state.url}
                        onChange={(e, value) => {
                          this.setParamsValues(value);
                        }}
                        hintText={this.i18n._t("https://example.com/search/?utm_source=....")}
                        fullWidth={true}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle"  gutter={16} className="modal-switch-row">
                  <Col span={7}>
                    <label><Translate value={"UTM Setting"}/></label>
                  </Col>
                  <Col span={17}>
                    <FormItem>
                      <Switch className={CONFIG.DIR === "rtl" ? "switch-rtl" : "switch"}
                              onChange={(e) => (this.setState({utm_setting: !this.state.utm_setting}))}/>
                    </FormItem>
                  </Col>
                </Row>
                {this.state.utm_setting &&
                <div>
                  <Row type="flex" align="middle" gutter={16}>
                    <Col span={7}>
                      <label>utm_source</label>
                    </Col>
                    <Col span={17}>
                      <FormItem>
                        <TextField
                          value={this.state.utm_source}
                          onChange={(e, value) => {
                            this.onFormChange("utm_source", value);
                          }}
                          hintText={this.i18n._t("buffer")}
                          fullWidth={true}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row type="flex" align="middle"  gutter={16}>
                    <Col span={7}>
                      <label>utm_medium</label>
                    </Col>
                    <Col span={17}>
                      <FormItem>
                        <TextField
                          value={this.state.utm_medium}
                          onChange={(e, value) => {
                            this.onFormChange("utm_medium", value);
                          }}
                          hintText={this.i18n._t("post-original")}
                          fullWidth={true}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row type="flex" align="middle"  gutter={16}>
                    <Col span={7}>
                      <label>utm_campaign</label>
                    </Col>
                    <Col span={17}>
                      <FormItem>
                        <TextField
                          value={this.state.utm_campaign}
                          onChange={(e, value) => {
                            this.onFormChange("utm_campaign", value);
                          }}
                          hintText={this.i18n._t("36-social-media-strategies")}
                          fullWidth={true}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row type="flex" align="middle"  gutter={16}>
                    <Col span={7}>
                      <label>utm_content</label>
                    </Col>
                    <Col span={17}>
                      <FormItem>
                        <TextField
                          value={this.state.utm_content}
                          onChange={(e, value) => {
                            this.onFormChange("utm_content", value);
                          }}
                          hintText={this.i18n._t("image")}
                          fullWidth={true}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </div>
                }
                <Row type="flex" align="middle" className="modal-btn-row">
                  <RaisedButton
                    onClick={this.props.onClose}
                    label={<Translate value="Cancel"/>}
                    primary={false}
                    className="modal-cancel-btn"
                    disableTouchRipple={true}
                  />
                  <RaisedButton
                    onClick={this.handleSubmit.bind(this)}
                    label={<Translate value="Submit"/>}
                    primary={true}
                    className="modal-ok-btn"
                  />
                </Row>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>
    );
  }
}


export default Form.create<IProps>()(UtmModal as any);
