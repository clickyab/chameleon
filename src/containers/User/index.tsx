import * as React from "react";
import {Redirect, Route, RouteComponentProps} from "react-router";
import {RootState} from "../../redux/reducers/index";
import {connect} from "react-redux";
import PublicLoginContainer from "./containers/Login";
import UserArea from "./components/UserArea";
import PublicRecoverPassword from "./containers/RecoverPassword/index";

interface IProps extends RouteComponentProps<void> {
  routes: any;
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PublicContainer extends React.Component<IProps> {

  public render() {
    const {match} = this.props;
    return (
      <div>
        <Route path={`${match.url}/login`} component={PublicLoginContainer}/>
        <Route path={`${match.url}/recover-password`} component={PublicRecoverPassword}/>
        <Route path={`${match.url}/register/verification/:token`} component={PublicLoginContainer}/>
        <Route path={`${match.url}/recover/verification/:token`} component={PublicRecoverPassword}/>
        <Route path={`${match.url}/`} component={UserArea}/>
      </div>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    /* empty */
  };
}

function mapDispatchToProps(dispatch) {
  return {
    /* empty */
  };
}
