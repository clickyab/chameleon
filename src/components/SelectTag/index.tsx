import * as React from "react";
import {MenuItem, SelectField} from "material-ui";
import I18n from "../../services/i18n/index";
import CONFIG from "../../constants/config";
import "./style.less";
import Translate from "../i18n/Translate/index";

export interface IData {
  value: any;
  name: string;
}

interface IProps {
  value?: (string | number)[] ;
  OnChange?: (value: (string | number)[]) => void;
  data: IData[];
  placeholder?: string | null;
  type: string | null;
  allOption?: boolean | null;
}

interface IStates {
  value?: (string | number)[] ;
  names?: string;
  selectAll?: boolean | null;
}

/**
 * Select Tag
 * @desc This class is a component that create tag from selected items
 *
 * @class
 *
 * @return {JSX} return Select-field with tag placeholders
 *
 */

export default class SelectTag extends React.Component<IProps, IStates> {

  private i18n = I18n.getInstance();

  constructor(props) {
    super(props);
    this.state = {value: this.props.value ? this.props.value : []};
  }

  /**
   * @function handle change of selected values
   * @param value
   */
  private handleChange(event, index, value) {
    console.log(value);
    this.setState({value});
    if (this.props.OnChange) {
      this.props.OnChange(value);
    }
  }

  private handleSelectAll() {
    let temp = [];
    for (let i = 0; i < this.props.data.length; i++) {
      temp.push(this.props.data[i].value);
    }
    this.setState({value: temp});
    this.setState({selectAll: true});
    if (this.props.OnChange) {
      this.props.OnChange(temp);
    }
  }

  /**
   * @function handle Removing selected item after tag close icon clicked
   * @param dataValue
   */

  private handleRemove(dataValue) {
    let temp = this.state.value;
    temp.splice(temp.indexOf(dataValue), 1);
    this.setState({value: temp});
    if (this.props.OnChange) {
      this.props.OnChange(temp);
    }
  }

  private handleReset() {
    this.setState({value: [], selectAll: false});
  }

  menuItems() {
    let Data = this.props.data;
    return Data.map((data) => (
      <MenuItem
        key={data.value}
        className={(this.state.value.indexOf(data.value) > -1) ? "hidden" : "show"}
        insetChildren={true}
        checked={this.state.value.indexOf(data.value) > -1}
        value={data.value}
        primaryText={data.name}
      />
    ));
  }

  /**
   * @function Create tag from data array argument
   * @param {array} data
   */
  private handleTags(data) {
    return data.map((data, i) => (
      <div key={i} className={(this.state.value.indexOf(data.value) > -1) ? "show-tag" : "hidden-tag"}
           data-value={data.value}>
        <span className="tag">{data.name}</span>
        <span className="close" onClick={() => {
          this.handleRemove(data.value);
        }}>&#10005;</span>
      </div>
    ));
  }


  selectionRenderer = (value) => {
    switch (value.length) {
      case 0:
        return "";
      case 1:
        if (value[0] === -1) {
          return <Translate value={"All _{type} selected"} params={{type: this.props.type}}/>;
        }
        return this.props.data[0].name;
      case this.props.data.length:
        return <Translate value={"All _{type} selected"} params={{type: this.props.type}}/>;
      default:
        return <Translate value={"_{length} selected _{type}"} params={{type: this.props.type, length: value.length}}/>;
    }
  }

  render() {
    return (
      <div>
        {this.props.type &&
        <div className="select-label">
          <Translate value={"select _{type}"} params={{type: this.props.type}}/>
        </div>}
        <div className="select-tag">
          <SelectField className={(CONFIG.DIR === "rtl") ? "select-tag-rtl" : "select-tag"}
                       hintText={this.i18n._t(this.props.placeholder)}
                       selectionRenderer={this.selectionRenderer}
                       multiple={true}
                       value={this.state.value}
                       onChange={this.handleChange.bind(this)}
          >
            {this.props.allOption &&
            <MenuItem
              key={-1}
              className="show"
              insetChildren={true}
              value={-1}
              primaryText={"Select everything"}
              checked={this.state.selectAll}
              onClick={this.handleSelectAll.bind(this)}
            />}
            {this.menuItems()}
          </SelectField>
          <div>
            {this.props.type &&
            <div className="select-title">
              <Translate value={"selected _{type}"} params={{type: this.props.type}}/>
            </div>}
            {!this.state.selectAll && this.handleTags(this.props.data)}
            {this.state.selectAll &&
            <div className="show-tag">
            <span className="tag">
              <Translate value={"All _{type} Has been selected"} params={{type: this.props.type}}/>
            </span>
              <span className="close" onClick={() => {
                this.handleReset();
              }}>&#10005;</span>
            </div>
            }
            {this.state.value.length === 0 &&
            <Translate value={"No _{type} Has been selected"} params={{type: this.props.type}}/>}
          </div>
        </div>
      </div>
    );
  }
}
