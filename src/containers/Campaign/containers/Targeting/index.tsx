import * as React from "react";
import Select2 from "../../../../components/Select2/index";

interface IProps {
}

interface IState {
}

export default class TargetingComponent extends React.Component <IProps, IState> {
  public render() {
    return (
      <div dir="rtl">
        <h1>Targeting</h1>
        <Select2/>
      </div>
    );
  }
}
