import * as  React from "react";
import {Select} from "antd";
import * as moment from "moment-jalaali";

const Option = Select.Option;

interface IState {
  year: number ;
  min: number ;
  showBefore?: boolean;
  Years?: any;
}

interface IProps {
  year?: number ;
  min?: number ;
  onChange?: (value: number | string) => void ;
  showBefore?: boolean;
}

class YearCombobox extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      year: props.year ? props.year : moment().jYear(),
      min: props.min ? props.min : moment().jYear() ,
      showBefore: props.showBefore ? props.showBefore : false,
      Years: {
        "jalaali":
          [
            { "value": (props.year ? props.year : moment().jYear()) - 4},
            { "value": (props.year ? props.year : moment().jYear()) - 3},
            { "value": (props.year ? props.year : moment().jYear()) - 2},
            { "value": (props.year ? props.year : moment().jYear()) - 1},
            { "value": (props.year ? props.year : moment().jYear()) - 0},
            { "value": (props.year ? props.year : moment().jYear()) + 1},
            { "value": (props.year ? props.year : moment().jYear()) + 2},
            { "value": (props.year ? props.year : moment().jYear()) + 3},
            { "value": (props.year ? props.year : moment().jYear()) + 4},
          ]
      }
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        year : nextProps.year ,
        showBefore : nextProps.showBefore,
        Years: {
          "jalaali":
            [
              { "value": nextProps.year - 4},
              { "value": nextProps.year - 3},
              { "value": nextProps.year - 2},
              { "value": nextProps.year - 1},
              { "value": nextProps.year - 0},
              { "value": nextProps.year + 1},
              { "value": nextProps.year + 2},
              { "value": nextProps.year + 3},
              { "value": nextProps.year + 4},
            ]
        }
      }
      );
  }
  YearChange(value) {
    this.setState({
      year : value
    });
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }
  render() {
    return(
      <Select onChange={this.YearChange.bind(this)}
              value={this.state.year.toString()}
              className={"ignore--click--outside date-combo year-combo"}
              dropdownClassName={"ignore--click--outside date-drop-down"}
      >
        {this.state.Years.jalaali.map((year , index) => {
          if (year.value >= this.state.min) {
           return  <Option key={index} value={year.value.toString()}>{year.value}</Option>;
          }
          else if (this.props.showBefore) {
            return  <Option key={index} value={year.value.toString()}>{year.value}</Option>;
          }
        }
        )}
      </Select>
    ) ;
  }
}
export default YearCombobox;
