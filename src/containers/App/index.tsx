import * as React from "react";
import {Route} from "react-router";
import PublicContainer from "../User/index";
import LayoutSwitcher from "../../components/LayoutSwitcher";

import "./style.less";

interface IProps  {
}

interface IState {
  isLogin: boolean;
}

export class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      isLogin : true,
    };
  }

  public render() {
    return (
      <LayoutSwitcher condition={this.state.isLogin}>
        <Route path={`/user`} component={PublicContainer} />
      </LayoutSwitcher>
    );
  }
}
