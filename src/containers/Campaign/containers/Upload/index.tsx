/**
 * @file Upload banner step
 */
import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {Form} from "antd";
import I18n from "../../../../services/i18n/index";
import "./style.less";
import UplaodBannerVideo from "./BannerVideo";
import {ControllersApi, OrmCampaign} from "../../../../api/api";
import STEPS from "../../steps";
import {RootState} from "../../../../redux/reducers/index";
import {setCurrentStep, setCurrentCampaign, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {setBreadcrumb} from "../../../../redux/app/actions/index";


interface IProps {
  setBreadcrumb: (name: string, title: string, parent: string) => void;
  setCurrentCampaign: (campaign: OrmCampaign) => void;
  currentCampaign: OrmCampaign;
  setCurrentStep: (step: STEPS) => {};
  setSelectedCampaignId: (id: number | null) => {};
  currentStep: STEPS;
  selectedCampaignId: number | null;
  match: any;
  history: any;
}

/**
 * @interface IState
 * @desc define state object
 */
interface IState {
  currentCampaign: OrmCampaign;
}

@connect(mapStateToProps, mapDispatchToProps)
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
      currentCampaign: props.currentCampaign && props.currentCampaign.id === this.props.match.params.id ? props.currentCampaign : null,
    };
  }

  public componentDidMount() {
    this.props.setCurrentStep(STEPS.UPLOAD);
    this.props.setBreadcrumb("upload", this.i18n._t("Upload").toString(), "campaign");
    if (this.props.match.params.id) {
      this.props.setSelectedCampaignId(this.props.match.params.id);
      const api = new ControllersApi();
      api.campaignIdGet({id: this.props.match.params.id})
        .then((campaign) => {
          this.props.setBreadcrumb("campaignTitle", campaign.title, "upload");
          this.setState({
            currentCampaign: campaign,
          });
          this.props.setCurrentCampaign(campaign as OrmCampaign);
        });
    }
  }


  /**
   * @func render
   * @desc render component
   * @returns {any}
   */
  public render() {
    return (<div>
        {this.state.currentCampaign && (this.state.currentCampaign.kind === "web" || this.state.currentCampaign.kind === "video") &&
        <UplaodBannerVideo currentCampaign={this.state.currentCampaign}/>
        }
        {this.state.currentCampaign && (this.state.currentCampaign.kind === "native") &&
        <p>render native</p>
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
    currentCampaign: state.campaign.currentCampaign,
    selectedCampaignId: state.campaign.selectedCampaignId,
    match: ownProps.match,
    history: ownProps.history,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentStep: (step: STEPS) => dispatch(setCurrentStep(step)),
    setSelectedCampaignId: (id: number | null) => dispatch(setSelectedCampaignId(id)),
    setCurrentCampaign: (campaign: OrmCampaign) => dispatch(setCurrentCampaign(campaign)),
    setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
  };
}


export default UploadComponent;
