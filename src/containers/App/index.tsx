///<reference path="../../services/index.tsx"/>
import * as React from 'react';
import * as style from './style.css';
import { connect } from 'react-redux';
import {Route, RouteComponentProps} from 'react-router';
import { RootState } from '../../redux/reducers';
import PublicContainer from "../User/index";
// import  * as Services from "../../services";

export namespace App {
  export interface Props extends RouteComponentProps<void> {
    /* empty */
  }

  export interface State {
    isLogin: boolean;
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export class App extends React.Component<App.Props, App.State> {

  constructor(props:App.Props){
    super(props);
    this.state = {
      isLogin : false,
    }
  }

  render() {
    const {children } = this.props;
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
