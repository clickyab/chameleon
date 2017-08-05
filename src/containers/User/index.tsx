import * as React from "react";
import {Route, RouteComponentProps} from "react-router";
import {RootState} from "../../redux/reducers/index";
import {connect} from 'react-redux';
import PublicLoginContainer from "./containers/Login";
import PublicRegisterContainer from "./containers/Register";
import {PrivateRoute} from "../../components";
import PublicProfileContainer from "./containers/Profile/index";


export namespace App{
  export namespace User {
    export interface Props extends RouteComponentProps<void> {
      routes: any;
    }

    export interface State {
      /* empty */
    }
  }
}


@connect(mapStateToProps, mapDispatchToProps)
export default class PublicContainer extends React.Component<App.User.Props, App.User.State>{

  render(){
    const {match} = this.props;
    return (
      <div>
        <Route path={`${match.url}/login`} component={PublicLoginContainer}/>
        <Route path={`${match.url}/register`} component={PublicRegisterContainer}/>
        <PrivateRoute path={`${match.url}/profile`} component={PublicProfileContainer}/>
      </div>
    )
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

