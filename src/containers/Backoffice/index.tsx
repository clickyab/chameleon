import * as React from "react";
import {Switch, Route, RouteComponentProps} from "react-router";
import {RootState} from "../../redux/reducers/index";
import {connect} from "react-redux";
import {UserUserPayload} from "../../api/api";
import {PrivateRoute} from "../../components/PrivateRoute/index";
import AddClient from "./containers/AddUser";
import Profile from "./containers/Profile";
import ApproveRejectBanners from "./containers/BannerManage";

interface IProps extends RouteComponentProps<void> {
    routes: any;
    user: UserUserPayload;
}

interface IState {
    user: UserUserPayload;
}

@connect(mapStateToProps, mapDispatchToProps)
export default class BackofficeContainer extends React.Component<IProps, IState> {
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
                {console.log("props", this.props)}
                <Switch>
                    <PrivateRoute path={`${match.url}/user/add`} component={AddClient}/>
                    <PrivateRoute path={`${match.url}/profile`} component={Profile}/>
                    <PrivateRoute path={`${match.url}/banner/check`} component={ApproveRejectBanners}/>
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
