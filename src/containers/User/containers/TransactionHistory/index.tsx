/**
 * @file Transaction History file
 */
import * as React from "react";
import {connect} from "react-redux";
import {
    ControllersApi,
    UserResponseLoginOKAccount
} from "../../../../api/api";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import {setUser, setBreadcrumb, unsetBreadcrumb} from "../../../../redux/app/actions/index";
import "./style.less";
import DataTableChartWrapper from "../../../../components/DataTableChartWrapper";

/**
 * @interface IProps
 * @desc define Prop object
 */
export interface IProps {
    form: any;
    user: UserResponseLoginOKAccount;
    setBreadcrumb: (name: string, title: string, parent: string) => void;
    unsetBreadcrumb: (name: string) => void;
}

/**
 * @interface IState
 * @desc define state object
 */
export interface IState {
}


@connect(mapStateToProps, mapDispatchToProps)

class TransactionHistory extends React.Component<IProps, IState> {

    private i18n = I18n.getInstance();
    disable: boolean = false;
    controllerApi = new ControllersApi();

    constructor(props: IProps) {
        super(props);
    }


    componentDidMount() {
        this.props.setBreadcrumb("charge", this.i18n._t("Transaction History").toString(), "home");
    }

    render() {
        return (
            <div className={"charge-container remove-legend"}>
                <DataTableChartWrapper
                    name="campaignDetails"
                    chartDataFn={this.controllerApi.financialGraphSpendGet}
                    chartDefinitionFn={this.controllerApi.financialBillingDefinitionGet}
                    dataTableDefinitionFn={this.controllerApi.financialBillingDefinitionGet}
                    dataTableDataFn={this.controllerApi.financialBillingGet.bind(this)}
                    showRangePicker={true}
                />
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
        setUser: (user: UserResponseLoginOKAccount) => dispatch(setUser(user)),
        setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
        unsetBreadcrumb: (name: string) => dispatch(unsetBreadcrumb(name)),
    };
}

export default TransactionHistory;
