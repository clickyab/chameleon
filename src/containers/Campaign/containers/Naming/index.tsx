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
import Icon from "../../../../components/Icon";
import CONFIG from "../../../../constants/config";
import PersianDatePicker from "../../../../components/datePicker/index";
import Tooltip from "../../../../components/Tooltip/index";

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
      <div dir={CONFIG.DIR} className="campaign-content">
        <Row className="campaign-title">
          <Col>
            <h2><Translate value="Campaign Naming"/></h2>
            <p>Set configuration for ad name, period of time to show ad and ad"s status:</p>
          </Col>
        </Row>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row type="flex" align="middle">
            <Col span={4}>
              <Tooltip/>
              <label>Status</label>
            </Col>
            <Col span={20} className="form-select-column">
              <FormItem>
                {getFieldDecorator("status", {
                  initialValue: true,
                  rules: [{required: true, message: this.i18n._t("Please input your Submit Corpration Name!")}],
                })(
                  <SelectField className={(CONFIG.DIR === "rtl") ? "form-select-rtl" : "form-select"}
                               onChange={this.handleChangeStatus.bind(this)}>
                    <MenuItem key={`n_active`} value={true} primaryText={this.i18n._t("Active")}/>
                    <MenuItem key={`n_inactive`} value={false} primaryText={this.i18n._t("Inactive")}/>
                  </SelectField>)}
              </FormItem>
            </Col>
            <Col span={4}>
              <Tooltip/>
              <label>Show Ad"s Days</label>
            </Col>
            <Col span={15} offset={5}>
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
              <Tooltip/>
              <label>Campaign Date</label>
            </Col>
            <Col span={20}>
              <FormItem>
                {getFieldDecorator("days", {
                  initialValue: true,
                })(
                  <RadioButtonGroup className="campaign-radio-group" name="days"
                                    onChange={this.handleChangeDay.bind(this)}>
                    <RadioButton className="campaign-radio-button"
                                 value={true}
                                 label={this.i18n._t("All days")}
                    />
                    <RadioButton className="campaign-radio-button"
                                 value={false}
                                 label={this.i18n._t("Specific Period")}
                    />
                  </RadioButtonGroup>
                )}
              </FormItem>
              {!this.state.allDay &&
              <Row gutter={16}>
                <Col span={9} offset={6}>
                  <FormItem>
                    {getFieldDecorator("stop-date", {
                      rules: [{required: true, message: this.i18n._t("Please select stop date!")}],
                    })(
                      <PersianDatePicker onChange={value => console.log(value)}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={9}>
                  <FormItem>
                    {getFieldDecorator("start-date", {
                      rules: [{required: true, message: this.i18n._t("Please select start date!")}],
                    })(
                      <PersianDatePicker onChange={value => console.log(value)}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              }
            </Col>
            <Col span={4}>
              <Tooltip/>
              <label>Campaign Time</label>
            </Col>
            <Col span={20}>
              <FormItem>
                {getFieldDecorator("time", {
                  initialValue: true,
                })(
                  <RadioButtonGroup className="campaign-radio-group" name="times"
                                    onChange={this.handleChangeTime.bind(this)}>
                    <RadioButton className="campaign-radio-button"
                                 value={true}
                                 label={this.i18n._t("All Times")}
                    />
                    <RadioButton className="campaign-radio-button"
                                 value={false}
                                 label={this.i18n._t("Specific Times")}
                    />
                  </RadioButtonGroup>
                )}
              </FormItem>
              {!this.state.allTime &&
              <Row gutter={16}>
                <Col span={9} offset={6}>
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
                <Col span={9}>
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
              </Row>
              }
            </Col>
          </Row>
          <Row type="flex" align="middle">
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

export default Form.create()(withRouter(NamingComponent as any));
