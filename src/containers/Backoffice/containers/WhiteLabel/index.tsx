import * as React from "react";
import {Switch, Route, RouteComponentProps} from "react-router";
import {RootState} from "./../../../../redux/reducers/index";
import {connect} from "react-redux";
import {PrivateRoute} from "../../../../components/PrivateRoute";
import whiteLabelAdd from "./containers/whiteLabelAdd";
import whiteLabelList from "./containers/whiteLabelList";
import FinancialReport from "./containers/financialReport";
import WhiteLabelBilling from "./containers/whiteLabelBilling";
import WhiteLabel from "./containers/whiteLabelAdd";



interface IProps extends RouteComponentProps<void> {
    routes: any;
}

interface IState {
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WhiteLabelContainer extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
    }

    public render() {
        const {match} = this.props;
        return (
            <Switch>
                <PrivateRoute path={`${match.url}/create`} component={WhiteLabel}/>
                <PrivateRoute path={`${match.url}/edit/:id`} component={WhiteLabel}/>
                <PrivateRoute path={`${match.url}/billing`} component={WhiteLabelBilling}/>
                <PrivateRoute path={`${match.url}/financial/report`} component={FinancialReport}/>
                <PrivateRoute path={`${match.url}/list`} component={whiteLabelList}/>
                <PrivateRoute path={`${match.url}/add`} component={whiteLabelAdd}/>
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
