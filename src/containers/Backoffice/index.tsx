import * as React from "react";
import {Switch, Route, RouteComponentProps, withRouter} from "react-router";
import {RootState} from "../../redux/reducers/index";
import {connect} from "react-redux";
import {UserUserPayload} from "../../api/api";
import {PrivateRoute} from "../../components/PrivateRoute/index";
import UserContainer from "./containers/User";
import ApproveReject from "./containers/ApproveReject";
import WhiteLabelContainer from "./containers/WhiteLabel";

interface IProps extends RouteComponentProps<void> {
    routes: any;
    user: UserUserPayload;
}

interface IState {
    user: UserUserPayload;
}

@connect(mapStateToProps, mapDispatchToProps)
class BackofficeContainer extends React.Component<IProps, IState> {
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
                    <PrivateRoute path={`${match.url}/user`} component={UserContainer}/>
                    <PrivateRoute path={`${match.url}/whitelabel`} component={WhiteLabelContainer}/>
                    <PrivateRoute path={`${match.url}/approveReject`} component={ApproveReject}/>
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
export default withRouter(BackofficeContainer);
