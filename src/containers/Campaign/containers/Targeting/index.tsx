import * as React from "react";
import Select2 from "../../../../components/Select2/index";

interface IProps {
}

interface IState {
}

const persons = {
    "data": [
    {"value": 0, "name": "Oliver Hansen"},
    {"value": 1, "name": "Van Henry"},
    {"value": 2, "name": "April Tucker"},
    {"value": 3, "name": "Ralph Hubbard"},
    {"value": 4, "name": "Omar Alexander"},
    {"value": 5, "name": "Carlos Abbott"},
    {"value": 6, "name": "Miriam Wagner"},
    {"value": 7, "name": "Bradley Wilkerson"},
    {"value": 8, "name": "Virginia Andrews"},
    {"value": 9, "name": "Kelly Snyder"}
]};

export default class TargetingComponent extends React.Component <IProps, IState> {
  public render() {
    return (
      <div dir="rtl">
        <h1>Targeting</h1>
        <Select2 data={persons.data}/>
      </div>
    );
  }
}
