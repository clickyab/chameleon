/**
 * @file Charge file
 */
import * as React from "react";
import {connect} from "react-redux";
import {
    ControllersApi, OrmOnlinePayment,
    UserResponseLoginOKAccount
} from "../../../../api/api";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import {setUser, setBreadcrumb, unsetBreadcrumb} from "../../../../redux/app/actions/index";
import CONFIG from "../../../../constants/config" ;
import "./style.less";
import {RouteComponentProps, withRouter} from "react-router";
import {parseQueryString} from "../../../../services/Utils/parseQueryString";
import {Alert, Spin} from "antd";
import {currencyFormatter} from "../../../../services/Utils/CurrencyFormatter";

/**
 * @interface IProps
 * @desc define Prop object
 */
export interface IProps extends RouteComponentProps<void> {
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
    result?: OrmOnlinePayment;
    loading: boolean;
    success?: boolean;
}

@connect(mapStateToProps, mapDispatchToProps)

class FinancialVerify extends React.Component<IProps, IState> {

    private i18n = I18n.getInstance();
    disable: boolean = false;
    controllerApi = new ControllersApi();

    constructor(props: IProps) {
        super(props);
        this.state = {
            loading: true,
        };
    }


    componentDidMount() {
        this.props.setBreadcrumb("payment-result", this.i18n._t("Payment result").toString(), "user");
        this.loadTransaction();
    }

    loadTransaction() {
        const params = parseQueryString(this.props.location.search);
        if (params.payment && params.success !== undefined) {
            this.controllerApi.financialPaymentIdGet({
                id: params.payment
            }).then((result) => {
                this.setState({
                    result,
                    loading: false,
                    success: params.success === "true"
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    render() {
        console.log(this.state);
        return (
            <div className={(CONFIG.DIR === "rtl") ? "charge-container-rtl" : "charge-container"}>
                {/*fixme:: Fix this UI */}
                <div>
                    {!this.state.loading && this.state.success &&
                    <div style={{width: 300}}>
                        <Alert
                            message="Success Payment"
                            description={<table>
                                <tbody>
                                <tr>
                                    <td style={{width: "50%"}}>{this.i18n._t("Amount")}:</td>
                                    <td>
                                        {currencyFormatter(this.state.result.amount)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>{this.i18n._t("Ref Number:")}</td>
                                    <td>
                                        {this.state.result.ref_num}
                                    </td>
                                </tr>
                                </tbody>
                            </table>}
                            type="success"
                        />
                    </div>
                    }
                    {!this.state.loading && !this.state.success &&
                    <div style={{width: 300}}>
                        <Alert
                            message="Failed Payment"
                            description={<table>
                                <tbody>
                                <tr>
                                    <td style={{width: "50%"}}>{this.i18n._t("Amount")}:</td>
                                    <td>
                                        {currencyFormatter(this.state.result.amount)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>{this.i18n._t("Reason:")}</td>
                                    <td>
                                        {this.state.result.error_reason}
                                    </td>
                                </tr>
                                </tbody>
                            </table>}
                            type="error"
                        />
                    </div>
                    }
                    {this.state.loading && <Spin/>}
                </div>
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

export default withRouter(FinancialVerify);
