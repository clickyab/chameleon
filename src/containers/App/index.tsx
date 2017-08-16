import * as React from "react";
import {Route} from "react-router";
import PublicContainer from "../User/index";
import LayoutSwitcher from "../../components/LayoutSwitcher";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";

import "./style.less";

interface IProps {
}

interface IState {
  isLogin: boolean;
}

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "#41b6e6",
    // primary2Color: green700,
    // primary3Color: green100,
  },
});


export class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      isLogin: false,
    };
  }

  public render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <LayoutSwitcher condition={this.state.isLogin}>
          <Route path={`/user`} component={PublicContainer}/>
        </LayoutSwitcher>
      </MuiThemeProvider>
    );
  }
}
