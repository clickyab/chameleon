import {Redirect, Route} from "react-router";
import * as React from "react";

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    true ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: "/public/login",
        state: { from: props.location },
      }}/>
    )
  )}/>
);
