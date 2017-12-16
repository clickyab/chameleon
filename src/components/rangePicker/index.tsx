import * as React from "react";
import {Calendar} from "react-datepicker2";
import "./style.less";
import * as moment from "moment-jalaali";
import I18n from "../../services/i18n/index";
import Translate from "../i18n/Translate";

interface IProps {
    getRange: any;
    onChange?: (value: any) => void;
    value: string;
}
interface IState {
    value: string;
    selectedDay: any;
    currentMonth: moment.type;
    enterSecond: boolean;
    isGregorian: boolean;
}

class RangePicker extends React.Component<IProps , IState> {
    private i18n = I18n.getInstance();
    constructor(props) {
        super(props);
        this.state = {
            value: props.value ? props.value : moment().toISOString(),
            selectedDay: [],
            currentMonth: moment(props.value),
            isGregorian : props.isGregorian ? props.isGregorian : false,
            enterSecond : false,
        };
    }
    onChange(date: moment.Moment) {
        if (date.toISOString() !== moment(this.state.value).toISOString()) {
            this.props.onChange(date.toISOString());
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
        this.setState({selectedDay: days});
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
        this.setState({currentMonth: moment(currentMonth).add(1, monthFormat)
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
        this.setState({currentMonth: moment(currentMonth).subtract(1, monthFormat)
        });
    }
    /**
     * @func setRange
     * @desc setRange for calendar
     * @param days
     */
    private setRange(days) {
        return () => {
            return this.setState({
                selectedDay: [...days],
                currentMonth: days[0]
            });
        };
    }

     private getRange() {
        const {getRange} = this.props;

        if (getRange) {
            getRange(this.state);
        }
    }
    /**
     * @func handleMouseEnter
     * @desc set flag after mouse enter return true of false
     * @param status
     */
    private handleMouseEnter(status) {
        this.setState({ enterSecond: status });
    }

    render() {
        moment.loadPersian({dialect: "persian-modern", usePersianDigits: false});
        const {selectedDay, currentMonth} = this.state;

        const {isGregorian} = this.state;
        const monthFormat = isGregorian ? "month" : "jMonth";

        return (<div className="rangePicker">
            <div className="rangePickersWrapper">
                <div className="wrapRangePicker">
                    <Calendar    isGregorian={false}
                                 defaultMonth={this.state.currentMonth}
                                 inputFormat="jYYYY/jM/jDD"
                                 calendarClass={"persian-calendar-range"}
                                 onNextMonth={(value) => this.onNextMonth(value)}
                                 onPrevMonth={(value) => this.onPrevMonth(value)}
                                 isRange={true}
                                 syncSelectedDay={this.syncSelectedDay.bind(this)}
                                 selectedDayArray ={(!!this.state.selectedDay.selectedDayArray) ? this.state.selectedDay.selectedDayArray : this.state.selectedDay}
                                 firstCal={true}
                                 secondHover={this.state.enterSecond}
                    />
                    <Calendar    isGregorian={false}
                                 defaultMonth={moment(this.state.currentMonth).add(1 , "month")}
                                 inputFormat="jYYYY/jM/jDD"
                                 calendarClass={"persian-calendar-range"}
                                 onNextMonth={(value) => this.onNextMonth(value)}
                                 onPrevMonth={(value) => this.onPrevMonth(value)}
                                 isRange={true}
                                 syncSelectedDay={this.syncSelectedDay.bind(this)}
                                 selectedDayArray ={(!!this.state.selectedDay.selectedDayArray) ? this.state.selectedDay.selectedDayArray : this.state.selectedDay}
                                 onMouseEnterProp={this.handleMouseEnter.bind(this)}
                                 secondHover={this.state.enterSecond}
                    />
                </div>
                <div className="rangePickerFooter">
                    <div className="rangePickerButton" onClick={this.getRange}><Translate value={"submit"}/></div>
                    <div className="rangePickerButton"><Translate value={"cancel"}/></div>
                </div>
            </div>
            <div className="filters" key={Math.random()}>
                <div className="filter-header"><Translate value={"shortcuts"}/></div>
                <div className="date-filter">
                    <span onClick={this.setRange([moment(), moment()])}><Translate value={"today"}/></span>
                </div>
                <div className="date-filter">
                    <span onClick={this.setRange([moment().subtract(1, "days") , moment().subtract(1, "days")])}><Translate value={"yesterday"}/></span>
                </div>
                <div className="date-filter">
                    <span onClick={this.setRange([moment().subtract(6, "days"), moment()])}><Translate value={"last week"}/></span>
                </div>
                <div className="date-filter">
                        <span
                            onClick={this.setRange([moment().startOf(monthFormat), moment()])}><Translate value={"current month"}/></span>
                </div>
                <div className="date-filter">
                    <span onClick={this.setRange([moment().subtract(1, monthFormat).startOf(monthFormat), moment().subtract(1, monthFormat).endOf(monthFormat)])}><Translate value={"last month"}/></span>
                </div>
                <div className="date-filter">
                    <span onClick={this.setRange([moment().subtract(2, monthFormat).startOf(monthFormat), moment()])}><Translate value={"last tree month"}/></span>
                </div>
                {console.log("day" , this.state.selectedDay)}
            </div>
        </div>);
    }
}

export default RangePicker;