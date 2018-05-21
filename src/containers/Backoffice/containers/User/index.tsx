import * as React from "react";
import {Switch, Route, RouteComponentProps} from "react-router";
import {RootState} from "./../../../../redux/reducers/index";
import {connect} from "react-redux";
import {PrivateRoute} from "../../../../components/PrivateRoute";
import AddUser from "./containers/AddUser";
import UserList from "./containers/UserList";
import UserProfile from "./containers/UserProfile";

interface IProps extends RouteComponentProps<void> {
    routes: any;
}

interface IState {}

@connect(mapStateToProps, mapDispatchToProps)
export default class BackofficeContainer extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({user: nextProps.user});
    }

    public render() {
        const {match} = this.props;
        return (
        <Switch>
            <PrivateRoute path={`${match.url}/list`} component={UserList}/>
            <PrivateRoute path={`${match.url}/add`} component={AddUser}/>
            <PrivateRoute path={`${match.url}/edit/:id`} component={UserProfile}/>
        </Switch>

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
