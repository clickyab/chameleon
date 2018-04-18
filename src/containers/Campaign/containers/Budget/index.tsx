import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {setCurrentCampaign, setCurrentStep, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {RootState} from "../../../../redux/reducers/index";
import STEPS from "../../steps";
import {Form, Input} from "antd";
import {Row, Col, notification, Spin} from "antd";
import {RadioButton, RadioButtonGroup} from "material-ui";
import I18n from "../../../../services/i18n/index";
import Translate from "../../../../components/i18n/Translate/index";
import {Select} from "antd";
import CONFIG from "../../../../constants/config";
import Tooltip from "../../../../components/Tooltip/index";
import {ControllersApi, ControllersCampaignGetResponse} from "../../../../api/api";
import {setBreadcrumb} from "../../../../redux/app/actions/index";
import StickyFooter from "../../components/StickyFooter";

const Option = Select.Option;

const FormItem = Form.Item;


interface IOwnProps {
  match?: any;
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
  pricing: IPricing;
  subscribers: string[];
  subscriber: string;
  currentCampaign?: ControllersCampaignGetResponse;
  networkType?: NETWORK_TYPE;
}

enum NETWORK_TYPE {CLICKYAB= "clickyab" , EXCHANGE = "all_except_clickyab" , ALL = "all"}
export enum IPricing {
  CPC = "cpc",
  CPM = "cpm",
}

@connect(mapStateToProps, mapDispatchToProps)
class BudgetComponent extends React.Component <IProps, IState> {

  private i18n = I18n.getInstance();

  constructor(props: IProps) {
    super(props);
    this.state = {
      pricing: (props.currentCampaign && props.currentCampaign.id === this.props.match.params.id) ? props.currentCampaign.strategy as IPricing : IPricing.CPC,
      subscribers: [],
      subscriber: "",
      currentCampaign: props.currentCampaign && props.currentCampaign.id === this.props.match.params.id ? props.currentCampaign : null,
      networkType: NETWORK_TYPE.CLICKYAB,
    };
  }

  public componentDidMount() {
    this.props.setCurrentStep(STEPS.BUDGET);
    this.props.setBreadcrumb("budget", this.i18n._t("Budget").toString(), "campaign");
    if (this.props.match.params.id) {
      this.props.setSelectedCampaignId(this.props.match.params.id);
      const api = new ControllersApi();
      api.campaignGetIdGet({id: this.props.match.params.id})
        .then((campaign) => {
          this.props.setBreadcrumb("campaignTitle", campaign.title, "budget");
          this.setState({
            currentCampaign: campaign,
          });
          this.props.setCurrentCampaign(campaign as ControllersCampaignGetResponse);
        });
    }
  }

  private handleChangePricing(event, type: IPricing) {
    this.setState({
      pricing: type,
    });
  }

  private handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        notification.error({
        message: this.i18n._t("Submit failed!").toString(),
        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
        description: this.i18n._t("Please check all fields and try again!").toString(),
        });
        return;
      }

      const controllerApi = new ControllersApi();
      controllerApi.campaignBudgetIdPut({
        id: this.state.currentCampaign.id.toString(),
        payloadData: {
          max_bid: parseInt(values.max_bid),
          daily_budget: parseInt(values.daily_budget),
          total_budget: parseInt(values.total_budget),
          strategy: values.strategy,
          exchange: values.exchange,
          receivers: values.receivers,
        }
      }).then(data => {
        this.props.setCurrentCampaign(data as ControllersCampaignGetResponse);
        notification.success({
          message: this.i18n._t("Submit Budget successfully!"),
          className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
          description: "",
        });
        this.props.history.push(`/campaign/select-publisher/${data.id}`);
      }).catch((error) => {
        notification.error({
          message: this.i18n._t("Submit Budget failed!").toString(),
          className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
          description: error.message,
        });
      });

    });
  }

  private handleBack() {
    this.props.history.push(`/campaign/targeting/${this.props.match.params.id}`);
  }

  private handleAdNetworkChange(value) {
    this.setState({
      networkType: value,
    });
    switch (value) {
      case NETWORK_TYPE.CLICKYAB:
        this.setState({
          pricing: IPricing.CPC,
        });
      break;
      case NETWORK_TYPE.EXCHANGE:
        this.setState({
          pricing: IPricing.CPM,
        });
      break;
      case NETWORK_TYPE.ALL:
        this.setState({
          pricing: IPricing.CPM,
        });
      break;
    }
}
  private handleSubscribersChange(value) {
    this.setState({
      subscriber: value,
      // subscribers: [...this.state.subscribers, value],
    });
  }

  public render() {

    if (!this.state.currentCampaign) {
      return <Spin/>;
    }

    const {getFieldDecorator} = this.props.form;
    return (
      <div dir={CONFIG.DIR} className="campaign-content">
        <Row type="flex">
          <Col span={18}>
          <Row className="campaign-title">
            <Col>
              <h2><Translate value="Budget And Finance"/></h2>
              <p><Translate value={"Set configuration for campaign's budget and finance"}/></p>
            </Col>
          </Row>
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <Row type="flex" align="middle" gutter={16}>
              <Col span={4}>
                <Tooltip/>
                <label>
                  <Translate value={"Max Budget"}/>
                </label>
              </Col>
              <Col span={10} offset={10}>
                <Row type="flex" align="middle" gutter={16}>
                  <Col span={10}>
                    <FormItem>
                      {getFieldDecorator("total_budget", {
                        initialValue: this.state.currentCampaign.total_budget,
                        rules: [{required: true, message: this.i18n._t("Please input maximum campaign's budget!")}],
                      })(
                        <Input
                          className="input-campaign campaign-textfield"
                          placeholder={this.i18n._t("Maximum Campaign's budget") as string}
                          type="number"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={14} className="currency">
                    {this.i18n._t("Currency_Name")}
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row type="flex" align="middle" gutter={16}>
              <Col span={4}>
                <Tooltip/>
                <label><Translate value="Daily Budget"/></label>
              </Col>
              <Col span={10} offset={10}>
                <Row type="flex" align="middle" gutter={16}>
                  <Col span={10}>
                    <FormItem>
                      {getFieldDecorator("daily_budget", {
                        initialValue: this.state.currentCampaign.daily_budget,
                        rules: [{required: true, message: this.i18n._t("Please input daily campaign's budget!")}],
                      })(
                        <Input
                          className="input-campaign campaign-textfield"
                          placeholder={this.i18n._t("Daily Campaign's budget") as string}
                          type="number"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={14} className="currency">
                    {this.i18n._t("Currency_Name")}
                  </Col>
                </Row>
              </Col>
            </Row>
              <Row type="flex" align="middle" gutter={16}>
                  <Col span={4}>
                      <Tooltip/>
                      <label><Translate value="display network"/></label>
                  </Col>
                  <Col span={10} offset={10} >
                      <Row type="flex" align="middle" gutter={16}>
                          <Col span={10}>
                            <FormItem>
                              {getFieldDecorator("exchange", {
                                initialValue: this.state.networkType,
                                rules: [{required: true, message: this.i18n._t("Please input daily campaign's budget!")}],
                              })(
                              <Select className={"select-input"}
                                      dropdownClassName={"select-dropdown"}
                                      onChange={(value) => this.handleAdNetworkChange(value)}>
                                <Option value={NETWORK_TYPE.CLICKYAB}><Translate value={"clickyab"}/></Option>
                                <Option value={NETWORK_TYPE.EXCHANGE}><Translate value={"exchange"}/></Option>
                                <Option value={NETWORK_TYPE.ALL}><Translate value={"All"}/></Option>
                              </Select>
                              )}
                            </FormItem>
                          </Col>
                        <Col span={14} className="currency">
                        </Col>
                      </Row>
                  </Col>
              </Row>

            <Row type="flex" align="middle" gutter={16}>
              <Col span={4}>
                <Tooltip/>
                <label>
                  <Translate value="Pricing Strategy"/>
                </label>
              </Col>
              <Col span={10} offset={10}>
                <FormItem className="form-radio">
                  {getFieldDecorator("strategy", {
                    initialValue: this.state.currentCampaign.strategy,
                  })(
                    <RadioButtonGroup defaultSelected={this.state.pricing}
                                      valueSelected={this.state.pricing}
                                      className="campaign-radio-group" name="pricing"
                                      onChange={this.handleChangePricing.bind(this)}>
                      <RadioButton className="campaign-radio-button"
                                   value={IPricing.CPC}
                                   label={this.i18n._t("CPC (per click)")}
                                   disabled={this.state.networkType === NETWORK_TYPE.EXCHANGE}
                      />
                      <RadioButton className="campaign-radio-button"
                                   value={IPricing.CPM}
                                   label={this.i18n._t("CPM (per 10,000 views)")}
                                   disabled={this.state.networkType === NETWORK_TYPE.CLICKYAB}
                      />
                    </RadioButtonGroup>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row type="flex" align="middle" gutter={16}>
              <Col span={4}>
                <Tooltip/>
                <label><Translate value="Click price"/></label>
              </Col>
              <Col span={10} offset={10}>
                <Row type="flex" align="middle" gutter={16}>
                  <Col span={10}>
                    <FormItem>
                      {getFieldDecorator("max_bid", {
                        initialValue: this.state.currentCampaign.max_bid,
                        rules: [{required: true, message: this.i18n._t("Please input click's price!")}],
                      })(
                        <Input
                          className="input-campaign campaign-textfield"
                          placeholder={this.i18n._t("click price") as string}
                          type="number"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={14} className="currency">
                    {this.i18n._t("Currency_Name")}
                  </Col>
                  <span className="per-click-description"><Translate value={"Minimum price per click is get-from-server"} /></span>
                </Row>
              </Col>
            </Row>

            <Row type="flex" align="middle" gutter={16}>
              <Col span={4}>
                <Tooltip/>
                <label><Translate value="Subscribers"/></label>
              </Col>
              <Col span={16}>
                <FormItem className="campaign-tag">
                  {getFieldDecorator("receivers", {
                    initialValue: (this.state.currentCampaign.receivers) ? this.state.currentCampaign.receivers : [],
                  })(
                    <Select
                      showSearch={false}
                      mode="tags"
                      filterOption={false}
                      style={{width: "100%"}}
                      placeholder="Tags Mode"
                      onChange={this.handleSubscribersChange.bind(this)}
                      className="select-tag-ant"
                    >
                    </Select>
                  )}
                </FormItem>
                <span className="subscriber-description"><Translate value={"Email of people that you want to notice in case of budget deficiency and recharge of account "} /></span>
              </Col>
            </Row>
            <StickyFooter backAction={this.handleBack.bind(this)} nextAction={this.handleSubmit.bind(this)}/>
          </Form>
          </Col>
            <Col span={6}>
            </Col>
        </Row>
      </div>
    );
  }
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
    setCurrentCampaign: (campaign: ControllersCampaignGetResponse) => dispatch(setCurrentCampaign(campaign)),
    setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
  };
}

export default Form.create()(withRouter(BudgetComponent as any));
