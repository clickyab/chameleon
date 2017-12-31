import * as React from "react";
import {Switch, Route, RouteComponentProps} from "react-router";
import {RootState} from "../../redux/reducers/index";
import {connect} from "react-redux";
import ListComponent from "./containers/List";
import DetailsComponent from "./containers/Details";
import {UserUserPayload} from "../../api/api";


interface IProps extends RouteComponentProps<void> {
  routes: any;
  user: UserUserPayload;
}

interface IState {
  user: UserUserPayload;
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PublicContainer extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {user: this.props.user};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({user: nextProps.user});
  }

  public render() {
    const {match} = this.props;
    return (
      <div>
        <Switch>
          <Route path={`${match.url}/list`} component={ListComponent}/>
          <Route path={`${match.url}/details`} component={DetailsComponent}/>
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    user: state.app.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    /* empty */
  };
}
