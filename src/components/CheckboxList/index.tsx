/**
 *  @file Checkbox List
 *  @description list of checkboxes
 */
import * as React from "react";
import {Row, Col} from "antd";
import {Checkbox} from "antd";
import "./style.less";

/**
 * @interface ICheckboxItem
 */
export interface ICheckboxItem {
  title: string;
  value: string | number;
}

/**
 * @interface IProps
 */
interface IProps {
  items: ICheckboxItem[];
  value: (string | number)[];
  onChange: (selectedValues: (string | number)[], selectedItems: ICheckboxItem[]) => void;
}

/**
 * @interface IState
 */
interface IState {
  value: (string | number)[];
}

export default class CheckBoxList extends React.Component<IProps, IState> {

  /**
   * Set initial values
   * @param {IProps} props
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      value: this.props.value ? this.props.value : [],
    };
  }

  /**
   * Update selected values and call onChangeProps
   * @param {ICheckboxItem} item
   * @param checked
   */
  private update(item: ICheckboxItem, checked) {

    let values = this.state.value;
    let indexOfValue: number = values.indexOf(item.value);
    if (indexOfValue === -1 && checked) {
      values = [...this.state.value, item.value];
      this.setState({
        value: values,
      });
    } else if (indexOfValue > -1) {
      values.splice(indexOfValue, 1);
      this.setState({
        value: values,
      });
    }

    if (this.props.onChange) {
      this.props.onChange(values, this.props.items.filter(m => (values.indexOf(m.value) > -1)));
    }
  }

  /**
   * Update state with new props
   * @param {IProps} props
   */
  public componentWillReceiveProps(props: IProps) {
    this.setState({
      value: props.value,
    });
  }

  /**
   * render items and component
   * @returns {any}
   */
  render() {
    return (
      <Row type="flex" className="checkbox-list-container">
        {this.props.items.length === 0 && <span>No Item</span>}
        {this.props.items.map((item, index) => (
          <Col key={index}>
            <Checkbox
              value={item.value}
              className={(this.state.value.indexOf(item.value) > -1) ? "checkbox-list-checked" : "checkbox-list" }
              checked={this.state.value.indexOf(item.value) > -1}
              onChange={(e) => {
                this.update(e.target as any, e.target.checked);
              }}
            >{item.title}</Checkbox>
          </Col>
        ))}
      </Row>
    );
  }
}
