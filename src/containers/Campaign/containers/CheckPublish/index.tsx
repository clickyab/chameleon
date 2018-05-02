import * as React from "react";
import {Row, Col, Button, Spin, notification} from "antd";
import {RaisedButton} from "material-ui";
import {ControllersApi, ControllersCampaignGetResponse} from "../../../../api/api";
import CONFIG from "../../../../constants/config";
import {setCurrentCampaign, setCurrentStep, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import Translate from "../../../../components/i18n/Translate/index";
import Icon from "../../../../components/Icon/index";
import {connect} from "react-redux";
import "./style.less";
import {withRouter} from "react-router";
import {RootState} from "../../../../redux/reducers/index";
import STEPS from "../../steps";
import map from "../../../../components/IranMap/map";
import I18n from "../../../../services/i18n/index";
import {setBreadcrumb} from "../../../../redux/app/actions/index";
import {CAMPAIGN_STATUS} from "../Type";
import StickyFooter from "../../components/StickyFooter";

// campaign status
enum STATUS {ACTIVE, DEACTIVE, ARCHIVE}


interface IOwnProps {
  match ?: any;
  history?: any;
}

interface IProps {
  setBreadcrumb: (name: string, title: string, parent: string) => void;
  setCurrentCampaign: (campaign: ControllersCampaignGetResponse) => void;
  currentCampaign: ControllersCampaignGetResponse;
  setCurrentStep: (step: STEPS) => {};
  form: any;
  setSelectedCampaignId: (id: number | null) => {};
  currentStep: STEPS;
  selectedCampaignId: number | null;
  match: any;
  history: any;
}

interface IState {
  status: CAMPAIGN_STATUS;
  type?: DEVICE_TYPES;
  title: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  dailyBudget: number;
  costType: string;
  locations: string[];
  devices: string[];
  iabs: string[];
  listLabel: string | null;
  listType: boolean | null;
  websitesList: any[] | null;
  currentCampaign: ControllersCampaignGetResponse;
}


/**
 * @enum DEVICE_TYPES
 * @desc Device Types
 */
enum DEVICE_TYPES {
  WEB = "web",
  APPLICATION = "app",
}

/**
 * @enum WEB_TYPES
 * @desc Web Types
 */
enum WEB_TYPES {
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
class CheckPublishComponent extends React.Component <IProps, IState> {
  private i18n = I18n.getInstance();

  constructor(props: IProps) {
    super(props);
    this.state = {
      status: props.currentCampaign ? props.currentCampaign.status as CAMPAIGN_STATUS : null,
      type: props.currentCampaign ? props.currentCampaign.kind as DEVICE_TYPES : null,
      title: props.currentCampaign ? props.currentCampaign.title : null,
      startDate: props.currentCampaign ? props.currentCampaign.start_at : null,
      endDate: props.currentCampaign ? props.currentCampaign.end_at : null,
      totalBudget: props.currentCampaign ? props.currentCampaign.total_budget : null,
      dailyBudget: props.currentCampaign ? props.currentCampaign.daily_budget : null,
      costType: props.currentCampaign ? props.currentCampaign.strategy : null,
      locations: [],
      devices: [],
      iabs: [],
      listType: null,
      listLabel: null,
      websitesList: null,
      currentCampaign: props.currentCampaign,
    };
  }


  public componentDidMount() {
    this.props.setCurrentStep(STEPS.CHECK_PUBLISH);
    this.props.setBreadcrumb("checkPublisher", this.i18n._t("Check Publisher").toString(), "campaign");
    if (this.props.match.params.id) {
      this.props.setSelectedCampaignId(this.props.match.params.id);
      const api = new ControllersApi();
      api.campaignGetIdGet({id: this.props.match.params.id})
        .then((campaign) => {
          this.props.setBreadcrumb("campaignTitle", campaign.title, "checkPublisher");
          this.props.setCurrentCampaign(campaign as ControllersCampaignGetResponse);
          this.setState({
            status: campaign.status as CAMPAIGN_STATUS,
            type: campaign.kind as DEVICE_TYPES,
            title: campaign.title,
            startDate: campaign.created_at,
            endDate: campaign.end_at,
            totalBudget: campaign.total_budget,
            dailyBudget: campaign.daily_budget,
            costType: campaign.strategy,
            locations: campaign.attributes.region,
            devices: campaign.attributes.device,
            iabs: campaign.attributes.iab,
            currentCampaign: campaign,
          });
          if (campaign.inventory_id) {
            // api.inventoryPresetIdGet({id: campaign.inventory_id.toString()})
            //   .then((list) => {
            //     this.setState({
            //       listLabel: list.label,
            //       // websitesList: list.domains,
            //     });
            //   });
          }
        });

    } else {
      this.props.setSelectedCampaignId(null);
    }
  }


  /**
   * @func handleBack
   * @desc Redirect to previous step
   * @return {void}
   */
  private handleBack() {
    this.props.history.push(`/campaign/upload/${this.props.match.params.id}`);
  }


  private handleSubmit() {
    const controllApi = new ControllersApi();
    controllApi.campaignFinalizeIdPut({
      id: this.state.currentCampaign.id.toString(),
    }).then(() => {
      notification.success({
        message: this.i18n._t("Your campaign finalized!"),
        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
        description: ""
      });
    }).catch(error => {
      notification.error({
        message: this.i18n._t("Some treble things happened on campaign finalization!").toString(),
        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
        description: ""
      });
    });
  }

  public render() {

    if (this.props.match.params.id && !this.state.currentCampaign) {
      return <Spin/>;
    }

    return (
      <div dir={CONFIG.DIR} className="campaign-content check-publish">
        <Row className="campaign-title">
          <Col>
            <h2><Translate value="Check and publish"/></h2>
            <p><Translate
              value={"before save please check all information such as, budget , start and end time , ..."}/></p>
          </Col>
        </Row>
        <Row type="flex" gutter={30}>
          <Col span={12}>
            <div className="check-title">
              <Button className="edit-btn"
                      onClick={() => {
                        this.props.history.push(`/campaign/naming/${this.props.match.params.id}`);
                      }}>
                <Icon name={"cif-gear-outline"} className="edit-btn-icon"/>
                <Translate value="Edit"/>
              </Button>
              <Icon name="cif-summary" className="check-title-icon"/><Translate value={"Basic informations"}/>
            </div>
            <Row className="summary-field-wrapper">
              <Col span={16} className="status">
                {this.state.status &&
                <span className="active"><Translate value={"Active"}/></span>
                }
                {!this.state.status &&
                <span className="deactive"><Translate value={"Deactive"}/></span>
                }
              </Col>
              <Col span={8}>
                <label><Translate value={"Status"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                  {this.state.type}
              </Col>
              <Col span={8}>
                <label><Translate value={"campaign type"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                {this.state.title}
              </Col>
              <Col span={8}>
                <label><Translate value={"Campaign name"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                {this.i18n._d(this.state.startDate, "L")}
              </Col>
              <Col span={8}>
                <label><Translate value={"Campaign start date"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                {this.state.endDate && this.i18n._d(this.state.endDate, "L")}
                {!this.state.endDate &&
                <Translate value={"No End date Provided"}/>}
              </Col>
              <Col span={8}>
                <label><Translate value={"Campaign end date"}/></label>
              </Col>
            </Row>
            <div className="check-title">
              <Button className="edit-btn"
                      onClick={() => {
                        this.props.history.push(`/campaign/budget/${this.props.match.params.id}`);
                      }}>
                <Icon name={"cif-gear-outline"} className="edit-btn-icon"/>
                <Translate value="Edit"/>
              </Button>
              <Icon name="cif-budget" className="check-title-icon"/><Translate value={"Budget"}/>
            </div>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                {this.state.costType}
              </Col>
              <Col span={8}>
                <label><Translate value={"Unit price(CPC)"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                <b>{this.state.totalBudget + " "}</b>
                <Translate value={"Currency_Name"}/>
              </Col>
              <Col span={8}>
                <label><Translate value={"campaign total budget"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                <b>{this.state.dailyBudget + " "}</b>
                <Translate value={"Currency_Name"}/>
              </Col>
              <Col span={8}>
                <label><Translate value={"Campaign daily budget"}/></label>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <div className="check-title">
              <Button className="edit-btn"
                      onClick={() => {
                        this.props.history.push(`/campaign/targeting/${this.props.match.params.id}`);
                      }}>
                <Icon name={"cif-gear-outline"} className="edit-btn-icon"/>
                <Translate value="Edit"/>
              </Button>
              <Icon name="cif-target" className="check-title-icon"/><Translate value={"Targeting"}/>
            </div>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                {this.state.locations.length === 0 &&
                <Translate value={"All Iran Area"}/>
                }
                {this.state.locations && this.state.locations.length > 0 && this.state.locations[0] === "foreign" &&
                <Translate value={"Foreign of Iran"}/>
                }
                {this.state.locations && this.state.locations.length > 0 && this.state.locations[0] !== "foreign" &&
                <span>{this.state.locations.map(location => {
                  const area = map.g.path.find((item) => (item.id === location));
                  return area ? area.title : "-";
                }).join(" / ")}</span>
                }
              </Col>
              <Col span={8}>
                <label><Translate value={"View regions"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                {this.state.devices.length === 0 &&
                <Translate value={"All devices"}/>
                }
                {this.state.devices.join(" / ")}
              </Col>
              <Col span={8}>
                <label><Translate value={"Device Type"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                {this.state.iabs.length === 0 &&
                <Translate value={"All categories"}/>
                }
                {this.state.iabs.join(" / ")}
              </Col>
              <Col span={8}>
                <label><Translate value={"IAB Catagories"}/></label>
              </Col>
            </Row>
            <div className="check-title">
              <Button className="edit-btn"
                      onClick={() => {
                        this.props.history.push(`/campaign/select-publisher/${this.props.match.params.id}`);
                      }}>
                <Icon name={"cif-gear-outline"} className="edit-btn-icon"/>
                <Translate value="Edit"/>
              </Button>
              <Icon name="cif-compass" className="check-title-icon"/><Translate value={"Publishers"}/>
            </div>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                {this.state.listLabel}
              </Col>
              <Col span={8}>
                <label><Translate value={"Selected List"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                {this.state.currentCampaign.inventory_type &&
                <Translate value={"White List"}/>
                }
                {!this.state.currentCampaign.inventory_type &&
                <Translate value={"Black List"}/>
                }

              </Col>
              <Col span={8}>
                <label><Translate value={"List Type"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                400 websites selected
              </Col>
              <Col span={8}>
                <label><Translate value={"Number of websites"}/></label>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row type="flex" align="middle">
            <StickyFooter isSave  nextAction={this.handleSubmit.bind(this)} backAction={this.handleBack.bind(this)} />
        </Row>
      </div>
    );
  }
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
    setCurrentCampaign: (campaign: ControllersCampaignGetResponse) => dispatch(setCurrentCampaign(campaign)),
    setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
  };
}


export default (withRouter(CheckPublishComponent as any));
