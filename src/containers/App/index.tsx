import * as React from "react";
import {Redirect, Route, Switch} from "react-router";
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
import CheckMail from "../User/containers/CheckMail";
import {UserApi} from "../../api/api";
// import ExploreContainer from "../Explore/index";


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
    shadowColor: "#FFF",
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

  /**
   * check token exist and try to get user from server and authenticate user's token.
   */
  public componentDidMount() {
    if (!!AAA.getInstance().getToken()) {
      const userApi = new UserApi();
      userApi.userPingGet({})
        .then(() => {
          this.setState({isLogin: true});
        })
        .catch((error) => {
          if (error.status === 401) {
            AAA.getInstance().unsetToken();
            window.location.href = ("/");
          }
        });
    } else {
      this.props.unsetIsLogin();
    }
  }

  public render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <LayoutSwitcher condition={this.state.isLogin}>
          <Switch>
            <Route path={`/user`} component={PublicContainer}/>
            <PrivateRoute path={`/dashboard`} component={Dashboard}/>
            <PrivateRoute path={`/campaign`} component={CampaignContainer}/>
            {/*<PrivateRoute path={`/explore`} component={ExploreContainer}/>*/}
            <Route exact path={`/`} component={this.state.isLogin ? Dashboard : CheckMail} />
          </Switch>
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
  };
}

export default App;
