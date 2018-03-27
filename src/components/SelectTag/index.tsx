import * as React from "react";
import {Select} from "antd";
import I18n from "../../services/i18n/index";
import CONFIG from "../../constants/config";
import "./style.less";
import Translate from "../i18n/Translate/index";
import Icon from "../Icon/index";

const Option = Select.Option;
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

  private handleChange(value) {
    let temp = value;
    if (temp[temp.length - 1] === "-1") {
      this.handleSelectAll();
    }
    else {
      this.setState({value: temp});
      if (this.props.OnChange) {
        this.props.OnChange(value);
      }
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
  private handleValue(data) {
    let temp = this.state.value;
      if (this.state.value.indexOf(data.value) > -1) {
        temp.push(data.value);
      }
      this.setState({value: temp});
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
  let children = [];
    let Data = this.props.data;
      if (this.props.allOption && !this.state.selectAll) {
        children.push(<Option
          key={-1}
          value={"-1"}
        >{"select All"}</Option>);
      }
     Data.map((data) => {
       if (this.state.value.indexOf(data.value) === -1) {
         children.push(
           <Option
             key={data.value}
             value={data.value}
           >{data.name}</Option>
         );
       }
    });
     return children;
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
        }}><Icon name={"cif-closelong"}/></span>
      </div>
    ));
  }


  selectionRenderer = (value): string => {
    switch (value.length) {
      case 0:
        return this.props.placeholder as string;
      case 1:
        if (value[0] === -1) {
          return this.i18n._t("All %s selected" , {params: [this.props.type]}) as string;
        }
        return this.props.data[0].name;
      case this.props.data.length:
        return this.i18n._t("All %s selected" , {params: [this.props.type]}) as string;
      default:
        return this.i18n._t("%s selected %s" , {params: [this.props.type, value.length]}) as string;
    }
  }

  render() {
    return (
      <div>
        {this.props.type &&
        <div className="select-label">
          <Translate value={"select %s"} params={[this.props.type]}/>
        </div>}
        <div className="select-tag">
          <Select className={`${(CONFIG.DIR === "rtl") ? "select-tag-ant-rtl" : "select-tag"}`}
                  value={this.state.value}
                  onChange={(value) => this.handleChange(value)}
                  placeholder={this.selectionRenderer(this.state.value) as string}
                  mode={"multiple"}
                  dropdownClassName={"select-tag-dropdown"}
          >
            {this.menuItems()}
          </Select>
          <div>
            {this.props.type &&
            <div className="select-title">
              <Translate value={"selected %s"} params={[this.props.type]}/>
            </div>}
            {!this.state.selectAll && this.handleTags(this.props.data)}
            {this.state.selectAll &&
            <div className="show-tag">
            <span className="tag">
              <Translate value={"All %s Has been selected"} params={[this.props.type]}/>
            </span>
              <span className="close" onClick={() => {
                this.handleReset();
              }}><Icon name={"cif-closelong"}/></span>
            </div>
            }
            {this.state.value.length === 0 &&
            <Translate value={"No %s Has been selected"} params={[this.props.type]}/>}
          </div>
        </div>
      </div>
    );
  }
}
