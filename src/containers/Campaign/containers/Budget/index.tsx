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
      <div style={{direction: "rtl"}}>
        <Row>
          <Col>
            <h2 className="text-center"><Translate value="Budget And Finance"/></h2>
            <p className="text-center">Set configuration for campaign's budget and finance:</p>
          </Col>
        </Row>
        <Form onSubmit={this.handleSubmit.bind(this)}>

          <Row>
            <Col span={20}>
              <Row>
                <Col span={16}>
                  {this.i18n._t("Currency_Name")}
                </Col>
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator("max-budget", {
                      initialValue: true,
                      rules: [{required: true, message: this.i18n._t("Please input maximum campaign's budget!")}],
                    })(
                      <TextField
                        hintText={this.i18n._t("Maximum Campaign's budget")}
                        type="number"
                        fullWidth={true}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col span={4}>
              <label>Max Budget</label>
            </Col>
          </Row>

          <Row>
            <Col span={20}>
              <Col span={16}>
                {this.i18n._t("Currency_Name")}
              </Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator("daily-budget", {
                    initialValue: true,
                    rules: [{required: true, message: this.i18n._t("Please input daily campaign's budget!")}],
                  })(
                    <TextField
                      hintText={this.i18n._t("Daily Campaign's budget")}
                      type="number"
                      fullWidth={true}
                    />
                  )}
                </FormItem>
              </Col>
            </Col>
            <Col span={4}>
              <label><Translate value="Daily Budget"/></label>
            </Col>
          </Row>

          <Row>
            <Col span={20}>
              <FormItem>
                {getFieldDecorator("pricing", {
                  initialValue: true,
                })(
                  <RadioButtonGroup name="pricing" onChange={this.handleChangePricing.bind(this)}>
                    <RadioButton
                      value={IPricing.CPC}
                      label={this.i18n._t("CPC (per click)")}
                    />
                    <RadioButton
                      value={IPricing.CPM}
                      label={this.i18n._t("CPM (per 10,000 views)")}
                    />
                    <RadioButton
                      value={IPricing.CPA}
                      label={this.i18n._t("CPA (per action)")}
                    />
                  </RadioButtonGroup>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <label>
                <Translate value="Pricing Strategy"/>
              </label>
            </Col>
          </Row>

          <Row>
            <Col span={20}>
              <Row>
                <Col span={16}>
                  {this.i18n._t("Currency_Name")}
                </Col>
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator("click-price", {
                      initialValue: true,
                      rules: [{required: true, message: this.i18n._t("Please input click's price!")}],
                    })(
                      <TextField
                        hintText={this.i18n._t("click price")}
                        type="number"
                        fullWidth={true}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col span={4}>
              <label><Translate value="Click price"/></label>
            </Col>
          </Row>

          <Row>
            <Col span={20}>
              <FormItem>
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
            <Col span={4}>
              <label><Translate value="Subscribers"/></label>
            </Col>
          </Row>
          <Row>
            <RaisedButton
              onClick={this.handleSubmit.bind(this)}
              label={<Translate value="Next Step"/>}
              primary={true}
              className="button-next-step"
            />
            <RaisedButton
              onClick={this.handleBack.bind(this)}
              label={<Translate value="Back"/>}
              primary={false}
              className="button-next-step"
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
