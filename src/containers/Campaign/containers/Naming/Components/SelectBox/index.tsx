/**
 * @file Select Box Item Component
 * @desc Create select item in a box style
 */
import * as React from "react";
import {Row, Col} from "antd";
import "./style.less";
import {isUndefined} from "util";


/**
 * @interface ISelectBoxItem
 * @desc selectBox item
 */
export interface ISelectBoxItem {
  value: number;
  title: string;
  description?: string;
  icon?: JSX.Element;
}

/**
 * @interface IProps
 * @desc component's props interface
 */
interface IProps {
  items: ISelectBoxItem[];
  onChange: (value: number) => {};
  initialSelect?: number;
  className?: string;
  span?: number;
  offset?: number;
}

/**
 * @interface IState
 * @desc component's states interface
 */
interface IState {
  selectedItem: null | ISelectBoxItem;
}

export default class SelectBox extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }
  componentWillMount() {
    const selectedItem = this.props.initialSelect !== null ? this.props.items.find((item) => (item.value === this.props.initialSelect)) : null;
    console.log(111, selectedItem, this.props.items.find((item) => (item.value === this.props.initialSelect)));
    this.setState({selectedItem});
  }

  /**
   * @func
   * @desc handle click of each box and call `onChange` prop.
   * @param {ISelectBoxItem} item
   */
  private handleClick(item: ISelectBoxItem) {
    this.setState({
      selectedItem: item,
    });
    this.props.onChange(item.value);
  }

  public render() {
    return (
      <Row type="flex" gutter={16} align="middle" justify="center">
        {this.props.items.map((item) => {
          return (
            <Col key={`s_${item.value}`} span={ (this.props.span) ? this.props.span : 4 } className={"select-box" + (this.props.className ? this.props.className : "")} >
              <div
                className={"center-select-box " + (this.state.selectedItem && this.state.selectedItem.value === item.value ? "active" : "")}
                onClick={() => {
                  this.handleClick(item);
                }}>
                <div className="middle">
                {item.icon && item.icon}
                <h6>{item.title}</h6>
                <p>{item.description}</p>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    );
  }
}
