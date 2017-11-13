import * as React from "react";
import DatePicker2 from "react-datepicker2";
import "./style.less";
import * as moment from "moment-jalaali";

/**
 * @interface IProps
 */
interface IProps {
  onChange?: (value: string) => void;
  value?: string;
}

/**
 * @interface IProps
 */
interface IState {
  value?: string;
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
      value: props.value ? props.value : null,
    };
  }

  componentDidMount() {
    let date = new Date(this.state.value);
    this.props.onChange(date.toISOString());
  }

  onChange(date: moment.Moment) {
    if (date.toISOString() !== moment(this.state.value).toISOString()) {
      this.props.onChange(date.toISOString());
      this.setState({
        value: date.toISOString(),
      });
    }
  }

  public render() {
    return (
      <div className="persian-datepicker">
        <DatePicker2 value={this.state.value ? moment(this.state.value) : null} isGregorian={false} timePicker={false}
                     onChange={this.onChange.bind(this)}
                     inputFormat="jYYYY/jMM/jDD"
        />
      </div>
    );
  }
}
