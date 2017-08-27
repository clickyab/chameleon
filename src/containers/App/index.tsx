import * as React from "react";
import {Route} from "react-router";
import PublicContainer from "../User/index";
import LayoutSwitcher from "../../components/LayoutSwitcher";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import {connect} from "react-redux";
import {RootState} from "../../redux/reducers/index";

import "./style.less";


interface IProps {
  isLogin: boolean;
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

@connect(mapStateToProps)
class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      isLogin: false,
    };
  }

  public componentWillReceiveProps(newProps: IProps) {
    if (this.state.isLogin !== newProps.isLogin) {
      this.setState({
        isLogin: newProps.isLogin,
      });
    }
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


function mapStateToProps(state: RootState) {
  return {
    isLogin: state.app.isLogin,
    user: state.app.user,
  };
}

export default App;
