import * as React from "react";

interface IProps {
}

interface IState {
}

export default class TypeComponent extends React.Component <IProps, IState> {
  public render() {
    return (
      <div dir="rtl">
        <h1>Type</h1>
      </div>
    );
  }
}
