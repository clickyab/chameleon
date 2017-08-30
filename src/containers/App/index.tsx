import * as React from "react";
import {Redirect, Route} from "react-router";
import PublicContainer from "../User/index";
import LayoutSwitcher from "../../components/LayoutSwitcher";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import {connect} from "react-redux";
import {RootState} from "../../redux/reducers/index";
import Dashboard from "./Dashboard/index";
import "./style.less";
import AAA from "../../services/AAA/index";
import {PrivateRoute} from "../../components/PrivateRoute/index";
import {setIsLogin, unsetIsLogin} from "../../redux/app/actions/index";
import CampaignContainer from "../Campaign/index";


interface IProps {
  isLogin: boolean;
  setIsLogin: () => {};
  unsetIsLogin: () => {};
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

@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      isLogin: this.props.isLogin
    };
  }

  public componentWillReceiveProps(newProps: IProps) {
    if (this.state.isLogin !== newProps.isLogin) {
      this.setState({
        isLogin: newProps.isLogin,
      });
    }
  }

  public componentDidMount() {
    if (!!AAA.getInstance().getToken()) {
      this.setState({isLogin: true});
    } else {
      this.props.unsetIsLogin();
    }
  }

  public render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <LayoutSwitcher condition={this.state.isLogin}>
          <Route exact path={`/`} render={(): JSX.Element => (
            this.state.isLogin ? <Redirect to={`/dashboard`}/> : <Redirect to={`/user/login`}/>
          )}/>
          <Route path={`/user`} component={PublicContainer}/>
          <PrivateRoute path={`/dashboard`} component={Dashboard}/>
          <PrivateRoute path={`/campaign`} component={CampaignContainer}/>
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

function mapDispatchToProps(dispatch) {
  return {
    setIsLogin: () => dispatch(setIsLogin()),
    unsetIsLogin: () => dispatch(unsetIsLogin())
  }
}

export default App;
