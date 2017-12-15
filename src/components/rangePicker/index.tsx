import * as React from "react";
import {Calendar} from "react-datepicker2";
import DatePicker2 from "react-datepicker2";
import {toEnglishDigits} from "react-datepicker2";
import "./style.less";
import * as moment from "moment-jalaali";

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
    constructor(props) {
        super(props);
        this.state = {
            value: props.value ? props.value : moment().toISOString(),
            selectedDay: [],
            currentMonth: moment(props.value),
            isGregorian : false,
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
    private start_at_onChange(is_min_month) {
        const {isGregorian} = this.state;
        const monthFormat = isGregorian ? "Month" : "jMonth";
        const dateFormat = isGregorian ? "YYYY/M/D" : "jYYYY/jM/jD";
        return (event) => {
            if (is_min_month) {
                const currentMonth = moment(toEnglishDigits(event.target.value), dateFormat);
                if (currentMonth.isValid()) {
                    this.setState({currentMonth});
                } else {
                    this.setState({currentMonth: moment()});
                }
            } else {
                const currentMonth = moment(toEnglishDigits(event.target.value), dateFormat);
                if (currentMonth.isValid()) {
                    this.setState({currentMonth: currentMonth.subtract(1, monthFormat)});
                } else {
                    this.setState({currentMonth: moment()});
                }
            }
        };
    }

    private syncSelectedDay(state) {
        this.setState({selectedDay: state});
    }

    private onNextMonth(date) {
        const {isGregorian} = this.state;
        const monthFormat = isGregorian ? "month" : "jMonth";
        let currentMonth = this.state.currentMonth;
        this.setState({currentMonth: moment(currentMonth).add(1, monthFormat)
        });
    }

    private onPrevMonth(date) {
        const {isGregorian} = this.state;
        const monthFormat = isGregorian ? "month" : "jMonth";
        let currentMonth = this.state.currentMonth;
        this.setState({currentMonth: moment(currentMonth).subtract(1, monthFormat)
        });
    }
    private onClick(days) {
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

    private handleMouseEnter(status) {
        this.setState({ enterSecond: status });
    }
    private dismiss() {
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
                    <div className="rangePickerButton" onClick={this.getRange}>ثبت</div>
                    <div className="rangePickerButton" onClick={this.dismiss}>انصراف</div>
                </div>
            </div>
            <div className="filters" key={Math.random()}>
                <div className="filter-header">میانبر سریع</div>
                <div className="date-filter">
                    <span onClick={this.onClick([moment(), moment()])}>امروز</span>
                </div>
                <div className="date-filter">
                    <span onClick={this.onClick([moment().subtract(1, "days") , moment().subtract(1, "days")])}>دیروز</span>
                </div>
                <div className="date-filter">
                    <span onClick={this.onClick([moment().subtract(6, "days"), moment()])}>۷ روز گذشته</span>
                </div>
                <div className="date-filter">
                        <span
                            onClick={this.onClick([moment().startOf("jMonth"), moment().endOf("jMonth")])}>این ماه</span>
                </div>
                <div className="date-filter">
                    <span onClick={this.onClick([moment().subtract(1, "jMonth"), moment()])}>ماه گذشته</span>
                </div>
                <div className="date-filter">
                    <span onClick={this.onClick([moment().subtract(2, "jMonth").startOf("jMonth"), moment()])}>سه ماه اخیر</span>
                </div>
                {console.log("day" , this.state.selectedDay)}
            </div>
        </div>);
    }
}

export default RangePicker;