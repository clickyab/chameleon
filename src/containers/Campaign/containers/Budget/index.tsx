import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {setCurrentStep, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {RootState} from "../../../../redux/reducers/index";
import STEPS from "../../steps";
import {Form} from "antd";
import {Row, Col, notification} from "antd";
import {MenuItem, RadioButton, SelectField, TextField, RadioButtonGroup, RaisedButton} from "material-ui";
import I18n from "../../../../services/i18n/index";
import Translate from "../../../../components/i18n/Translate/index";
import {Select} from "antd";
import Icon from "../../../../components/Icon";
import CONFIG from "../../../../constants/config";
import Tooltip from "../../../../components/Tooltip/index";

const Option = Select.Option;

const FormItem = Form.Item;


interface IOwnProps {
  match?: any;
  history?: any;
}

interface IProps {
  form: any;
  setCurrentStep: (step: STEPS) => {};
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
}

export enum IPricing {CPC, CPM, CPA}

@connect(mapStateToProps, mapDispatchToProps)
class BudgetComponent extends React.Component <IProps, IState> {

  private i18n = I18n.getInstance();

  constructor(props: IProps) {
    super(props);
    this.state = {
      pricing: IPricing.CPC,
      subscribers: [],
      subscriber: "",
    };
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.props.setSelectedCampaignId(this.props.match.params.id);
    } else {
      this.props.setSelectedCampaignId(null);
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
          message: "Submit failed!",
          description: this.i18n._t("Please check all fields and try again!").toString(),
        });
        return;
      }

    });
  }

  private handleBack() {
    console.log("back");
  }

  private handleSubscribersChange(value) {
    console.log(value);
    this.setState({
      subscriber: value,
      // subscribers: [...this.state.subscribers, value],
    });
  }

  public render() {

    const {getFieldDecorator} = this.props.form;
    return (
      <div dir={CONFIG.DIR} className="campaign-content" >
        <Row className="campaign-title">
          <Col>
            <h2><Translate value="Budget And Finance"/></h2>
            <p>Set configuration for campaign's budget and finance:</p>
          </Col>
        </Row>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row type="flex" align="middle">
            <Col span={4}>
              <Tooltip/>
              <label>Max Budget</label>
            </Col>
            <Col span={10} offset={10}>
              <Row type="flex" align="middle">
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator("max-budget", {
                      initialValue: true,
                      rules: [{required: true, message: this.i18n._t("Please input maximum campaign's budget!")}],
                    })(
                      <TextField
                        className="campaign-textfield"
                        hintText={this.i18n._t("Maximum Campaign's budget")}
                        type="number"
                        step={5}
                        fullWidth={true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={16} className="currency">
                  {this.i18n._t("Currency_Name")}
                </Col>
              </Row>
            </Col>
          </Row>

          <Row type="flex" align="middle">
            <Col span={4}>
              <Tooltip/>
              <label><Translate value="Daily Budget"/></label>
            </Col>
            <Col span={10} offset={10}>
              <Row type="flex" align="middle">
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator("daily-budget", {
                    initialValue: true,
                    rules: [{required: true, message: this.i18n._t("Please input daily campaign's budget!")}],
                  })(
                    <TextField
                      className="campaign-textfield"
                      hintText={this.i18n._t("Daily Campaign's budget")}
                      type="number"
                      fullWidth={true}
                    />
                  )}
                </FormItem>
              </Col>
                <Col span={16} className="currency">
                  {this.i18n._t("Currency_Name")}
                </Col>
              </Row>
            </Col>
          </Row>

          <Row type="flex" align="middle">
            <Col span={4}>
              <Tooltip/>
              <label>
                <Translate value="Pricing Strategy"/>
              </label>
            </Col>
            <Col span={10} offset={10}>
              <FormItem>
                {getFieldDecorator("pricing", {
                  initialValue: true,
                })(
                  <RadioButtonGroup className="campaign-radio-group" name="pricing"
                                    onChange={this.handleChangePricing.bind(this)}>
                    <RadioButton    className="campaign-radio-button"
                      value={IPricing.CPC}
                      label={this.i18n._t("CPC (per click)")}
                    />
                    <RadioButton    className="campaign-radio-button"
                      value={IPricing.CPM}
                      label={this.i18n._t("CPM (per 10,000 views)")}
                    />
                    <RadioButton    className="campaign-radio-button"
                      value={IPricing.CPA}
                      label={this.i18n._t("CPA (per action)")}
                    />
                  </RadioButtonGroup>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row type="flex" align="middle">
            <Col span={4}>
              <Tooltip/>
              <label><Translate value="Click price"/></label>
            </Col>
            <Col span={10} offset={10}>
              <Row type="flex" align="middle">
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator("click-price", {
                      initialValue: true,
                      rules: [{required: true, message: this.i18n._t("Please input click's price!")}],
                    })(
                      <TextField
                        className="campaign-textfield"
                        hintText={this.i18n._t("click price")}
                        type="number"
                        fullWidth={true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={16} className="currency">
                  {this.i18n._t("Currency_Name")}
                </Col>
              </Row>
            </Col>
          </Row>

          <Row type="flex" align="middle">
            <Col span={4}>
              <Tooltip/>
              <label><Translate value="Subscribers"/></label>
            </Col>
            <Col span={20}>
              <FormItem className="campaign-tag">
                {getFieldDecorator("Subscribers", {
                  rules: [{required: true, message: this.i18n._t("Subscribers!")}],
                })(
                  <Select
                    showSearch={false}
                    mode="tags"
                    filterOption={false}
                    style={{width: "50%"}}
                    placeholder="Tags Mode"
                    onChange={this.handleSubscribersChange.bind(this)}
                  >
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row >
            <RaisedButton
              onClick={this.handleBack.bind(this)}
              label={<Translate value="Back"/>}
              primary={false}
              className="button-back-step"
              icon={<Icon name="arrow" color="white"/>}
            />
            <RaisedButton
              onClick={this.handleSubmit.bind(this)}
              label={<Translate value="Next Step"/>}
              primary={true}
              className="button-next-step"
              icon={<Icon name="arrow" color="white"/>}
            />
          </Row>
        </Form>
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

export default Form.create()(withRouter(BudgetComponent as any));
