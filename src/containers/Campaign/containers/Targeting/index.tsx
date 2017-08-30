import * as React from "react";

interface IProps {
}

interface IState {
}

export default class TargetingComponent extends React.Component <IProps, IState> {
  public render() {
    return (
      <div dir="rtl">
        <h1>Targeting</h1>
      </div>
    );
  }
}
