import * as React from "react";
import { connect } from "react-redux";
import {Route} from "react-router";
import { RootState } from "../../redux/reducers";
import PublicContainer from "../User/index";
import "./style.less";

@connect(mapStateToProps, mapDispatchToProps)
export class App extends React.Component {

  constructor(props: any) {
    super(props);
    this.state = {
      isLogin : false,
    };
  }

  public render() {
    return (
      <div>
        <Route path={`/user`} component={PublicContainer}/>
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
