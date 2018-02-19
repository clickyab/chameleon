/**
 * @file Upload banner step
 */
import * as React from "react";
import {connect} from "react-redux";
import I18n from "../../../../services/i18n/index";
import "./style.less";
import {ControllersApi, OrmCampaign} from "../../../../api/api";
import STEPS from "../../steps";
import {RootState} from "../../../../redux/reducers/index";
import {setCurrentStep, setCurrentCampaign, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {setBreadcrumb} from "../../../../redux/app/actions/index";
import Native from "./Native";
import UploadBanner from "./UploadBanner";
import {AdTemplate, TEMPLATE} from "./templateComponent";
import StickyFooter from "../../components/StickyFooter";
import Translate from "../../../../components/i18n/Translate";


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
  template?: TEMPLATE;
}

/**
 * @interface IState
 * @desc define state object
 */
interface IState {
  currentCampaign: OrmCampaign;
  template: TEMPLATE;
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
      template: props.template ? props.template : TEMPLATE.NONE
    };
  }

  public componentDidMount() {
    this.props.setCurrentStep(STEPS.UPLOAD);
    this.props.setBreadcrumb("upload", this.i18n._t("Upload").toString(), "campaign");
    if (this.props.match.params.id) {
      this.props.setSelectedCampaignId(this.props.match.params.id);
      const api = new ControllersApi();
      api.campaignGetIdGet({id: this.props.match.params.id})
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
     * @func handleDragOver Important drop wont fire without this
     */
    private handleDragOver(e) {
        e.preventDefault();
    }

    private handleTemplateEvent(e) {
        this.setState({
            template: JSON.parse(e.dataTransfer.getData("template"))
        });
    }
    private handleTemplate(template) {
        this.setState({
            template: template
        });
    }
  /**
   * @func render
   * @desc render component
   * @returns {any}
   */
  public render() {
    return (<div className="upload-wrapper">
          <AdTemplate template={this.state.template} onChange={(temp) => this.handleTemplate(temp) } />
            {this.state.template === TEMPLATE.BANNER &&
            <div className={"template-drag-drop"}
                 onDragOver={this.handleDragOver}
                 onDrop={(e) => {this.handleTemplateEvent(e); }}>
                <div className="vcenter">
                    <Translate value={"Please select your add type from right and drag and drop it over here"}/>
                </div>
            <StickyFooter customClass="sticky-footer-upload" backAction={() => {console.log("here"); } }  nextAction={() => {console.log("here"); } }/>
            </div>
            }
            {this.state.template === TEMPLATE.NONE && this.state.currentCampaign &&
                <UploadBanner currentCampaign={this.state.currentCampaign} />
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
