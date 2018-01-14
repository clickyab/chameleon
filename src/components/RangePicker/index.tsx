import * as React from "react";
import {Calendar} from "react-datepicker2";
import "./style.less";
import * as moment from "moment-jalaali";
import I18n from "../../services/i18n/index";
import Translate from "../i18n/Translate";
import {Moment} from "moment";

interface IProps {
    onChange?: (value: IRangeObject) => void;
    value?: IRangeObject | string;
}

interface IState {
    value: IRangeObject ;
    selectedDay: any;
    currentMonth: moment.type;
    enterSecond: boolean;
    isGregorian: boolean;
}

export enum rangeType { TODAY, CUSTOM }

export interface IRangeObject {
    range: {
        from: moment.type;
        to: moment.type;
    };
    type: rangeType;
}

class RangePicker extends React.Component<IProps, IState> {
    private i18n = I18n.getInstance();

    constructor(props) {
        super(props);
        this.state = {
            value: props.value ? props.value : moment(),
            selectedDay: [],
            currentMonth: moment(props.value),
            isGregorian: props.isGregorian ? props.isGregorian : false,
            enterSecond: false,
        };
    }

    onChange(date: moment.Moment) {
        if (date.toISOString() !== moment(this.state.value).toISOString()) {
            this.setState({
                value: date.toISOString(),
            });
        }
    }

    /**
     * @func syncSelectedDay
     * @desc synchronise days between two calendar
     * @param days
     */
    private syncSelectedDay(days) {
        this.setState({selectedDay: days ,
            value: {
                range: {
                    from: days.selectedDayArray[0],
                    to: days.selectedDayArray[1]
                },
                type: rangeType.CUSTOM,
            }});
        this.props.onChange({
            range: {
                from: days.selectedDayArray[0],
                to: days.selectedDayArray[1]
            },
            type: rangeType.CUSTOM,
        });
    }

    /**
     * @func onNextMonth
     * @desc add one month to current month (Support gregorian and jalaali)
     * @param date
     */
    private onNextMonth(date) {
        const {isGregorian} = this.state;
        const monthFormat = isGregorian ? "month" : "jMonth";
        let currentMonth = this.state.currentMonth;
        this.setState({
            currentMonth: moment(currentMonth).add(1, monthFormat)
        });
    }

    /**
     * @func onPrevMonth
     * @desc subtract one month to current month (Support gregorian and jalaali)
     * @param date
     */
    private onPrevMonth(date) {
        const {isGregorian} = this.state;
        const monthFormat = isGregorian ? "month" : "jMonth";
        let currentMonth = this.state.currentMonth;
        this.setState({
            currentMonth: moment(currentMonth).subtract(1, monthFormat)
        });
    }

    private dateFormatter() {
        let days = [];
        (this.state.value.range.from) ? days[0] = (this.state.value.range.from) : "";
        (this.state.value.range.to) ? days[1] = (this.state.value.range.to) : "";
        this.setState({selectedDay: [...days]});
    }
    componentDidMount() {
      this.dateFormatter();
    }

    /**
     * @func setRange
     * @desc setRange for calendar
     * @param days
     */
    private setRange(days, rangeType?: rangeType) {

        this.props.onChange({
            range: {
                from: days[0],
                to: days[1],
            },
            type: rangeType,
        });

        this.setState({
            value: {
                range: {
                    from: days[0],
                    to: days[1],
                },
                type: rangeType,
            },
            selectedDay: [...days],
            currentMonth: days[0]
        });
    }


    /**
     * @func handleMouseEnter
     * @desc set flag after mouse enter return true of false
     * @param status
     */
    private handleMouseEnter(status) {
        this.setState({enterSecond: status});
    }

