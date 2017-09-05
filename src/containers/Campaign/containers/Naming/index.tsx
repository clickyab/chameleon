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
  allDay: boolean;
  allTime: boolean;
}

@connect(mapStateToProps, mapDispatchToProps)
class NamingComponent extends React.Component <IProps, IState> {

  private i18n = I18n.getInstance();

  constructor(props: IProps) {
    super(props);
    this.state = {
      allDay: true,
      allTime: true,
    };
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.props.setSelectedCampaignId(this.props.match.params.id);
    } else {
      this.props.setSelectedCampaignId(null);
    }
  }

  private handleChangeStatus(event, index: number, status: boolean) {
    console.log(status);
  }

  private handleChangeDay(event, allDay: boolean) {
    this.setState({
      allDay: allDay,
    });
  }

  private handleChangeTime(event, allTime: boolean) {
    this.setState({
      allTime,
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

  public render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div dir="rtl">
        <Row>
          <Col>
            <h2 className="text-center"><Translate value="Campaign Naming"/></h2>
            <p className="text-center">Set configuration for ad name, period of time to show ad and ad"s status:</p>
          </Col>
        </Row>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row>
            <Col span={20}>
              <FormItem>
                {getFieldDecorator("status", {
                  initialValue: true,
                  rules: [{required: true, message: this.i18n._t("Please input your Submit Corpration Name!")}],
                })(
                  <SelectField style={{width: 120}} onChange={this.handleChangeStatus.bind(this)}>
                    <MenuItem key={`n_active`} value={true} primaryText={this.i18n._t("Active")}/>
                    <MenuItem key={`n_inactive`} value={false} primaryText={this.i18n._t("Inactive")}/>
                  </SelectField>)}
              </FormItem>
            </Col>
            <Col span={4}>
              <label>Status</label>
            </Col>
            <Col span={20}>
              <FormItem>
                {getFieldDecorator("name", {
                  rules: [{required: true, message: this.i18n._t("Please input your Campaign Name!")}],
                })(
                  <TextField
                    hintText={this.i18n._t("Your Campaign Name")}
                    fullWidth={true}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <label>Show Ad"s Days</label>
            </Col>
            <Col span={20}>
              <FormItem>
                {getFieldDecorator("days", {
                  initialValue: true,
                })(
                  <RadioButtonGroup name="days" onChange={this.handleChangeDay.bind(this)}>
                    <RadioButton
                      value={true}
                      label={this.i18n._t("All days")}
                    />
                    <RadioButton
                      value={false}
                      label={this.i18n._t("Specific Period")}
                    />
                  </RadioButtonGroup>
                )}
              </FormItem>
              {!this.state.allDay &&
              <Row>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("start-date", {
                      rules: [{required: true, message: this.i18n._t("Please select start date!")}],
                    })(
                      <TextField
                        hintText={this.i18n._t("Start date")}
                        fullWidth={true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("stop-date", {
                      rules: [{required: true, message: this.i18n._t("Please select stop date!")}],
                    })(
                      <TextField
                        hintText={this.i18n._t("End date")}
                        fullWidth={true}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              }
            </Col>
            <Col span={4}><label>Campaign Date</label></Col>
            <Col span={20}>
              <FormItem>
                {getFieldDecorator("time", {
                  initialValue: true,
                })(
                  <RadioButtonGroup name="times" onChange={this.handleChangeTime.bind(this)}>
                    <RadioButton
                      value={true}
                      label={this.i18n._t("All Times")}
                    />
                    <RadioButton
                      value={false}
                      label={this.i18n._t("Specific Times")}
                    />
                  </RadioButtonGroup>
                )}
              </FormItem>
              {!this.state.allTime &&
              <Row>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("start-time", {
                      rules: [{required: true, message: this.i18n._t("Please select start time!")}],
                    })(
                      <TextField
                        hintText={this.i18n._t("Start time")}
                        fullWidth={true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator("stop-time", {
                      rules: [{required: true, message: this.i18n._t("Please select stop time!")}],
                    })(
                      <TextField
                        hintText={this.i18n._t("End time")}
                        fullWidth={true}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              }
            </Col>
            <Col span={4}><label>Campaign Time</label></Col>
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

export default Form.create()(withRouter(NamingComponent as any));
