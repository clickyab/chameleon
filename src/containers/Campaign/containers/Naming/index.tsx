import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {setCurrentCampaign, setCurrentStep, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {RootState} from "../../../../redux/reducers/index";
import STEPS from "../../steps";
import {Col, Form, notification, Row} from "antd";
import {MenuItem, RadioButton, RadioButtonGroup, RaisedButton, SelectField, TextField} from "material-ui";
import I18n from "../../../../services/i18n/index";
import Translate from "../../../../components/i18n/Translate/index";
import Icon from "../../../../components/Icon";
import CONFIG from "../../../../constants/config";
import PersianDatePicker from "../../../../components/datePicker/index";
import Tooltip from "../../../../components/Tooltip/index";
import "./style.less";
import {
  ControllersApi,
  OrmCampaign,
  OrmCampaignSchedule,
  ControllersCreateCampaignPayload, ControllersCampaignStatusSchedule, ControllersCampaignStatus,
} from "../../../../api/api";
import TimePeriod from "./Components/timePeriod/index";

const FormItem = Form.Item;

interface IOwnProps {
  match?: any;
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
  allDay: boolean;
  allTime: boolean;
  status: boolean;
  currentCampaign: OrmCampaign;
  schedule ?: OrmCampaignSchedule;
  timePeriods: any[];
}

@connect(mapStateToProps, mapDispatchToProps)
class NamingComponent extends React.Component <IProps, IState> {

  private i18n = I18n.getInstance();

  constructor(props: IProps) {
    super(props);
    this.state = {
      allDay: true,
      allTime: true,
      status: false,
      currentCampaign: props.currentCampaign,
      timePeriods: [{from: 0, to: 23}],
    };
  }

  public componentDidMount() {
    if (this.props.match.params.id) {
      this.props.setSelectedCampaignId(this.props.match.params.id);
      const api = new ControllersApi();
      api.campaignIdGet({id: this.props.match.params.id})
        .then((campaign) => {
          this.props.setCurrentCampaign(campaign as OrmCampaign);
          let timePeriods = this.parseTimePeriodToState(campaign.schedule);
          this.setState({
            currentCampaign: campaign,
            allDay: !campaign.end_at,
            allTime: (timePeriods.length === 1 && timePeriods[0].from === 0 && timePeriods[0].to === 23),
            timePeriods,
          });
        });
    } else {
      this.props.setSelectedCampaignId(null);
      this.setStateForTimePeriods();
    }
  }

  private parseTimePeriodToState(schedule: OrmCampaignSchedule) {
    let parsedSchedule = [];
    Object.keys(schedule)
      .map((key, index) => {
        if (schedule[key]) {
          schedule[key].split(",")
            .forEach(row => {
              let itemRow = parsedSchedule[parseInt(row)];
              if (itemRow) {
                itemRow.to = index;
              } else {
                itemRow = {};
                itemRow.from = index;
              }
              parsedSchedule[parseInt(row)] = itemRow;
            });
        }
      });
    return parsedSchedule;
  }

  private setStateForTimePeriods() {
    let schedule: OrmCampaignSchedule = {};
    for (let i = 0; i < 23; i++) {
      schedule[`h` + (`0` + i).slice(-2)] = false;
    }

    this.state.timePeriods.map((p, index) => {
      for (let j = parseInt(p.from); j <= parseInt(p.to); j++) {
        if (schedule[`h` + (`0` + j).slice(-2)]) {
          schedule[`h` + (`0` + j).slice(-2)] = schedule[`h` + (`0` + j).slice(-2)] + `,${index}`;
        } else {
          schedule[`h` + (`0` + j).slice(-2)] = `${index}`;
        }
      }
    });

    this.setState({
      schedule
    });
  }

  private onTimePeriodChange(index, from, to) {
    let periods = this.state.timePeriods;
    periods[index] = {from, to};
    this.setState({
      timePeriods: periods,
    }, this.setStateForTimePeriods);
  }

  private addPeriod(e) {
    e.preventDefault();
    this.setState({
      timePeriods: [...this.state.timePeriods, {form: 0, to: 23}],
    });
  }

  private removePeriod(index) {
    let periods = this.state.timePeriods;
    periods.splice(index, 1);
    console.log(index);
    this.setState({
      timePeriods: periods,
    });
  }

  private handleChangeStatus(event, index: number, status: boolean) {
    let campaign = this.state.currentCampaign;
    campaign.status = status;
    this.setState({
      currentCampaign: campaign,
    });
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

      let campaign: ControllersCreateCampaignPayload = this.state.currentCampaign as ControllersCreateCampaignPayload;
      campaign.title = values.name;
      campaign.status = this.state.status;
      campaign.start_at = values.start_at;
      if (this.state.allDay) {
        campaign.end_at = null;
      } else {
        delete campaign.end_at;
      }

      campaign.schedule = this.state.schedule as ControllersCampaignStatusSchedule;

      const controllerApi = new ControllersApi();

      if (this.props.match.params.id) {
        controllerApi.campaignBaseIdPut({
          id: this.state.currentCampaign.id.toString(),
          payloadData: campaign as ControllersCampaignStatus,
        }).then(data => {
          this.props.setCurrentCampaign(data as OrmCampaign);
          notification.success({
            message: this.i18n._t("Campaign updated successfully"),
            description: "",
          });
        }).catch((error) => {
          notification.error({
            message: this.i18n._t("Campaign update failed!"),
            description: error.message,
          });
        });
      } else {
        controllerApi.campaignCreatePost({
          payloadData: campaign,
        }).then(data => {
          this.props.setSelectedCampaignId(data.id);
          this.props.setCurrentCampaign(data as OrmCampaign);
          this.props.history.push(`budget/${data.id}`);
        }).catch((error) => {
          notification.error({
            message: this.i18n._t("Create campaign failed!"),
            description: error.message,
          });
        });
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
        <Row  className="campaign-title">
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
                <SelectField className={(CONFIG.DIR === "rtl") ? "select-list-rtl" : "select-list"}
                             value={this.state.currentCampaign.status}
                             onChange={this.handleChangeStatus.bind(this)}>
                  <MenuItem key={`n_active`} value={true} primaryText={this.i18n._t("Active")}/>
                  <MenuItem key={`n_inactive`} value={false} primaryText={this.i18n._t("Inactive")}/>
                </SelectField>
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" align="middle">
            <Col span={4}>
              <Tooltip/>
              <label>Show Ad"s Days</label>
            </Col>
            <Col span={15} offset={5}>
              <FormItem>
                {getFieldDecorator("name", {
                  initialValue: this.state.currentCampaign.title,
                  rules: [{required: true, message: this.i18n._t("Please input your Campaign Name!")}],
                })(
                  <TextField
                    hintText={this.i18n._t("Your Campaign Name")}
                    fullWidth={true}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex">
            <Col span={4} className="title-with-radio">
              <Tooltip/>
              <label>Campaign Date</label>
            </Col>
            <Col span={20}>
              <FormItem>
                {getFieldDecorator("days", {
                  initialValue: this.state.allDay,
                })(
                  <RadioButtonGroup className="campaign-radio-group" name="days"
                                    valueSelected={this.state.allDay}
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
              <Row type="flex" gutter={16} align="top" >
                {!this.state.allDay &&
                <Col span={9} >
                  <FormItem>
                    {getFieldDecorator("end_at", {
                      initialValue: this.state.currentCampaign.end_at,
                      rules: [{required: true, message: this.i18n._t("Please select stop date!")}],
                    })(
                      <PersianDatePicker />
                    )}
                  </FormItem>
                </Col>
                }
                <Col span={9}>
                  <FormItem>
                    {getFieldDecorator("start_at", {
                      initialValue: this.state.currentCampaign.start_at,
                      rules: [{required: true, message: this.i18n._t("Please select start date!")}],
                    })(
                      <PersianDatePicker/>
                    )}
                  </FormItem>
                </Col>

              </Row>
            </Col>
          </Row>
          <Row type="flex">
            <Col span={4} className="title-with-radio">
              <Tooltip/>
              <label>Campaign Time</label>
            </Col>
            <Col span={20}>
              <FormItem>
                {getFieldDecorator("time", {
                  initialValue: this.state.allTime,
                })(
                  <RadioButtonGroup className="campaign-radio-group" name="times"
                                    valueSelected={this.state.allTime}
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
              this.state.timePeriods.map((p, index) => (
                <Row type="flex" className="time-period-row"  key={index} align={"middle"}>
                  <Col span={5}>
                    <TimePeriod from={p.from} to={p.to} onChange={(from, to) => {
                      this.onTimePeriodChange(index, from, to);
                    }}/>
                  </Col>
                  <Col span={5}>
                    {index > 0 &&
                    <Icon name={"cif-close time-close-icon"} onClick={(e) => {
                      e.preventDefault();
                      this.removePeriod(index);
                    }} />
                    }
                  </Col>
                </Row>
              ))
              }
              {!this.state.allTime &&
              <a onClick={this.addPeriod.bind(this)}><Translate value="Add new period"/>+</a>
              }
            </Col>
          </Row>
          <Row type="flex" align="middle">
            <RaisedButton
              onClick={this.handleBack.bind(this)}
              label={<Translate value="Back"/>}
              primary={false}
              className="button-back-step"
              icon={<Icon name={"cif-arrowleft-4"} className={"back-arrow"}/>}
            />
            <RaisedButton
              onClick={this.handleSubmit.bind(this)}
              label={<Translate value="Next Step"/>}
              primary={true}
              className="button-next-step"
              icon={<Icon name="cif-arrow-left" className={"arrow-next-step"}/>}
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
  };
}

export default Form.create()(withRouter(NamingComponent as any));
