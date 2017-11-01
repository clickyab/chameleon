import * as React from "react";
import {Row, Col, Button} from "antd";
import {RaisedButton} from "material-ui";
import CONFIG from "../../../../constants/config";
import {setCurrentCampaign, setCurrentStep, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import Translate from "../../../../components/i18n/Translate/index";
import Icon from "../../../../components/Icon/index";
import {connect} from "react-redux";
import "./style.less";
import {withRouter} from "react-router";
import {RootState} from "../../../../redux/reducers/index";
import STEPS from "../../steps";
import {OrmCampaign} from "../../../../api/api";

// campaign status
enum STATUS {ACTIVE, DEACTIVE, ARCHIVE}


interface IOwnProps {
  match ?: any;
  history?: any;
}

interface IProps {
  setCurrentCampaign: (campaign: OrmCampaign) => void;
  currentCampaign: OrmCampaign;
  setCurrentStep: (step: STEPS) => {};
  form: any;
  setSelectedCampaignId: (id: number | null) => {};
  currentStep: STEPS;
  selectedCampaignId: number | null;
  match: any;
  history: any;
}

interface IState {
  status: STATUS;
}


@connect(mapStateToProps, mapDispatchToProps)
class CheckPublishComponent extends React.Component <IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {status: STATUS.DEACTIVE};
  }

  /**
   * @func handleBack
   * @desc Redirect to previous step
   * @return {void}
   */
  private handleBack() {
    this.props.setCurrentStep(STEPS.UPLOAD);
    this.props.history.push(`/campaign/upload/${this.props.match.params.id}`);
  }
  public render() {
    return (
      <div dir={CONFIG.DIR} className="campaign-content check-publish">
        <Row className="campaign-title">
          <Col>
            <h2><Translate value="Check and publish"/></h2>
            <p><Translate
              value={"before save please check all informations such as, budget , start and end time , ..."}/></p>
          </Col>
        </Row>
        <Row type="flex" gutter={30}>
          <Col span={12}>
            <div className="check-title">
              <Button className="edit-btn"
              onClick={() => {this.props.history.push(`/campaign/naming/${this.props.match.params.id}`); } } >
                <Icon name={"cif-gear-outline"} className="edit-btn-icon"/>
                <Translate value="Edit"/>
              </Button>
              <Icon name="cif-summary" className="check-title-icon"/><Translate value={"Basic informations"}/>
            </div>
            <Row className="summary-field-wrapper">
              <Col span={16} className="status">
                {this.state.status === STATUS.ACTIVE &&
                <span className="active"><Translate value={"Active"}/></span>
                }
                {this.state.status === STATUS.DEACTIVE &&
                <span className="deactive"><Translate value={"Deactive"}/></span>
                }
                {this.state.status === STATUS.ARCHIVE &&
                <span className="archive"><Translate value={"Archive"}/></span>
                }
              </Col>
              <Col span={8}>
                <label><Translate value={"Status"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                web(banner)
              </Col>
              <Col span={8}>
                <label><Translate value={"campaign type"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                Modiseh_Peyk_1652
              </Col>
              <Col span={8}>
                <label><Translate value={"Campaign name"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                2017/8/30
              </Col>
              <Col span={8}>
                <label><Translate value={"Campaign start date"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                2017/10/30
              </Col>
              <Col span={8}>
                <label><Translate value={"Campaign end date"}/></label>
              </Col>
            </Row>
            <div className="check-title">
              <Button className="edit-btn"
                      onClick={() => {this.props.history.push(`/campaign/budget/${this.props.match.params.id}`); } }>
                <Icon name={"cif-gear-outline"} className="edit-btn-icon"/>
                <Translate value="Edit"/>
              </Button>
              <Icon name="cif-budget" className="check-title-icon"/><Translate value={"Budget"}/>
            </div>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                200 currancy
              </Col>
              <Col span={8}>
                <label><Translate value={"Unit price(CPC)"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                400,000 currancy
              </Col>
              <Col span={8}>
                <label><Translate value={"campaign total budget"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                100,000 currancy
              </Col>
              <Col span={8}>
                <label><Translate value={"Campaign daily budget"}/></label>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <div className="check-title">
              <Button className="edit-btn"
                      onClick={() => {this.props.history.push(`/campaign/targeting/${this.props.match.params.id}`); } }>
                <Icon name={"cif-gear-outline"} className="edit-btn-icon"/>
                <Translate value="Edit"/>
              </Button>
              <Icon name="cif-target" className="check-title-icon"/><Translate value={"Targeting"}/>
            </div>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                All conturies
              </Col>
              <Col span={8}>
                <label><Translate value={"View regions"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                Desktop, Mobile, Tablet
              </Col>
              <Col span={8}>
                <label><Translate value={"Device Type"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                3 catagory selected
                <p>game/culture/..</p>
              </Col>
              <Col span={8}>
                <label><Translate value={"IAB Catagories"}/></label>
              </Col>
            </Row>
            <div className="check-title">
              <Button className="edit-btn"
                      onClick={() => {this.props.history.push(`/campaign/select-publisher/${this.props.match.params.id}`); } }>
                <Icon name={"cif-gear-outline"} className="edit-btn-icon"/>
                <Translate value="Edit"/>
              </Button>
              <Icon name="cif-compass" className="check-title-icon"/><Translate value={"Publishers"}/>
            </div>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                best_website_select_2
              </Col>
              <Col span={8}>
                <label><Translate value={"Selected List"}/></label>
              </Col>
            </Row>
            <Row className="summary-field-wrapper">
              <Col span={16}>
                BlackList
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
          <RaisedButton
            label={<Translate value="Back"/>}
            primary={false}
            onClick={this.handleBack.bind(this)}
            className="button-back-step"
            icon={<Icon name={"cif-arrowleft-4"} className={"back-arrow"}/>}
          />
          <RaisedButton
            label={<Translate value="Next Step"/>}
            primary={true}
            className="button-next-step btn-save"
          />
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
  };
}


export default (withRouter(CheckPublishComponent as any));
