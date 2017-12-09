/**
 * @file Select Type on ad in create/edit campaign
 * @author Ehsan Hosseini
 */
import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {setCurrentCampaign, setCurrentStep, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {RootState} from "../../../../redux/reducers/index";
import STEPS from "../../steps";
import {Row, Col, Spin} from "antd";
import SelectBox, {ISelectBoxItem} from "../Naming/Components/SelectBox/index";
import I18n from "../../../../services/i18n/index";
import Icon from "../../../../components/Icon/index";
import {RaisedButton} from "material-ui";
import Translate from "../../../../components/i18n/Translate/index";
import CONFIG from "../../../../constants/config" ;


import "./style.less";
import {ControllersApi, OrmCampaign} from "../../../../api/api";
import {isUndefined} from "util";
import {Link} from "react-router-dom";
import {setBreadcrumb} from "../../../../redux/app/actions/index";

/**
 * @interface IOwnProps
 * @desc Define Component's Props
 */
interface IOwnProps {
  match?: any;
  history?: any;
}

/**
 * @interface IProps
 * @desc Define Component, store and action's Props
 */
interface IProps {
  setBreadcrumb: (name: string, title: string, parent: string) => void;
  currentCampaign: OrmCampaign;
  setCurrentStep: (step: STEPS) => {};
  setSelectedCampaignId: (id: number | null) => void;
  setCurrentCampaign: (campaign: OrmCampaign) => void;
  currentStep: STEPS;
  selectedCampaignId: number | null;
  match: any;
  history: any;
}

/**
 * @interface IState
 * @desc Define component's States
 */
interface IState {
  currentCampaign?: OrmCampaign;
  internalStep: INTERNAL_STEPS;
  selectedType?: DEVICE_TYPES;
  selectedWebType?: WEB_TYPES;
  selectedApplicationType?: APPLICATION_TYPES;
}

/**
 * @enum INTERNAL_STEPS
 * @desc Internal steps of the component
 */
enum INTERNAL_STEPS {
  SELECT_DEVICE_TYPE,
  SELECT_DESKTOP_TYPE,
  SELECT_APPLICATION_TYPE,
}

/**
 * @enum DEVICE_TYPES
 * @desc Device Types
 */
export enum DEVICE_TYPES {
  WEB = "web",
  APPLICATION = "app",
}

/**
 * @enum WEB_TYPES
 * @desc Web Types
 */
export enum WEB_TYPES {
  BANNER = "banner",
  CONTENT = "native",
  VIDEO = "vast",
}


/**
 * @enum APPLICATION_TYPES
 * @desc Application Types
 */
enum APPLICATION_TYPES {
  BANNER = "banner",
}

@connect(mapStateToProps, mapDispatchToProps)
class TypeComponent extends React.Component <IProps, IState> {
  /**
   * i18n instance
   * @type {I18n}
   */
  i18n = I18n.getInstance();

  disable: boolean = false;
  /**
   * Device ad types items
   * @type {[{title: string; description: string; value: DEVICE_TYPES; icon: any} , {title: string; description: string; value: DEVICE_TYPES; icon: any}]}
   */
  deviceTypes: ISelectBoxItem[] = [
    {
      title: this.i18n._t("Web").toString(),
      description: this.i18n._t("Show Advertising in Desktop, Mobile and tablet browsers.").toString(),
      value: DEVICE_TYPES.WEB,
      icon: <Icon name="cif-browser-campaign-outline" className={"campaign-icon"}/>,
      hintText: <Link to={"#"}><Translate value={"Dont know what it is? click here"}/></Link>
    },
    {
      title: this.i18n._t("Application").toString(),
      description: this.i18n._t("Show Advertising in Android Mobile and tablet application.").toString(),
      value: DEVICE_TYPES.APPLICATION,
      icon: <Icon name="cif-mobile-campaign-outline" className={"campaign-icon"}/>,
      hintText: <Link to={"#"}><Translate value={"Dont know what it is? click here"}/></Link>
    }
  ];

  /**
   * Desktop ad types items
   * @type {[{title: string; value: WEB_TYPES; icon: any} , {title: string; value: WEB_TYPES; icon: any} , {title: string; value: WEB_TYPES; icon: any}]}
   */
  desktopTypes: ISelectBoxItem[] = [
    {
      title: this.i18n._t("Banner").toString(),
      value: WEB_TYPES.BANNER,
      icon: <Icon name="cif-banner-campaign-outline" className={"campaign-icon"}/>,
      hintText: <Link to={"#"}><Translate value={"Dont know what it is? click here"}/></Link>
    },
    {
      title: this.i18n._t("Content").toString(),
      value: WEB_TYPES.CONTENT,
      icon: <Icon name="cif-native-campaign-outline" className={"campaign-icon"}/>,
      hintText: <Link to={"#"}><Translate value={"Dont know what it is? click here"}/></Link>
    },
    {
      title: this.i18n._t("Video").toString(),
      value: WEB_TYPES.VIDEO,
      icon: <Icon name="cif-video-campaign-outline" className={"campaign-icon"}/>,
      hintText: <Link to={"#"}><Translate value={"Dont know what it is? click here"}/></Link>
    }
  ];

  /**
   * Application types items
   * @type {[{title: string; value: APPLICATION_TYPES; icon: any}]}
   */
  applicationTypes: ISelectBoxItem[] = [
    {
      title: this.i18n._t("Banner").toString(),
      value: APPLICATION_TYPES.BANNER,
      icon: <Icon name="cif-banner-campaign-outline" className={"campaign-icon"}/>,
      hintText: <Link to={"#"}><Translate value={"Dont know what it is? click here"}/></Link>
    }
  ];


  /**
   * @constructor
   * @desc set initial step and selected device
   * @param {IProps} props
   */
  constructor(props: IProps) {
    super(props);

    this.state = {
      internalStep: INTERNAL_STEPS.SELECT_DEVICE_TYPE,
      selectedType: props.currentCampaign ? props.currentCampaign.kind as DEVICE_TYPES : null,
      selectedApplicationType: props.currentCampaign ? props.currentCampaign.type as APPLICATION_TYPES : null,
      selectedWebType: props.currentCampaign ? props.currentCampaign.type as WEB_TYPES : null,
      currentCampaign: props.currentCampaign && props.currentCampaign.id === this.props.match.params.id ? props.currentCampaign : null,
    };
  }

  /**
   * check for edit mode by `id` and set selected campaign in Redux store
   */
  public componentDidMount() {
    this.props.setCurrentStep(STEPS.TYPE);
    this.props.setBreadcrumb("type", this.i18n._t("Type").toString(), "campaign");
    if (this.props.match.params.id) {
      this.disable = true;
      this.props.setSelectedCampaignId(this.props.match.params.id);
      const controllerApi = new ControllersApi();
      controllerApi.campaignIdGet({id: this.props.match.params.id})
        .then(campaign => {
          this.props.setBreadcrumb("campaignTitle", campaign.title, "type");
          this.setState({
            currentCampaign: campaign,
            selectedType: campaign ? campaign.kind as DEVICE_TYPES : null,
            selectedApplicationType: campaign ? campaign.type as APPLICATION_TYPES : null,
            selectedWebType: campaign ? campaign.type as WEB_TYPES : null,
          });
        });
    } else {
      this.props.setCurrentCampaign(null);
      this.props.setSelectedCampaignId(null);
    }
  }


  /**
   * @func set select device type step as internal step
   */
  private handleBack() {
    this.setState({
      internalStep: INTERNAL_STEPS.SELECT_DEVICE_TYPE,
    });
  }


  /**
   * @func handle change device type of ad
   * @param {DEVICE_TYPES} value
   */
  private handleChangeDevicesType(value: DEVICE_TYPES) {
    if (!this.disable) {
      this.setState({
        selectedType: value,
      });
    }
  }

  /**
   * @func handle submit device type selection and render select desktop or application ad type
   */
  private handleSelectDeviceType() {
    const step: INTERNAL_STEPS = (this.state.selectedType === DEVICE_TYPES.WEB) ?
      INTERNAL_STEPS.SELECT_DESKTOP_TYPE : INTERNAL_STEPS.SELECT_APPLICATION_TYPE;
    this.setState({
      internalStep: step,
    });
  }


  /**
   * @func handle change web type of ad
   * @param {WEB_TYPES} value
   */
  private handleChangeWebType(value: WEB_TYPES) {
    if (!this.disable) {
      this.setState({
        selectedWebType: value,
      });
    }
  }


  private handleSelectWebType() {
    this.submit();
  }

  /**
   * @func handle change application type of ad
   * @param {APPLICATION_TYPES} value
   */
  private handleChangeApplicationType(value: APPLICATION_TYPES) {
    if (!this.disable) {
      this.setState({
        selectedApplicationType: value,
      });
    }
  }


  private handleSelectApplicationType() {
    this.submit();
  }

  private submit() {
    let campaign: OrmCampaign = {};
    campaign.kind = this.state.selectedType;
    campaign.type = this.state.selectedType === DEVICE_TYPES.APPLICATION ? this.state.selectedApplicationType : this.state.selectedWebType;

    if (isUndefined(campaign.status)) {
      const date = new Date();
      campaign.status = true;
      campaign.start_at = date.toDateString();
    }

    this.props.setCurrentCampaign(campaign);
    this.props.history.push("/campaign/naming");
    this.props.setCurrentStep(STEPS.NAMING);
  }

  public render() {

    if (this.props.match.params.id && !this.state.currentCampaign) {
      return <Spin/>;
    }

    return (
      <div dir={CONFIG.DIR} className="campaign-content">
        <Row className="campaign-title">
          <h3 className="text-center"><Translate value={"Select Campaign Type"}/></h3>
          <p className="text-center"><Translate value={"Set configuration for show advertise in Desktop or Mobile"}/>
          </p>
        </Row>
        {this.state.internalStep === INTERNAL_STEPS.SELECT_DEVICE_TYPE &&
        <Row className="campaign-device">
          <SelectBox span={8} items={this.deviceTypes} initialSelect={this.state.selectedType}
                     onChange={this.handleChangeDevicesType.bind(this)}
                     disable={this.disable}
                     className={`center-select-box device-type ${this.disable ? "select-box-disable" : ""}`}/>
          <RaisedButton
            onClick={this.handleSelectDeviceType.bind(this)}
            label={<Translate value="Next Step"/>}
            primary={true}
            disabled={!this.state.selectedType}
            className="button-next-step type-btn"
            icon={<Icon name="cif-arrow-left" className={"arrow-next-step"}/>}
          />
        </Row>
        }
        {this.state.internalStep === INTERNAL_STEPS.SELECT_DESKTOP_TYPE &&
        <div>
          <Row className="campaign-type">
            <SelectBox items={this.desktopTypes} initialSelect={this.state.selectedWebType}
                       className={`center-select-box desktop-type ${this.disable ? "select-box-disable" : ""}`}
                       disable={this.disable}
                       onChange={this.handleChangeWebType.bind(this)}/>
          </Row>
          <Row type="flex" justify="center">
            <RaisedButton
              onClick={this.handleSelectWebType.bind(this)}
              label={<Translate value="Next Step"/>}
              primary={true}
              disabled={!this.state.selectedWebType}
              className="button-next-step type-btn"
              icon={<Icon name="cif-arrow-left" className={"arrow-next-step"}/>}
            />
          </Row>
          <Row type="flex" justify="center">
           <span className="campain-back-link"
                 onClick={this.handleBack.bind(this)}>
            <Translate value={"Choose wrong campaign type?"}/>
          </span>
          </Row>
        </div>
        }
        {this.state.internalStep === INTERNAL_STEPS.SELECT_APPLICATION_TYPE &&
        <div>
          <Row className="campaign-type">
            <SelectBox items={this.applicationTypes}
                       initialSelect={this.state.selectedApplicationType}
                       disable={this.disable}
                       className={`center-select-box app-type  ${this.disable ? "select-box-disable" : ""}`}
                       onChange={this.handleChangeApplicationType.bind(this)}/>
          </Row>
          <Row type="flex" justify="center">
            <RaisedButton
              onClick={this.handleSelectApplicationType.bind(this)}
              label={<Translate value="Next Step"/>}
              primary={true}
              disabled={!this.state.selectedApplicationType}
              className="button-next-step type-btn"
              icon={<Icon name="cif-arrow-left" className={"arrow-next-step"}/>}
            />
          </Row>
          <Row type="flex" justify="center">
            <span className="campain-back-link"
                  onClick={this.handleBack.bind(this)}>
            <Translate value={"Choosed wrong campaign type?"}/>
          </span>
          </Row>
        </div>
        }
      </div>
    );
  }
}

/**
 * @func map Redux store state as component's props
 * @param {RootState} state
 * @param {IOwnProps} ownProps
 * @returns {{currentStep: STEPS; selectedCampaignId: number; match: any; history: any}}
 */
function mapStateToProps(state: RootState, ownProps: IOwnProps) {
  return {
    currentStep: state.campaign.currentStep,
    currentCampaign: state.campaign.currentCampaign,
    selectedCampaignId: state.campaign.selectedCampaignId,
    match: ownProps.match,
    history: ownProps.history,
  };
}

/**
 * @func map Redux action as component's
 * @param dispatch
 * @returns {{setCurrentStep: ((step: STEPS) => any); setSelectedCampaignId: ((id: number) => any)}}
 */
function mapDispatchToProps(dispatch) {
  return {
    setCurrentStep: (step: STEPS) => dispatch(setCurrentStep(step)),
    setSelectedCampaignId: (id: number | null) => dispatch(setSelectedCampaignId(id)),
    setCurrentCampaign: (campaign: OrmCampaign) => dispatch(setCurrentCampaign(campaign)),
    setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
  };
}

/**
 * Wrap component by `withRouter` height order function
 */
export default withRouter<IOwnProps>(TypeComponent as any);
