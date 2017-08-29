import {Redirect, Route} from "react-router";
import * as React from "react";
import AAA from "../../services/AAA/index";

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    !!AAA.getInstance().getToken() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: "/",
        state: { from: props.location },
      }}/>
    )
  )}/>
);

