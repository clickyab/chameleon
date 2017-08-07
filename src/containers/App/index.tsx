import * as React from "react";
import * as style from "./style.css";
import { connect } from "react-redux";
import {Route} from "react-router";
import { RootState } from "../../redux/reducers";
import PublicContainer from "../User/index";

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
      <div className={style.normal}>
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
