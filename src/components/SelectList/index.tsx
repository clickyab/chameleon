import * as React from "react";
import {Row, Col} from "antd";
import {Checkbox, RaisedButton} from "material-ui";
import Translate from "../i18n/Translate/index";
import I18n from "../../services/i18n/index";
import "./style.less";

export interface IData {
  id: number;
  title: string;
}

interface IProps {
  data: IData[];
  selectedItems?: string[];
  value?: any[];
  onChange?: (value: any[]) => void ;
}

interface IState {
  value?: any;
  selectedItemsRight: (string|number)[];
  selectedRightTemp: (string|number)[];
  selectedItemsLeft?: (string|number)[];
  selectedLeftTemp?: (string|number)[];
}

export default class SelectList extends React.Component<IProps, IState> {
  /**
   * @constructor
   * @desc set initial state
   * @param props
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedItemsRight: this.props.selectedItems ? this.props.selectedItems : [],
      selectedRightTemp: this.props.selectedItems ? this.props.selectedItems : [],
      selectedLeftTemp: [],
      selectedItemsLeft: this.props.value ? this.props.value : [],
      value: this.props.value ? this.props.value : []
    };

    /**
     * bind functions
     */
    this.check = this.check.bind(this);
    this.checkAll = this.checkAll.bind(this);
    this.checkAllLeft = this.checkAllLeft.bind(this);
    this.handleSubmitRight = this.handleSubmitRight.bind(this);
    this.handleSubmitLeft = this.handleSubmitLeft.bind(this);
  }

  /**
   * @function showSelectedLeft
   *
   * @desc creates and shows selected items on left side select List
   *
   * @return {JSX.Element} Checkboxes returned
   */
  private showSelectedLeft() {
    return this.props.data.map((data) => {
      if (this.state.selectedItemsLeft.indexOf(data.id) > -1) {
        return <Checkbox key={data.id}
                         label={data.title}
                         checked={this.state.selectedLeftTemp.length  === this.state.selectedItemsLeft.length || this.state.selectedLeftTemp.indexOf(data.id) > -1 }
                         className={((this.state.selectedLeftTemp.indexOf(data.id)) > -1) ? "select-list-checkbox-selected" : "select-list-checkbox" }
                         onCheck={() => (this.checkLeft(data.id))}/>;
      }
    });
  }

  /**
   * @function createItem
   *
   * @desc create items from data that pass to component by property
   *
   * @return {JSX.Element} Checkboxes returned
   */
  private createItem() {
    let Data = this.props.data;
    return Data.map((data) => {
      if (!(this.state.selectedItemsLeft.indexOf(data.id) > -1)) {
      return <Checkbox key={data.id}
                       label={data.title}
                       className={((this.state.selectedRightTemp.indexOf(data.id) > -1 ) ? "select-list-checkbox-selected" : "select-list-checkbox")}
                       checked={this.state.selectedRightTemp.indexOf(data.id) > -1}
                       onCheck={() => this.check(data.id)}/>;
    }});
  }

  /**
   * @func check
   *
   * @desc Check the right side of selectList and hold them on temporary variable
   *
   * @param {string} Id
   *
   * @return {void}
   */
  private check(Id: string | number): void {
    const indexOfItem = this.state.selectedRightTemp.indexOf(Id);
    if (indexOfItem === -1) {
      this.setState({
        selectedRightTemp: [...this.state.selectedRightTemp, Id],
      });
    } else {
      let items = this.state.selectedRightTemp;
      items.splice(indexOfItem, 1);
      this.setState({
        selectedRightTemp: items,
      });
    }
  }

  /**
   * @func checkLeft
   *
   * @desc Check the left side of selectList and hold them on temporary variable
   *
   * @param {string} Id
   *
   * @return {void}
   */

  private checkLeft(Id: string | number) {
    const indexOfItem = this.state.selectedLeftTemp.indexOf(Id);
    if (indexOfItem === -1) {
      this.setState({
        selectedLeftTemp: [...this.state.selectedLeftTemp, Id],
      });
    } else {
      let items = this.state.selectedLeftTemp;
      items.splice(indexOfItem, 1);
      this.setState({
        selectedLeftTemp: items,
      });
    }
  }
  /**
   * @func checkAll
   *
   * @desc Check the All item in right side of select List
   *
   * @return {void}
   */
  checkAll(): void {
    if (this.state.selectedRightTemp.length + this.state.selectedItemsLeft.length === this.props.data.length) {
      this.setState({
        selectedRightTemp: [],
      });
    } else if (this.state.selectedItemsLeft.length === 0) {
      let items = this.props.data.map((data) => data.id);
      this.setState({
        selectedRightTemp: items,
      });
    }
    else {
      let items = [];
      for (let i = 0; i < this.props.data.length; i++) {
        if (!(this.state.selectedItemsLeft.indexOf(this.props.data[i].id) > -1)) {
          items.push(this.props.data[i].id);
        }
      }
      this.setState({
        selectedRightTemp: items,
      });
    }
  }

  checkAllLeft(): void {
    console.log(this.state);
    if (this.state.selectedLeftTemp.length  === this.state.selectedItemsLeft.length) {
      this.setState({
        selectedLeftTemp: [],
      });
    } else if (this.state.selectedLeftTemp.length === 0) {
      let items = this.state.selectedItemsLeft.filter(c => true);
      this.setState({
        selectedLeftTemp: items,
      });
    }
    else {
      let items = [];
      for (let i = 0; i < this.state.selectedItemsLeft.length; i++) {
        if (!(this.state.selectedItemsRight.indexOf(this.state.selectedItemsLeft[i]) > -1)) {
          items.push(this.state.selectedItemsLeft[i]);
        }
      }
      this.setState({
        selectedLeftTemp: items,
      });
    }
  }

  private handleSubmitRight() {
    let temp = this.state.selectedRightTemp;
    let save = this.state.selectedItemsLeft;
    if (temp.length !== 0 && this.state.selectedItemsLeft.length !== 0) {
      for (let i = 0; i < temp.length; i++) {
        save = [...save, temp[i]];
      }
      this.setState({selectedRightTemp: [], selectedItemsLeft: save , value: save});
      if (this.props.onChange) {
        this.props.onChange(save);
      }
    }
    else if (temp.length === 0) {
      return null;
    }
    else {
      this.setState({selectedItemsLeft: temp , value: temp, selectedRightTemp: []});
      if (this.props.onChange) {
        this.props.onChange(temp);
      }
    }
  }

  // Left Button Clicked
  private handleSubmitLeft() {
    if (this.state.selectedLeftTemp.length === 0) {
      let temp = this.state.selectedLeftTemp;
      this.setState({selectedItemsRight: temp, selectedLeftTemp: []});
    }
    else if (this.state.selectedItemsLeft.length === this.state.selectedLeftTemp.length) {
      this.setState({selectedItemsRight: [], selectedLeftTemp: [] , selectedItemsLeft: [] });
    }
    else {
      let temp = [];
      let RemoveTemp = this.state.selectedItemsLeft;
      for (let i = 0; i < this.state.selectedLeftTemp.length; i++) {
        if (this.state.selectedItemsLeft.indexOf(this.state.selectedLeftTemp[i]) > -1) {
          RemoveTemp.splice(this.state.selectedItemsLeft.indexOf(this.state.selectedLeftTemp[i]), 1);
          temp[i] = this.state.selectedLeftTemp[i];
        }
        this.setState({selectedItemsRight: temp, selectedItemsLeft: RemoveTemp, value: RemoveTemp, selectedLeftTemp: []});
        if (this.props.onChange) {
          this.props.onChange(RemoveTemp);
        }

      }
    }
  }

  render() {
    const i18n = I18n.getInstance();
    return (
      <Row type="flex" gutter={40}>
        <Col span={12} className="select-list">
          <div className="select-list-header">
            <Translate value="Brands List"/>
            <span className="count">{this.props.data.length - this.state.selectedItemsLeft.length}</span>
          </div>
          <Checkbox className={(this.state.selectedRightTemp.length + this.state.selectedItemsLeft.length  === this.props.data.length) ? "all-selector-select" : "all-selector"}
                    label={"Select all"}
                    checked={this.state.selectedRightTemp.length + this.state.selectedItemsLeft.length  === this.props.data.length}
                    onCheck={() => this.checkAll()}
                    onSelect={() => this.checkAll()}
          />
          <div className="select-list-right">
            {this.createItem()}
          </div>
          <RaisedButton
            label={<Translate value="Move chosen items"/>}
            primary={false}
            className="btn-select-list"
            fullWidth={true}
            onClick={this.handleSubmitRight}
          />
        </Col>
        <Col span={12} className="select-list select-list-left-container">
          <div className="select-list-header">
            <Translate value="Your final List"/>
            <span className="count">{this.state.selectedItemsLeft.length}</span>
          </div>

          {this.state.selectedItemsLeft.length !== 0 &&
          <div>
            <Checkbox
              className={(this.state.selectedLeftTemp.length === this.state.selectedItemsLeft.length) ? "all-selector-select" : "all-selector"}
              label={"Select all"}
              checked={(this.state.selectedLeftTemp.length === this.state.selectedItemsLeft.length)}
              onCheck={() => this.checkAllLeft()}
              onSelect={() => this.checkAllLeft()}
            />
            <div className="select-list-left">
              {this.showSelectedLeft()}
            </div>
          </div>
          }
            {this.state.selectedItemsLeft.length === 0 && <span className="select-list-empty">{i18n._t("Please select your items from right box, then click on move button")}</span>}
          <RaisedButton
            label={<Translate value="Remove chosen items"/>}
            primary={false}
            className="btn-select-list-left"
            fullWidth={true}
            onClick={this.handleSubmitLeft}
          />
        </Col>
      </Row>
    );
  }

}
