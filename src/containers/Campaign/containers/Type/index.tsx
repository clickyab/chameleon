/**
 * @file Select Type on ad in create/edit campaign
 * @author Ehsan Hosseini
 */
import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {setCurrentStep, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {RootState} from "../../../../redux/reducers/index";
import STEPS from "../../steps";
import {Row, Col} from "antd";
import SelectBox, {ISelectBoxItem} from "../Naming/Components/SelectBox/index";
import I18n from "../../../../services/i18n/index";
import Icon from "../../../../components/Icon/index";
import {RaisedButton} from "material-ui";
import Translate from "../../../../components/i18n/Translate/index";
import CONFIG from "../../../../constants/config" ;

import "./style.less";

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
  setCurrentStep: (step: STEPS) => {};
  setSelectedCampaignId: (id: number | null) => {};
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
  internalStep: INTERNAL_STEPS;
  selectedDevice?: DEVICE_TYPES;
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
enum DEVICE_TYPES {
  WEB,
  APPLICATION,
}

/**
 * @enum WEB_TYPES
 * @desc Web Types
 */
enum WEB_TYPES {
  BANNER,
  CONTENT,
  VIDEO,
}


/**
 * @enum APPLICATION_TYPES
 * @desc Application Types
 */
enum APPLICATION_TYPES {
  BANNER,
}

@connect(mapStateToProps, mapDispatchToProps)
class TypeComponent extends React.Component <IProps, IState> {
  /**
   * i18n instance
   * @type {I18n}
   */
  i18n = I18n.getInstance();

  /**
   * Device ad types items
   * @type {[{title: string; description: string; value: DEVICE_TYPES; icon: any} , {title: string; description: string; value: DEVICE_TYPES; icon: any}]}
   */
  deviceTypes: ISelectBoxItem[] = [
    {
      title: this.i18n._t("Web").toString(),
      description: this.i18n._t("Show Advertising in Desktop, Mobile and tablet browsers.").toString(),
      value: DEVICE_TYPES.WEB,
      icon: <Icon name="x"/>
    },
    {
      title: this.i18n._t("Application").toString(),
      description: this.i18n._t("Show Advertising in Android Mobile and tablet application.").toString(),
      value: DEVICE_TYPES.APPLICATION,
      icon: <Icon name="x"/>
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
      icon: <Icon name="x"/>
    },
    {
      title: this.i18n._t("Content").toString(),
      value: WEB_TYPES.CONTENT,
      icon: <Icon name="x"/>
    },
    {
      title: this.i18n._t("Video").toString(),
      value: WEB_TYPES.VIDEO,
      icon: <Icon name="x"/>
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
      icon: <Icon name="x"/>
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
      selectedDevice: DEVICE_TYPES.WEB,
    };
  }

  /**
   * check for edit mode by `id` and set selected campaign in Redux store
   */
  public componentWillMount() {
    if (this.props.match.params.id) {
      this.props.setSelectedCampaignId(this.props.match.params.id);
    } else {
      this.props.setSelectedCampaignId(null);
    }
  }

  /**
   * @func handle change device type of ad
   * @param {DEVICE_TYPES} value
   */
  private handleChangeDevicesType(value: DEVICE_TYPES) {
    this.setState({
      selectedDevice: value,
    });
  }

  /**
   * @func handle submit device type selection and render select desktop or application ad type
   */
  private handleSelectDeviceType() {
    const step: INTERNAL_STEPS = (this.state.selectedDevice === DEVICE_TYPES.WEB) ?
      INTERNAL_STEPS.SELECT_DESKTOP_TYPE : INTERNAL_STEPS.SELECT_APPLICATION_TYPE;
    this.setState({
      internalStep: step,
    });
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
   * @func handle change web type of ad
   * @param {WEB_TYPES} value
   */
  private handleChangeWebType(value: WEB_TYPES) {
    this.setState({
      selectedWebType: value,
    });
  }

  /**
   * @func handle change application type of ad
   * @param {APPLICATION_TYPES} value
   */
  private handleChangeApplicationType(value: APPLICATION_TYPES) {
    this.setState({
      selectedApplicationType: value,
    });
  }

  private handleSelectWebType() {
    const step: INTERNAL_STEPS = (this.state.selectedDevice === DEVICE_TYPES.WEB) ?
      INTERNAL_STEPS.SELECT_DESKTOP_TYPE : INTERNAL_STEPS.SELECT_APPLICATION_TYPE;
    // this.setState({
    //   internalStep: step,
    //   selectedWebType: null,
    // });
  }

  public render() {
    return (
      <div dir={CONFIG.DIR} className="campaign-content">
        <Row>
          <h3 className="text-center">Select Campaign Type</h3>
          <p className="text-center">Set configuration for show advertise in Desktop or Mobile</p>
        </Row>
        <hr/>
        {this.state.internalStep === INTERNAL_STEPS.SELECT_DEVICE_TYPE &&
        <Row className="campaign-device">
          {JSON.stringify(this.state)}
          <SelectBox span={8} items={this.deviceTypes} initialSelect={this.state.selectedDevice}
                     onChange={this.handleChangeDevicesType.bind(this)}/>
          <RaisedButton
            onClick={this.handleSelectDeviceType.bind(this)}
            label={<Translate value="Next Step"/>}
            primary={true}
            className="button-next-step"
            icon={<Icon name="arrow" color="white"/>}
          />
        </Row>
        }
        {this.state.internalStep === INTERNAL_STEPS.SELECT_DESKTOP_TYPE &&
        <Row className="campaign-type">
          <SelectBox items={this.desktopTypes} initialSelect={this.state.selectedWebType}
                     onChange={this.handleChangeWebType.bind(this)}/>
          <RaisedButton
            onClick={this.handleChangeWebType.bind(this)}
            label={<Translate value="Next Step"/>}
            primary={true}
            className="button-next-step"
            icon={<Icon name="arrow" color="white"/>}
          />
        </Row>
        }
        {this.state.internalStep === INTERNAL_STEPS.SELECT_APPLICATION_TYPE &&
        <Row className="campaign-type">
          <SelectBox items={this.applicationTypes}
                     initialSelect={this.state.selectedApplicationType}
                     onChange={this.handleChangeApplicationType.bind(this)}/>
          <RaisedButton
            onClick={this.handleChangeWebType.bind(this)}
            label={<Translate value="Next Step"/>}
            primary={true}
            className="button-next-step"
            icon={<Icon name="arrow" color="white"/>}
          />
        </Row>
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
  };
}

/**
 * Wrap component by `withRouter` height order function
 */
export default withRouter<IOwnProps>(TypeComponent as any);
