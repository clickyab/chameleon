import * as React from "react";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";

export namespace App {
  export namespace Public {
    export namespace Register {
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
export default class PublicProfileContainer extends React.Component<App.Public.Register.Props, App.Public.Register.State> {

  render() {
    return (
      <div>
        <h1>Profile Page</h1>
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

