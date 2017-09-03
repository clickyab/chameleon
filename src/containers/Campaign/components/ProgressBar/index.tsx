/**
 * @file Progress bar for create/edit campaign
 * @author Ehsan Hosseini
 *
 * @desc Render progress bar and handle change steps and routes. This component is sensitive about `selectedCampaignId`
 * from store and append selected campaign id, if client was in edit mode.
 */

import * as React from "react";
import {Step, StepButton, Stepper } from "material-ui/Stepper";
import StepProps = __MaterialUI.Stepper.StepProps;
import {Row, Steps} from "antd";
import STEPS from "../../steps";
import Translate from "../../../../components/i18n/Translate/index";
import {RootState} from "../../../../redux/reducers/index";
import {setCurrentStep, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {connect} from "react-redux";
import {withRouter} from "react-router";

import "./style.less";

/**
 * @interface
 * @desc define component props
 */
interface IOwnProps {
  match?: any;
  history?: any;
}

/**
 * @interface
 * @desc define component and redux acceptability props
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
 * @interface
 * @desc define component state
 */
interface IState {
  stepIndex: STEPS;
}


@connect(mapStateToProps, mapDispatchToProps)
class ProgressBar extends React.Component<IProps, IState> {

  /**
   * @constructor
   * @desc set initial state
   * @param {IProps} props
   */
  constructor(props: IProps) {
    super(props);

    this.state = {
      stepIndex: STEPS.TYPE
    };
  }

  /**
   * @func
   * @desc check if route has id, set that in the store
   */
  public componentWillMount() {
    if (this.props.match.params.id) {
      this.props.setSelectedCampaignId(this.props.match.params.id);
    }
  }
  private checkStateClass(step: STEPS , type: STEPS) {
    if (step === type) {
        return "active-step";
      }
    if (step > type) {
      return "complete-step" ;
      }
  }
  /**
   * @desc Handle click on wizard's steps and set current step in the store
   * @func
   * @param {STEPS} step
   * @returns {any}
   */
  private onClickStepHandler(step: STEPS) {
    this.setState({
      stepIndex: step,
    });

    this.props.setCurrentStep(step);

    // generate suffix of routes based on selectedCampaignId
    const suffix = !!this.props.selectedCampaignId ? `/${this.props.selectedCampaignId}` : "";

    switch (step) {
      case STEPS.TYPE:
        return this.props.history.push(`${this.props.match.path}/type${suffix}`);
      case STEPS.NAMING:
        return this.props.history.push(`${this.props.match.path}/naming${suffix}`);
      case STEPS.BUDGET:
        return this.props.history.push(`${this.props.match.path}/budget${suffix}`);
      case STEPS.TARGETING:
        return this.props.history.push(`${this.props.match.path}/targeting${suffix}`);
      case STEPS.SELECT_PUBLISHER:
        return this.props.history.push(`${this.props.match.path}/select-publisher${suffix}`);
      case STEPS.UPLOAD:
        return this.props.history.push(`${this.props.match.path}/upload${suffix}`);
      case STEPS.CHECK_PUBLISH:
        return this.props.history.push(`${this.props.match.path}/check-publish${suffix}`);
    }
  }
    public render() {
    const {stepIndex} = this.state;
    return (
      <Row className="progress-bar">
        <Stepper linear={false}>
          <Step className={this.checkStateClass(stepIndex,STEPS.TYPE)}  active={stepIndex === STEPS.TYPE} completed={stepIndex > STEPS.TYPE}>
            <StepButton disableTouchRipple={true} onClick={() => this.onClickStepHandler(STEPS.TYPE)}>
              <Translate value="Campaign Type"/>
            </StepButton>
          </Step>
          <Step className={this.checkStateClass(stepIndex,STEPS.NAMING)}   active={stepIndex === STEPS.NAMING} completed={stepIndex > STEPS.NAMING}>
            <StepButton disableTouchRipple={true}  onClick={() => this.onClickStepHandler(STEPS.NAMING)}>
              <Translate value="Campaign Name"/>
            </StepButton>
          </Step>
          <Step className={this.checkStateClass(stepIndex,STEPS.BUDGET)}  active={stepIndex === STEPS.BUDGET} completed={stepIndex > STEPS.BUDGET}>
            <StepButton disableTouchRipple={true} onClick={() => this.onClickStepHandler(STEPS.BUDGET)}>
              <Translate value="Budget and Finance"/>
            </StepButton>
          </Step>
          <Step className={this.checkStateClass(stepIndex,STEPS.TARGETING)}  active={stepIndex === STEPS.TARGETING} completed={stepIndex > STEPS.TARGETING}>
            <StepButton disableTouchRipple={true} onClick={() => this.onClickStepHandler(STEPS.TARGETING)}>
              <Translate value="Targeting"/>
            </StepButton>
          </Step>
          <Step className={this.checkStateClass(stepIndex,STEPS.SELECT_PUBLISHER)}  active={stepIndex === STEPS.SELECT_PUBLISHER} completed={stepIndex > STEPS.SELECT_PUBLISHER}>
            <StepButton disableTouchRipple={true} onClick={() => this.onClickStepHandler(STEPS.SELECT_PUBLISHER)}>
              <Translate value="Select Publisher"/>
            </StepButton>
          </Step>
          <Step className={this.checkStateClass(stepIndex,STEPS.UPLOAD)}  active={stepIndex === STEPS.UPLOAD} completed={stepIndex > STEPS.UPLOAD}>
            <StepButton disableTouchRipple={true} onClick={() => this.onClickStepHandler(STEPS.UPLOAD)}>
              <Translate value="Upload Banner"/>
            </StepButton>
          </Step>
          <Step className={this.checkStateClass(stepIndex,STEPS.CHECK_PUBLISH)}  active={stepIndex === STEPS.CHECK_PUBLISH}>
            <StepButton disableTouchRipple={true} onClick={() => this.onClickStepHandler(STEPS.CHECK_PUBLISH)}>
              <Translate value="Check and Publish"/>
            </StepButton>
          </Step>
        </Stepper>
      </Row>
    );
  }
}


/**
 * @desc map store's props and component's props to component's props
 * @func
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
 * @desc map Redux's actions to component's props
 * @func
 * @param {RootState} state
 * @param {IOwnProps} ownProps
 * @returns {{currentStep: STEPS; selectedCampaignId: number; match: any; history: any}}
 */
function mapDispatchToProps(dispatch) {
  return {
    setCurrentStep: (step: STEPS) => dispatch(setCurrentStep(step)),
    setSelectedCampaignId: (id: number | null) => dispatch(setSelectedCampaignId(id)),
  };
}

// export component and use withRouter to access route properties
export default withRouter<IOwnProps>(ProgressBar as any);
