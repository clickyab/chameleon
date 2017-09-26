import * as React from "react";
import {MenuItem, SelectField} from "material-ui";
import "./style.less";


interface IProps {
  data?: string;
}
interface IStates {
  values?: any;
  names?: string;
}

const persons = [
  {value: 0, name: "Oliver Hansen"},
  {value: 1, name: "Van Henry"},
  {value: 2, name: "April Tucker"},
  {value: 3, name: "Ralph Hubbard"},
  {value: 4, name: "Omar Alexander"},
  {value: 5, name: "Carlos Abbott"},
  {value: 6, name: "Miriam Wagner"},
  {value: 7, name: "Bradley Wilkerson"},
  {value: 8, name: "Virginia Andrews"},
  {value: 9, name: "Kelly Snyder"},
];

export default class Select2 extends React.Component<IProps, IStates> {
  constructor(props) {
    super(props);
    this.state = {values : []};
  }

  private  handleChange(event, index, values) {
    this.setState({values});
    console.log(values);
  }

  private handleRemove(personValue) {
    let temp = this.state.values;
     temp.splice(temp.indexOf(personValue), 1 );
     this.setState({values: temp});
  }
  menuItems(persons) {
    return persons.map((person) => (
      <MenuItem
        key={person.value}
        className={(this.state.values.indexOf(person.value) > -1) ? "hidden" : "show"}
        insetChildren={true}
        checked={this.state.values.indexOf(person.value) > -1}
        value={person.value}
        primaryText={person.name}
      />
    ));
  }
  private handleTags(persons) {
    return persons.map((person) => (
      <div className={(this.state.values.indexOf(person.value) > -1) ? "show-tag" : "hidden-tag"} data-value={person.value}>
       <span className="tag">{person.name}</span>
        <span className="close" onClick={() => {this.handleRemove(person.value); }}>&#10005;</span>
        </div>
    ));
  }
  render() {
  return(
    <div>
    <SelectField
      multiple={true}
      value={this.state.values}
      onChange={this.handleChange.bind(this)}
    >
      {this.menuItems(persons)}
    </SelectField>
      <div>
        {this.handleTags(persons)}
        {this.state.values.length === 0  && "please insert "}
      </div>
    </div>
  );
  }
}
