import * as React from "react";
import {Switch, Route, RouteComponentProps} from "react-router";
import {RootState} from "../../redux/reducers/index";
import {connect} from "react-redux";
import CheckMail from "./containers/CheckMail";
import PublicLoginContainer from "./containers/Login";
import RegisterForm from "./containers/Register";
import LogoutContainer from "./containers/Logout";
import {UserUserPayload} from "../../api/api";
import UserArea from "../Campaign/components/UserArea";
import PublicRecoverPassword from "./containers/RecoverPassword/index";
import {PrivateRoute} from "../../components/PrivateRoute/index";

interface IProps extends RouteComponentProps<void> {
  routes: any;
  user: UserUserPayload;
}

interface IState {
  user: UserUserPayload;
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PublicContainer extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {user: this.props.user};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({user: nextProps.user});
  }

  public render() {
    const {match} = this.props;
    return (
      <div>
        <Switch>
          <Route path={`${match.url}/auth`} component={CheckMail}/>
          <Route path={`${match.url}/login`} component={PublicLoginContainer}/>
          <Route exact path={`${match.url}/register`} component={RegisterForm}/>
          <Route path={`${match.url}/logout`} component={LogoutContainer}/>
          <Route path={`${match.url}/recover-password`} component={PublicRecoverPassword}/>
          <Route path={`${match.url}/register/verification/:token`} component={RegisterForm}/>
          <Route path={`${match.url}/recover/verification/:token`} component={PublicRecoverPassword}/>
          {(this.state.user) && <PrivateRoute path={`${match.url}/`} component={UserArea}/>}
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    user: state.app.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    /* empty */
  };
}
