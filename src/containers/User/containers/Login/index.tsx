import * as React from "react";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import {RootState} from "../../../../redux/reducers/index";

export namespace App{
  export namespace Public {
    export namespace Login {
      export interface Props extends RouteComponentProps<void> {
        /* empty */
      }

      export interface State {
        /* empty */
      }
    }
  }
}


@connect(mapStateToProps, mapDispatchToProps)
export default class PublicLoginContainer extends React.Component<App.Public.Login.Props, App.Public.Login.State>{

  render(){
    return (
      <div>
        <h1>Login Page</h1>
        <Link to={`./register`}>Register Page</Link>
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