    private renderMonth(date) {
        let monthName ;
        if (!this.state.isGregorian) {
            let month = date.jMonth();
            switch (month) {
                case 0:
                    monthName = this.i18n._t("farvardin");
                    break;
                case 1:
                    monthName = this.i18n._t("ordibehesht");
                    break;
                case 2:
                    monthName = this.i18n._t("khordad");
                    break;
                case 3:
                    monthName = this.i18n._t("tir");
                    break;
                case 4:
                    monthName = this.i18n._t("mordad");
                    break;
                case 5:
                    monthName = this.i18n._t("shahrivar");
                    break;
                case 6:
                    monthName = this.i18n._t("mehr");
                    break;
                case 7:
                    monthName = this.i18n._t("aban");
                    break;
                case 8:
                    monthName = this.i18n._t("azar");
                    break;
                case 9:
                    monthName = this.i18n._t("dey");
                    break;
                case 10:
                    monthName = this.i18n._t("bahman");
                    break;
                case 11:
                    monthName = this.i18n._t("esfand");
                    break;
            }
        }
        return <div className="header-month-name">{monthName}</div>;
    }
    render() {
        moment.loadPersian({dialect: "persian-modern", usePersianDigits: false});
        const {selectedDay, currentMonth} = this.state;

        const {isGregorian} = this.state;
        const monthFormat = isGregorian ? "month" : "jMonth";

        return (
            <div className="wrapper-all-rangePicker">
                <div className="header-rangePicker">
                    <div className="header-column">
                        <Translate value={"end Date:"}/>
                        <input className="date-input" type="text" value={((this.state.value).range).to ? moment(((this.state.value).range).to).format("jYYYY/jM/jD") : ""}/>
                    </div>
                    <div className="header-column right">
                        <Translate value={"start Date:"}/>
                        <input className="date-input" type="text" value={((this.state.value).range).from ? moment(((this.state.value).range).from).format("jYYYY/jM/jD") : ""}/>
                    </div>
                    <div className="filter-header"><Translate value={"shortcuts"}/></div>
                </div>
                <div className="rangePicker">
                    <div className="rangePickersWrapper">
                        <div className="wrapRangePicker">
                            <div className="calendar-wrapper first">
                            {this.renderMonth(moment(this.state.currentMonth))}
                            <Calendar isGregorian={false}
                                      defaultMonth={this.state.currentMonth}
                                      inputFormat="jYYYY/jM/jDD"
                                      calendarClass={"persian-calendar-range first-picker"}
                                      onNextMonth={(value) => this.onNextMonth(value)}
                                      onPrevMonth={(value) => this.onPrevMonth(value)}
                                      isRange={true}
                                      syncSelectedDay={this.syncSelectedDay.bind(this)}
                                      selectedDayArray={(!!this.state.selectedDay.selectedDayArray) ? this.state.selectedDay.selectedDayArray : this.state.selectedDay}
                                      firstCal={true}
                                      secondHover={this.state.enterSecond}
                            />
                            </div>
                            <div className="calendar-wrapper second">
                            {this.renderMonth(moment(this.state.currentMonth).add(1, "month"))}
                            <Calendar isGregorian={false}
                                      defaultMonth={moment(this.state.currentMonth).add(1, "month")}
                                      inputFormat="jYYYY/jM/jDD"
                                      calendarClass={"persian-calendar-range second-picker"}
                                      onNextMonth={(value) => this.onNextMonth(value)}
                                      onPrevMonth={(value) => this.onPrevMonth(value)}
                                      isRange={true}
                                      syncSelectedDay={this.syncSelectedDay.bind(this)}
                                      selectedDayArray={(!!this.state.selectedDay.selectedDayArray) ? this.state.selectedDay.selectedDayArray : this.state.selectedDay}
                                      onMouseEnterProp={this.handleMouseEnter.bind(this)}
                                      secondHover={this.state.enterSecond}
                            />
                            </div>
                        </div>
                        <div className="rangePickerFooter">
                            <div className="submit-btn"><Translate value={"submit"}/></div>
                            <div className="cancel-btn"><Translate value={"cancel"}/></div>
                        </div>
                    </div>
                    <div className="filters" key={Math.random()}>
                        <div className="date-filter">
          <span onClick={() => {
              this.setRange([moment(), moment()], rangeType.TODAY);
          }}>
            <Translate value={"today"}/>
          </span>
                        </div>
                        <div className="date-filter">
          <span onClick={() => {
              this.setRange([moment().subtract(1, "days"), moment().subtract(1, "days")], rangeType.CUSTOM);
          }}><Translate
              value={"yesterday"}/></span>
                        </div>
                        <div className="date-filter">
          <span onClick={() => {
              this.setRange([moment().subtract(6, "days"), moment()], rangeType.CUSTOM);
          }}>
            <Translate value={"last week"}/></span>
                        </div>
                        <div className="date-filter">
          <span
              onClick={() => {
                  this.setRange([moment().startOf(monthFormat), moment()], rangeType.CUSTOM);
              }}>
            <Translate value={"current month"}/></span>
                        </div>
                        <div className="date-filter">
          <span
              onClick={() => {
                  this.setRange([moment().subtract(1, monthFormat).startOf(monthFormat), moment().subtract(1, monthFormat).endOf(monthFormat)], rangeType.CUSTOM);
              }}>
            <Translate value={"last month"}/></span>
                        </div>
                        <div className="date-filter">
          <span onClick={() => {
              this.setRange([moment().subtract(2, monthFormat).startOf(monthFormat), moment()], rangeType.CUSTOM);
          }}>
            <Translate value={"last tree month"}/></span>
                        </div>
                    </div>
                </div>
            </div>);
    }
}

export default RangePicker;
