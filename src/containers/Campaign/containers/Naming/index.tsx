import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {setCurrentCampaign, setCurrentStep, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {RootState} from "../../../../redux/reducers/index";
import STEPS from "../../steps";
import {Col, Form, notification, Row, Spin, Input , Select} from "antd";
import RadioButtonGroup from "material-ui/RadioButton/RadioButtonGroup";
import RadioButton from "material-ui/RadioButton";
import I18n from "../../../../services/i18n/index";
import Translate from "../../../../components/i18n/Translate/index";
import Icon from "../../../../components/Icon";
import CONFIG from "../../../../constants/config";
import PersianDatePicker from "../../../../components/datePicker/index";
import Tooltip from "../../../../components/Tooltip/index";
import {CAMPAIGN_STATUS} from "../Type/index";
import "./style.less";
import {
    ControllersApi,
    ControllersCreateCampaignPayload,
    ControllersCampaignGetResponse,
    ControllersCampaignBase, ControllersCampaignBaseSchedule, ControllersBaseResultSchedule,
} from "../../../../api/api";
import TimePeriod from "./Components/timePeriod/index";
import {setBreadcrumb} from "../../../../redux/app/actions/index";
import StickyFooter from "../../components/StickyFooter";
import InputLimit from "../../components/InputLimit/InputLimit";
import moment = require("moment");
import {isValidDomain} from "../../../../services/Utils/CustomValidations";

const FormItem = Form.Item;
const Option  = Select.Option;

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
    allDay: boolean;
    allTime: boolean;
    status: CAMPAIGN_STATUS;
    currentCampaign: ControllersCampaignGetResponse;
    tld: string;
    schedule ?: ControllersBaseResultSchedule;
    timePeriods: any[];
    minRange: string;
}

@connect(mapStateToProps, mapDispatchToProps)
class NamingComponent extends React.Component <IProps, IState> {

    private i18n = I18n.getInstance();

    constructor(props: IProps) {
        super(props);
        this.state = {
            allDay: true,
            allTime: true,
            status: props.currentCampaign && props.currentCampaign.status === CAMPAIGN_STATUS.START ? CAMPAIGN_STATUS.START : CAMPAIGN_STATUS.PAUSE,
            tld: props.currentCampaign && props.currentCampaign.tld ? props.currentCampaign.tld as string : "",
            currentCampaign: props.currentCampaign && props.currentCampaign.id === this.props.match.params.id ? props.currentCampaign : null,
            timePeriods: [{from: 0, to: 23}],
            minRange: null,
        };
    }

    public componentDidMount() {
        this.props.setCurrentStep(STEPS.NAMING);
        this.props.setBreadcrumb("naming", this.i18n._t("Naming").toString(), "campaign");
        if (this.props.match.params.id) {
            this.props.setSelectedCampaignId(this.props.match.params.id);
            const api = new ControllersApi();
            api.campaignGetIdGet({id: this.props.match.params.id})
                .then((campaign) => {
                    this.props.setCurrentCampaign(campaign as ControllersCampaignGetResponse);
                    let timePeriods = this.parseTimePeriodToState(campaign.schedule);
                    this.props.setBreadcrumb("campaignTitle", campaign.title, "naming");
                    this.setState({
                        currentCampaign: campaign,
                        allDay: !campaign.end_at,
                        allTime: (timePeriods.length === 0 || timePeriods.length === 1 && timePeriods[0].from === 0 && timePeriods[0].to === 23),
                        timePeriods,
                    }, this.setStateForTimePeriods);
                });
        } else {
            this.props.setSelectedCampaignId(null);
            this.setStateForTimePeriods();
        }
    }

