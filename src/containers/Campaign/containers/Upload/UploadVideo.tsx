/**
 * @file Upload Video step
 */
import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {Upload, Row, Col, notification, Button, Form, Spin} from "antd";
import Translate from "../../../../components/i18n/Translate/index";
import CONFIG from "../../../../constants/config";
import {UPLOAD_MODULES, UploadState, UPLOAD_STATUS} from "../../../../services/Upload/index";
import I18n from "../../../../services/i18n/index";
import "./style.less";
import {ControllersApi, OrmCampaign} from "../../../../api/api";
import STEPS from "../../steps";
import {RootState} from "../../../../redux/reducers/index";
import {setCurrentStep, setCurrentCampaign, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {DEVICE_TYPES} from "../Type";
import UTMDynamicForm, {InputInfo} from "./UtmDynamicForm";
import InputLimit from "../../components/InputLimit/InputLimit";
import {FILE_TYPE, MODULE, default as UploadFile} from "../../components/UploadFile";
import Currency from "../../../../components/Currency";
import CreativeGeneralInfo from "../../../../components/CreativeGeneralInfo";

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
}

@connect(mapStateToProps, mapDispatchToProps)
class UploadVideo extends React.Component <IProps, IState> {
  private i18n = I18n.getInstance();
  private FormObject: InputInfo[] = [
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
      type: "url",
      required: true,
    }
  ];
  private disableUpload: boolean = false;

  /**
   * @constructor
   * @desc Set initial state and binding
   * @param {IProps} props
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      currentCampaign: props.currentCampaign && props.currentCampaign.id === this.props.match.params.id ? props.currentCampaign : null,
    };
  }

  public componentDidMount() {
    this.setState({
      currentCampaign: this.props.currentCampaign,
    });
  }

  private handleBack() {
    this.props.setCurrentStep(STEPS.SELECT_PUBLISHER);
    this.props.history.push(`/campaign/select-publisher/${this.props.match.params.id}`);
  }

  private handleSubmit() {

    const controllerApi = new ControllersApi();
    // controllerApi.adBannerTypeIdPost({
    //     bannerType: UPLOAD_MODULES.VIDEO,
    //     id: this.state.currentCampaign.id.toString(),
    //     payloadData: {
    //         banners
    //     }
    // }).then(() => {
    //     this.loadVideo();
    //     this.props.history.push(`/campaign/check-publish/${this.props.match.params.id}`);
    // });

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
              <h2><Translate value="Media upload"/></h2>
          </div>
        <Row type="flex" gutter={16}>
          <Col span={24} className={"column-border-bottom upload-container"}>
            <Col span={8} offset={16}>
              <UploadFile label={"video poster(wide with 16:9 aspect ratio)"}
                          minDimension={{width: 640, height: 360}}
                          required={true}
                          fileType={[FILE_TYPE.VID_MP4, FILE_TYPE.IMG_GIF]}
                          uploadModule={MODULE.IMAGE}
              />
            </Col>
          </Col>
          <Col span={24} className={"column-border-bottom pb-3"}>
              <Col span={8} offset={16}>
                  <Col span={24}>
                      <div className="upload-setting">
                        <span className="upload-title-setting span-block">
                           <Translate value={"Ad general information"}/>
                        </span>
                      </div>
                  </Col>
                  <CreativeGeneralInfo form={this.props.form}/>
            </Col>
          </Col>
          <Col span={8}>
            <Row className="upload-setting">
               <span className="upload-title-setting span-block">
                 <Translate value={"URL and uploaded banners setting"}/>
               </span>
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
      </div>
    );
  }
}

interface IOwnProps {
  match?: any;
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


export default Form.create<IProps>()(withRouter(UploadVideo as any));
