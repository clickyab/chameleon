/**
 * @file Charge file
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
import Icon from "../../../../components/Icon/index" ;
import CONFIG from "../../../../constants/config" ;
import "./style.less";
import {ISelectBoxItem} from "../../../Campaign/containers/Naming/Components/SelectBox";
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
    selectedPayment: PAYMENT;
    amountValue: number | null;
    accountDeposit: number | null;
    couponInput: number | "";
    JSXForm: JSX.Element;
}

enum PAYMENT { ONLINE = "online", RECEIPT = "receipt", CHECK_BANK = "check bank", COUPON = "coupon"}

@connect(mapStateToProps, mapDispatchToProps)

class TransactionHistory extends React.Component<IProps, IState> {

    private i18n = I18n.getInstance();
    disable: boolean = false;
    controllerApi = new ControllersApi();

    constructor(props: IProps) {
        super(props);
        this.state = {
            selectedPayment: PAYMENT.ONLINE,
            amountValue: null,
            accountDeposit: props.user.balance ? props.user.balance : null,
            couponInput: "",
            JSXForm: null,
        };
    }

    PaymentTypes: ISelectBoxItem[] = [
        {
            title: this.i18n._t("Online payment").toString(),
            value: PAYMENT.ONLINE,
            icon: <Icon name="cif-money-charge" className={"campaign-icon"}/>,
        },
        {
            title: this.i18n._t("With bank receipt").toString(),
            value: PAYMENT.RECEIPT,
            icon: <Icon name="cif-bankwire" className={"campaign-icon"}/>,
        },
        // {
        //     title: this.i18n._t("Coupon").toString(),
        //     value: PAYMENT.COUPON,
        //     icon: <Icon name="cif-browser-campaign-outline" className={"campaign-icon"}/>,
        // }
    ];

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
