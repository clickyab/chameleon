import {Redirect, Route} from "react-router";
import * as React from "react";
import {store} from "../../redux/store/index";

/**
 * Private route access
 * @func
 * @desc This function decide to user can access to this route or redirect
 *
 * @param {Component} Component
 * @param {props} rest
 *
 * @return {JSX.Element}
 */

export const PrivateRoute = ({component: Component, ...rest}): JSX.Element => {
  return (
    <Route {...rest} render={props => (
      store.getState().app.isLogin ? (
        <Component {...props}/>
      ) : (
        <Redirect to={{
          pathname: "/",
          state: {from: props.location},
        }}/>
      )
    )}/>
  );
};

