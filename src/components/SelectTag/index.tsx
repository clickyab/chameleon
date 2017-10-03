import * as React from "react";
import {MenuItem, SelectField} from "material-ui";
import I18n from "../../services/i18n/index";
import CONFIG from "../../constants/config";
import "./style.less";
import Translate from "../i18n/Translate/index";


interface IProps {
  data: any;
  placeholder?: string | null;
  type?: string | null;
  allOption?: boolean | null;
}

interface IStates {
  values?: any;
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
    this.state = {values: []};
  }

  /**
   * @function handle change of selected values
   * @param values
   */
  private handleChange(event, index, values) {
      this.setState({values});
  }
  private handleSelectAll() {
      let temp = [];
      for (let i = 0; i < this.props.data.length; i++) {
        temp.push(this.props.data[i].value);
      }
      this.setState({values: temp});
      this.setState({selectAll: true});
  }

  /**
   * @function handle Removing selected item after tag close icon clicked
   * @param dataValue
   */

  private handleRemove(dataValue) {
    let temp = this.state.values;
    temp.splice(temp.indexOf(dataValue), 1);
    this.setState({values: temp});
  }

  private handleReset() {
    this.setState({values: [], selectAll: false});
  }

  menuItems() {
    let Data = this.props.data;
    return Data.map((data) => (
      <MenuItem
        key={data.value}
        className={(this.state.values.indexOf(data.value) > -1) ? "hidden" : "show"}
        insetChildren={true}
        checked={this.state.values.indexOf(data.value) > -1}
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
      <div key={i} className={(this.state.values.indexOf(data.value) > -1) ? "show-tag" : "hidden-tag"}
           data-value={data.value}>
        <span className="tag">{data.name}</span>
        <span className="close" onClick={() => {
          this.handleRemove(data.value);
        }}>&#10005;</span>
      </div>
    ));
  }


  selectionRenderer = (values) => {
    switch (values.length) {
      case 0:
        return "";
      case 1:
        if (values[0] === -1) {
          return `${this.i18n._t("All ")} ${this.props.type} ${this.i18n._t("Selected")} `;
        }
        return this.props.data[0].name;
      case this.props.data.length:
         return `${this.i18n._t("All ")} ${this.props.type} ${this.i18n._t("Selected")} `;
      default:
        return `${values.length} ${this.i18n._t("Selected")} ${this.props.type}`;
    }
  }

  render() {
    return (
      <div className="select-tag">
        <SelectField className={(CONFIG.DIR === "rtl") ? "select-tag-rtl" : "select-tag"}
                     hintText={this.i18n._t(this.props.placeholder)}
                     selectionRenderer={this.selectionRenderer}
                     multiple={true}
                     value={this.state.values}
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
          <div>
            <Translate value={"selected " + this.props.type}/>
          </div>}
          {!this.state.selectAll && this.handleTags(this.props.data)}
          {this.state.selectAll &&
          <div className="show-tag">
            <span className="tag">{this.i18n._t("All ") + this.props.type + this.i18n._t(" Has been selected")}</span>
            <span className="close" onClick={() => {
              this.handleReset();
            }}>&#10005;</span>
          </div>
          }
          {this.state.values.length === 0 && (this.i18n._t("No ") + this.props.type + this.i18n._t(" Has been selected"))}
        </div>
      </div>
    );
  }
}