    private parseTimePeriodToState(schedule: ControllersBaseResultSchedule ) {
        let parsedSchedule = [];
        if (schedule) {
          Object.keys(schedule)
            .map((key, index) => {
              if (schedule[key] !== null && schedule[key] !== "") {
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
        }
          return parsedSchedule;
    }

    private setStateForTimePeriods() {
        let schedule: ControllersBaseResultSchedule = {};
        for (let i = 0; i <= 23; i++) {
            if (this.state.timePeriods.length !== 0) {
                schedule[`h` + (`0` + i).slice(-2)] = "";
            }
            else {
                schedule[`h` + (`0` + i).slice(-2)] = "0";
            }
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
        this.setState({
            timePeriods: periods,
        });
    }

    private handleChangeStatus(status: CAMPAIGN_STATUS) {
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
                    message: this.i18n._t("Submit failed!").toString(),
                    className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                    description: this.i18n._t("Please check all fields and try again!").toString(),
                });
                return;
            }

            let campaign: ControllersCreateCampaignPayload = this.state.currentCampaign as ControllersCreateCampaignPayload;
            campaign.title = values.name;
            campaign.start_at = values.start_at;
            campaign.tld = values.domain;

            if (this.state.allDay) {
                campaign.end_at = null;
            } else {
                campaign.end_at = values.end_at;
            }

            campaign.schedule = this.state.schedule as ControllersCampaignBaseSchedule;

            const controllerApi = new ControllersApi();

            if (this.props.match.params.id) {
                controllerApi.campaignBaseIdPut({
                    id: this.state.currentCampaign.id.toString(),
                    payloadData: campaign as ControllersCampaignBase,
                }).then(data => {
                    this.props.setCurrentCampaign(data as ControllersCampaignGetResponse);
                    this.props.history.push(`/campaign/targeting/${data.id}`);
                    this.props.setCurrentStep(STEPS.TARGETING);
                    notification.success({
                        message: this.i18n._t("Campaign updated successfully"),
                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                        description: "",
                    });
                }).catch((error) => {
                    notification.error({
                        message: this.i18n._t("Campaign update failed!"),
                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                        description: error.message,
                    });
                });
            } else {
                controllerApi.campaignCreatePost({
                    payloadData: campaign,
                }).then(data => {
                    this.props.setSelectedCampaignId(data.id);
                    this.props.setCurrentCampaign(data as ControllersCampaignGetResponse);
                    this.props.history.push(`targeting/${data.id}`);
                }).catch((error) => {
                    notification.error({
                        message: this.i18n._t("Create campaign failed!"),
                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                        description: error.message,
                    });
                });
            }

        });
    }

    private handleBack() {
        this.props.setCurrentStep(STEPS.TYPE);
        if (this.props.match.params.id) {
            this.props.history.push(`/campaign/type/${this.props.match.params.id}`);
        }
        else {
            this.props.history.push("/campaign/type");
        }
    }

    /**
     * @function handle minRange for second calendar
     * @desc get and set minimum date of second calendar, also check if date was set to higher one
     * @param date
     */
    private handleRange(date: string): void {
        this.setState({
            minRange: date,
        });
    }

    public render() {

        if (this.props.match.params.id && !this.state.currentCampaign) {
            return <Spin/>;
        }

        const {getFieldDecorator} = this.props.form;
        return (
            <div dir={CONFIG.DIR} className="campaign-content">
                <Row className="campaign-title">
                    <Col>
                        <h2><Translate value="Campaign Naming"/></h2>
                       <p><Translate value="Set configuration for ad name, period of time to show ad and ad's status:"/></p>
                    </Col>
                </Row>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Row type="flex" align="middle" className="mb-2">
                        <Col span={4} lg={3}>
                            <Tooltip/>
                            <label><Translate value={"Status"}/></label>
                        </Col>
                        <Col span={20} className="form-select-column">
                            <FormItem>
                                <Select className={"select-input status-input"}
                                             value={this.state.currentCampaign.status}
                                             dropdownClassName={"select-dropdown"}
                                             onChange={this.handleChangeStatus.bind(this)}>
                                    <Option key={`n_active`} value={CAMPAIGN_STATUS.START}><Translate value={"Active"}/></Option>
                                    <Option key={`n_inactive`} value={CAMPAIGN_STATUS.PAUSE}><Translate value={"Inactive"}/></Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" align="middle">
                        <Col span={4} lg={3} className="form-label">
                            <Tooltip/>
                            <label><Translate value={"Campaign Name"}/></label>
                        </Col>
                        <Col span={12}>
                            <FormItem>
                                {getFieldDecorator("name", {
                                    initialValue: this.state.currentCampaign.title,
                                    rules: [{
                                        required: true,
                                        min: 8,
                                        message: this.i18n._t("Please input your Campaign Name!(should contain minimum character of 8 )")
                                    }],
                                })(
                                    <InputLimit
                                        limit={100}
                                        placeholder={this.i18n._t("Your Campaign Name") as string}
                                        className="input-campaign"
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={5}>
                        </Col>
                    </Row>
                    <Row type="flex" align="middle" className={"mb-3"}>
                        <Col span={4} lg={3} className="form-label">
                            <Tooltip/>
                            <label><Translate value={"TLD Domain"}/></label>
                        </Col>
                        <Col span={12}>
                            <FormItem className="have-description">
                                {getFieldDecorator("domain", {
                                    initialValue: this.state.currentCampaign.tld,
                                    rules: [{
                                        validator: isValidDomain,
                                        message: this.i18n._t("Domain is not valid")
                                    }],
                                })(
                                    <Input
                                        placeholder={this.i18n._t("exp: mydomain.com") as string}
                                        className="input-campaign dir-ltr"
                                    />
                                )}
                            </FormItem>
                            <span className={"tld-description"}><Translate value={"Please enter domain of company that you are making campaign for. exp: mydomain.com"}/></span>
                        </Col>
                        <Col span={5}>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={4} lg={3} className="title-with-radio form-label">
                            <Tooltip/>
                            <label><Translate value={"Campaign Date"}/></label>
                        </Col>
                        <Col span={10}>
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
                            <Row type="flex" gutter={16} align="top">
                                <Col span={7}>
                                    <FormItem>
                                        {getFieldDecorator("start_at", {
                                            initialValue: this.state.currentCampaign.start_at,
                                            rules: [{
                                                required: true,
                                                message: this.i18n._t("Please select start date!")
                                            }],
                                        })(
                                            <PersianDatePicker onChange={this.handleRange.bind(this)}
                                                               minValue={moment().add(-1 , "day").format()}/>
                                        )}
                                        <span className="datepicker-placeholder"><Translate value={"YYYY/MM/DD"}/></span>
                                    </FormItem>
                                </Col>
                                {!this.state.allDay &&
                                <Col span={7}>
                                    <FormItem>
                                        {getFieldDecorator("end_at", {
                                            initialValue: this.state.currentCampaign.end_at ? this.state.currentCampaign.end_at
                                              : (this.state.currentCampaign.start_at > this.state.minRange) ? moment(this.state.currentCampaign.start_at).add(1, "day").format()
                                              : this.state.minRange,
                                            rules: [{
                                                required: true,
                                                message: this.i18n._t("Please select stop date!")
                                            }],
                                        })(
                                            <PersianDatePicker
                                                minValue={this.state.minRange}/>
                                        )}
                                        <span className="datepicker-placeholder"><Translate value={"YYYY/MM/DD"}/></span>
                                    </FormItem>
                                </Col>
                                }
                            </Row>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={4} lg={3} className="title-with-radio form-label">
                            <Tooltip/>
                            <label><Translate value={"Campaign Time"}/></label>
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
                                <Row type="flex" className="time-period-row" key={index} align={"middle"}>
                                    <Col span={8}>
                                        <TimePeriod className="time-period-float" first={index === 0} from={p.from} to={p.to} onChange={(from, to) => {
                                            this.onTimePeriodChange(index, from, to);
                                        }}/>
                                        {index > 0 &&
                                        <div className="close-time-period-wrapper">
                                        <Icon name={"cif-close time-close-icon"} onClick={(e) => {
                                            e.preventDefault();
                                            this.removePeriod(index);
                                        }}/>
                                        </div>
                                        }
                                    </Col>
                                </Row>
                            ))
                            }
                            {!this.state.allTime &&
                            <div className="add-time-period">
                                <Icon name={"cif-plusbold"}/>
                                <a onClick={this.addPeriod.bind(this)}><Translate
                                    value="Add new period"/></a>
                            </div>}
                        </Col>
                    </Row>
                    <StickyFooter nextAction={this.handleSubmit.bind(this)} backAction={this.handleBack.bind(this)} backBtn={true}/>
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
        setCurrentCampaign: (campaign: ControllersCampaignGetResponse) => dispatch(setCurrentCampaign(campaign)),
        setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
    };
}

export default Form.create()(withRouter(NamingComponent as any));
