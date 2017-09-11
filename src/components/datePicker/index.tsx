import * as React from "react";
import DatePicker2 from "react-datepicker2";
import "./style.less";
import {Moment} from "moment";

/**
 * @interface IProps
 */
interface IProps {
  onChange: (value: Moment) => void;
}

/**
 * Datepicker with shamsi calendar
 *
 * @desc This calendar made with shamsi calendar but need improvement
 *
 * @class
 */
export default class PersianDatePicker extends React.Component<IProps> {
  /**
   * @constructor
   *
   * @param {IProps} props
   */
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <div className="persian-datepicker">
        <DatePicker2 isGregorian={false} timePicker={false} onChange={this.props.onChange} inputFormat="jYYYY-jMM-jDD"/>
      </div>
    );
  }
}
