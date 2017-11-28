import * as  React from "react";
import {Select} from "antd";

const Option = Select.Option;

/**
 * @type {JSON}
 * @desc for iteration and check condition purpose
 */
const Months = {
  "jalaali":
    [
      { "value": 0 , "title" : "فروردین"},
      { "value": 1 , "title" : "اردیبهشت"},
      { "value": 2 , "title" : "خرداد"},
      { "value": 3 , "title" : "تیر"},
      { "value": 4 , "title" : "مرداد"},
      { "value": 5 , "title" : "شهریور"},
      { "value": 6 , "title" : "مهر"},
      { "value": 7 , "title" : "آبان"},
      { "value": 8 , "title" : "آذر"},
      { "value": 9 , "title" : "دی"},
      { "value": 10 , "title" : "بهمن"},
      { "value": 11 , "title" : "اسفند"}
    ]
};

/**
 * @interface IProps
 */
interface IProps {
  month: number ;
  min?: number ;
  onChange?: (value: number | string) => void ;
}

/**
 * @interface IState
 */
interface IState {
  month: number ;
  min: number ;
}

/**
 * MonthComboBox on Datepicker
 * @desc This class Create dynamic month combobox for picking month on datepicker
 *
 * @class
 *
 * @return {JSX} return text field with changeable status of months
 *
 */
class MonthCombobox extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      month: props.month ? props.month : "0",
      min: props.min ? props.min : 0 ,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      month : nextProps.month,
      min   : nextProps.min
    });
  }

  /**
   * @func change month & set onChange for component
   *
   * @param value
   *
   */
  private MonthChange(value) {
    this.setState({
      month : value
    });
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }


  render() {
    return(
      <Select onChange={this.MonthChange.bind(this)}
              value={this.state.month.toString()}
              className={"ignore--click--outside date-combo month-combo"}
              dropdownClassName={"ignore--click--outside date-drop-down"}
      >
        {Months.jalaali.map((month , index) => {
          if (month.value >= this.state.min) {
            return (<Option key={index} value={month.value.toString()}>{month.title}</Option>) ;
          }
          else {
            return (<Option key={index} value={month.value.toString()} disabled={true} >{month.title}</Option>) ;
          }
        })}
      </Select>
    ) ;
  }
}
export default MonthCombobox;
