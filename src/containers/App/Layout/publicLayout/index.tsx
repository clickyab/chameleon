import * as React from "react";

interface IProp {
  children?: JSX.Element;
}

export default class PublicLayout extends React.Component {
  public render() {
    return (
      <div>
        public {this.props.children}
      </div>
    );
  }
}
