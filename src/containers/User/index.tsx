import * as React from "react";
import {Redirect, Route, RouteComponentProps} from "react-router";
import {RootState} from "../../redux/reducers/index";
import {connect} from "react-redux";
import PublicLoginContainer from "./containers/Login";
import {UserUserPayload} from "../../api/api";
import UserArea from "./components/UserArea";
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
        <Route path={`${match.url}/login`} component={PublicLoginContainer}/>
        <Route path={`${match.url}/recover-password`} component={PublicRecoverPassword}/>
        <Route path={`${match.url}/register/verification/:token`} component={PublicLoginContainer}/>
        {(this.state.user) && <PrivateRoute path={`${match.url}/`} component={UserArea}/>}
      </div>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    user : state.app.user,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    /* empty */
  };
}
