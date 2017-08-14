import * as React from "react";
import PrivateLayout from "../../containers/App/Layout/privateLayout";
import PublicLayout from "../../containers/App/Layout/publicLayout";

export interface IProps  {
  condition: boolean;
  children: JSX.Element;
}

export default class LayoutSwitcher extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }
  public render() {
    return (
      this.props.condition ?
        <PrivateLayout>{this.props.children}</PrivateLayout>
        :
        <PublicLayout>{this.props.children}</PublicLayout>

    );
  }
}
