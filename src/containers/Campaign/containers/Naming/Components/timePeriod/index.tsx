import * as React from "react";
import {Row, Col, Select, Button} from "antd";
import "./style.less";
import Translate from "../../../../../../components/i18n/Translate";

const Option = Select.Option;

interface IProps {
  from?: string;
  to?: string;
  onChange: (from, to) => void;
}

interface IState {
  from: string;
  to: string;
}

export default class TimePeriod extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      to: props.to ? props.to : `23`,
      from: props.from ? props.from : `0`,
    };
    this.props.onChange(this.state.from, this.state.to);
  }

  componentWillReceiveProps(newProps: IProps) {
    if (newProps.from && newProps.to) {
      this.setState({
        from: newProps.from,
        to: newProps.to,
      });
    }
  }

  renderOptions(to: boolean) {

    if (!this.state.to) {
      return [];
    }

    let options = [];
    for (let i = 0; i < 24; i++) {
      options.push(<Option key={i} disabled={to ? (i < parseInt(this.state.from) ) : (i > parseInt(this.state.to))}
                           value={i.toString()}>{(`0` + i.toString()).toString().slice(-2)}:{to ? `59` : `00`}</Option>);
    }
    return options;
  }

  handleChangeFrom(value) {
    this.setState({
      from: value,
    }, () => {
      this.props.onChange(this.state.from, this.state.to);
    });
  }

  handleChangeTo(value) {
    this.setState({
      to: value,
    }, () => {
      this.props.onChange(this.state.from, this.state.to);
    });
  }

  render() {
    return (
      <Row type="flex">
        <Col className="time-period">
          <div className="text-center"><Translate value={"start time"}/></div>
          <Select dropdownClassName={"time-period-dropdown"} value={this.state.from.toString()} onChange={this.handleChangeFrom.bind(this)}>
            {this.renderOptions(false)}
          </Select>
        </Col>
        <Col className="time-period">
          <div className="text-center"><Translate value={"end time"}/></div>
          <Select  dropdownClassName={"time-period-dropdown"} value={this.state.to.toString()} onChange={this.handleChangeTo.bind(this)}>
            {this.renderOptions(true)}
          </Select>
        </Col>
      </Row>
    );
  }
}
