import * as React from "react";
import map from "./map";
import "./style.less";
import {Row, Col} from "antd";
import {Checkbox} from "material-ui";

/**
 * @interface IProps
 */
interface IProps {
  /**
   * @desc On change callback
   * @param {string[]} items
   * @returns {void}
   */
  onChange?: (items: string[]) => void;

  /**
   * @desc selected items array
   * @param {string[]}
   */
  value?: string[];
  /**
   * @param {string[]}
   */
  className?: string;
}

/**
 * @interface IState
 */
interface IState {
  /**
   * @desc hovered item
   * @param {string | null}
   */
  hoverItem: string | null;

  /**
   * @desc selected items array
   * @param {string[]}
   */
  selectedItems: string[];
}

export default class IranMap extends React.Component<IProps, IState> {
  /**
   * @constructor
   * @desc set initial state
   * @param props
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      hoverItem: null,
      selectedItems: this.props.value ? this.props.value : [],
    };

    /**
     * bind functions
     */
    this.mouseEnter = this.mouseEnter.bind(this);
    this.check = this.check.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.checkAll = this.checkAll.bind(this);
  }

  public componentWillReceiveProps(props) {
    this.setState({
      selectedItems: props.value ? props.value : [],
    });
  }

  /**
   * @func mouseEnter
   * @desc on mouse enter handler to set `hoverItem` in the state
   * @param {string} pathId
   */
  private mouseEnter(pathId: string) {
    this.setState({
      hoverItem: pathId,
    });
  }

  /**
   * @func mouseLeave
   * @desc on mouse leave handler to set `hoverItem` as `null` in the state
   * @param {string} pathId
   */
  private mouseLeave() {
    this.setState({
      hoverItem: null,
    });
  }

  /**
   * @func check
   * @desc check item handler to push or shift item form `selectedItems` in the state
   * @param {string} pathId
   */
  private check(pathId: string) {
    const indexOfItem = this.state.selectedItems.indexOf(pathId);
    if (indexOfItem === -1) {
      this.setState({
        selectedItems: [...this.state.selectedItems, pathId],
      });
      if (typeof this.props.onChange === "function") {
        this.props.onChange([...this.state.selectedItems, pathId]);
      }
    } else {
      let items = this.state.selectedItems;
      items.splice(indexOfItem, 1);
      this.setState({
        selectedItems: items,
      });
      if (typeof this.props.onChange === "function") {
        this.props.onChange(items);
      }
    }
  }

  /**
   * @func checkAll
   * @desc checkAll item handler to push all items in the `selectedItems` or erase items from `selectedItems` in the state
   */
  checkAll() {
    if (this.state.selectedItems.length === map.g.path.length) {
      this.setState({
        selectedItems: [],
      });
      this.props.onChange([]);
    } else {
      let items = map.g.path.map((p) => p.title);
      this.setState({
        selectedItems: items,
      }, () => {
        if (typeof this.props.onChange === "function") {
          this.props.onChange(this.state.selectedItems);
        }
      });
    }
  }

  render() {
    return (
      <Row type="flex">
        <Col className="city-selector">
          <div style={{overflowY: "auto", height: "500px"}} onMouseLeave={() => this.mouseLeave()}>
            <Checkbox
              className={(this.state.selectedItems.length === map.g.path.length) ? "all-city-selector-checked" : "all-city-selector"}
              checked={this.state.selectedItems.length === map.g.path.length}
              onCheck={() => this.checkAll()}
              onMouseLeave={() => this.mouseLeave()}
              onMouseEnter={() => this.mouseLeave()}
              label={"all"}/>
            {map.g.path.map((path) => {
              return <Checkbox
                key={path.title}
                checked={this.state.selectedItems.indexOf(path.title) > -1}
                onCheck={() => this.check(path.title)}
                style={{backgroundColor: this.state.hoverItem === path.title ? "#ccc" : ""}}
                onSelect={() => this.check(path.title)}
                onMouseLeave={() => this.mouseLeave()}
                onMouseEnter={() => this.mouseEnter(path.title)}
                label={path.title}
                className={(this.state.selectedItems.indexOf(path.title) > -1) ? "checkbox-checked" : "checkbox"}
              />;
            })}
          </div>
        </Col>
        <Col className="map-selector">
          <svg width={"500"} height={"500"} viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" version="1.1">
            <g id="map-graphic">
              {map.g.path.map((path) => {
                return <path
                  key={path.title}
                  onMouseLeave={() => this.mouseLeave()}
                  onMouseEnter={() => this.mouseEnter(path.title)}
                  onClick={() => this.check(path.title)}
                  className={`land ${this.state.hoverItem === path.title ? "selected" : ""} ${this.state.selectedItems.indexOf(path.title) > -1 ? "selected" : ""}`}
                  d={path.d}
                  xlinkTitle={path.title}/>;
              })}
            </g>
          </svg>
        </Col>
      </Row>
    );
  }
}
