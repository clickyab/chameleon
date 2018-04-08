import * as React from "react";
import DatePicker2 from "react-datepicker-cy/src";
import "./style.less";
import * as moment from "moment-jalaali";
import MonthComboBox from "./MonthComboBox" ;
import YearComboBox from "./YearComboBox" ;

/**
 * @interface IProps
 */
interface IProps {
  onChange?: (value: string) => void;
  value?: string;
  minValue?: string;
  open?: boolean;
  disableBefore?: boolean;
}

/**
 * @interface IState
 */
interface IState {
  value?: string;
  minValue?: string;
  open?: boolean;
  firstValue: string;
  disableBefore?: boolean;
}

/**
 * Datepicker with shamsi calendar
 *
 * @desc This calendar made with shamsi calendar but need improvement
 *
 * @class
 */
export default class PersianDatePicker extends React.Component<IProps, IState> {
  /**
   * @constructor
   *
   * @param {IProps} props
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      value: (props.value ? props.value : null),
      firstValue: props.value ? props.value : null,
      minValue: props.minValue ? props.minValue : null,
      open: props.open ? props.open : null,
      disableBefore: props.disableBefore ? props.disableBefore : false,
    };
  }

  componentDidMount() {
    let date = moment();
    this.props.onChange(date.format());
  }

  componentWillReceiveProps(nextProps) {
    let minVal = new Date(nextProps.minValue);
    let val = new Date(this.state.value);
      this.setState(
        function (prevState, props) {
          if ((nextProps.minValue !== prevState.minValue) && minVal.getTime() > val.getTime()) {
            return {value: nextProps.minValue, minValue: nextProps.minValue};
          }
          if ((nextProps.minValue !== prevState.minValue)) {
            return { minValue: nextProps.minValue};
          }
        }
      );
  }
  onChange(date: moment.Moment) {
    if (date.format() !== moment(this.state.value).format()) {
      this.props.onChange(date.format());
      this.setState({
        value: date.format(),
      });
    }
  }
  /**
   * @func change open status
   *
   * @desc Used to implement some action if datepicker is open or not
   *
   * @param status
   *
   */
  private setOpen(status) {
    this.setState({
      open: status,
    });
  }

  private setMonth(month) {
    this.setState( {
      value: moment(this.state.value).jMonth(parseInt(month)),
    } , () => {
      this.props.onChange(this.state.value);
    });
  }

  private setYear(year) {
    this.setState({
      value: moment(this.state.value).jYear(parseInt(year)),
    } , () => {
      this.props.onChange(this.state.value);
    });
  }

  private handleMinMonth(): number {
    if (this.state.minValue) {
      if (moment(this.state.minValue).jYear() === moment(this.state.value).jYear()) {
        return moment(this.state.minValue).jMonth();
      }
      else if (moment(this.state.minValue).jYear() > moment(this.state.value).jYear()) {
        return 11;
      }
      else if (moment(this.state.minValue).jYear() < moment(this.state.value).jYear()) {
        return 0;
      }
      }
    else if (this.state.disableBefore) {
      if (moment(this.state.firstValue).jYear() === moment(this.state.value).jYear()) {
        return moment(this.state.firstValue).jMonth();
      }
      else if (moment(this.state.firstValue).jYear() > moment(this.state.value).jYear()) {
        return 11;
      }
      else if (moment(this.state.firstValue).jYear() < moment(this.state.value).jYear()) {
        return 0;
      }
    }
    return 0;
  }
  public render() {
    moment.loadPersian({dialect: "persian-modern", usePersianDigits: false});
    return (
      <div className="persian-datepicker">
        {this.state.open &&
        <div className={"date-combo-wrapper"}>
          <MonthComboBox month={moment(this.state.value).jMonth()}
                         min={this.handleMinMonth()}
                         onChange={(month) => this.setMonth(month)}/>
          <YearComboBox year={moment(this.state.value).jYear()}
                        min={moment(this.state.minValue).jYear()}
                        onChange={(year) => this.setYear(year)}/>
        </div>
        }
        <DatePicker2 defaultValue={this.state.value ? moment(this.state.value) : null} isGregorian={false}
                     timePicker={false}
                     min={moment(this.state.minValue)}
                     value={(this.state.value ? moment(this.state.value) : null)}
                     onChange={this.onChange.bind(this)}
                     inputFormat="jYYYY/jM/jDD"
                     calendarClass={"persian-calendar"}
                     onOpen={value => this.setOpen(value)}
                     datePickerClass={"datepicker-popup"}
                     tetherAttachment={"top right"}
                     inputReadOnly={true}
        />
        {/*<DatePicker value={this.state.value ? moment(this.state.value) : null}*/}
        {/*onChange={this.onChange.bind(this)} />*/}
      </div>
    );
  }
}
