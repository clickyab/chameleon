import * as React from "react";
import countries from "./countries";
import "~node_modules/flag-icon-css/less/flag-icon.less";

interface IProps {
  value?: number;

}

interface IState {

}

export default class Phone extends React.Component<IProps, IState> {
  public render() {
    return <div><span className="flag-icon flag-icon-gr"></span></div>;
  }
}
