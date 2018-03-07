/**
 * @file Charge file
 */
import * as React from "react";
import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import {currencyFormatter} from "../../../../services/Utils/CurrencyFormatter";
import Translate from "../../../../components/i18n/Translate/index";
import {UserApi, UserResponseLoginOKAccount} from "../../../../api/api";
import {Form, Row, Col, notification, Input} from "antd";
import {TextField, RaisedButton} from "material-ui";
import {setUser, setBreadcrumb, unsetBreadcrumb} from "../../../../redux/app/actions/index";
import Icon from "../../../../components/Icon/index" ;
import CONFIG from "../../../../constants/config" ;

import "./style.less";
import SelectBox, {ISelectBoxItem} from "../../../Campaign/containers/Naming/Components/SelectBox";
import Currency from "../../../../components/Currency";

const FormItem = Form.Item;
/**
 * @interface IProps
 * @desc define Prop object
 */
export interface IProps {
    form: any;
    setBreadcrumb: (name: string, title: string, parent: string) => void;
    unsetBreadcrumb: (name: string) => void;
}

/**
 * @interface IState
 * @desc define state object
 */
export interface IState {
    selectedPayment: PAYMENT;
    activeAmount: number | null;
    activeInput: boolean;
    amountValue: number | null ;
    amountString: string | null;
    isOffer: boolean;
    accountDeposit: number | null;
    couponInput: number | "" ;
}

enum PAYMENT { ONLINE = "online", RECEIPT = "receipt", CHECK_BANK = "check bank", COUPON = "coupon"}

@connect(mapStateToProps, mapDispatchToProps)

class ChargeContainer extends React.Component<IProps, IState> {

    private i18n = I18n.getInstance();
    disable: boolean = false;

    constructor(props: IProps) {
        super(props);
        this.state = {
            selectedPayment: PAYMENT.ONLINE,
            activeAmount: null,
            activeInput: false,
            amountValue: null,
            amountString: null,
            isOffer: true,
            accountDeposit : 50000,
            couponInput: "" ,
        };
    }

    PaymentTypes: ISelectBoxItem[] = [
        {
            title: this.i18n._t("Online payment").toString(),
            value: PAYMENT.ONLINE,
            icon: <Icon name="cif-browser-campaign-outline" className={"campaign-icon"}/>,
        },
        {
            title: this.i18n._t("With bank receipt").toString(),
            value: PAYMENT.RECEIPT,
            icon: <Icon name="cif-browser-campaign-outline" className={"campaign-icon"}/>,
        },
        {
            title: this.i18n._t("Coupon").toString(),
            value: PAYMENT.COUPON,
            icon: <Icon name="cif-browser-campaign-outline" className={"campaign-icon"}/>,
        }
    ];

    componentDidMount() {
        this.props.setBreadcrumb("charge", this.i18n._t("Charge").toString(), "home");
    }
    /**
     * @func handleChangePaymentType
     * @desc Change Payment Type after click each payment method
     */
    private handleChangePaymentType(value: PAYMENT): void {
        if (!this.disable) {
            this.setState({
                selectedPayment: value,
                activeAmount: null,
            });
        }
    }
    /**
     * @func handleActiveAmount
     * @desc Change default amount buttons
     */
    private handleActiveAmount(index: number , value: number): void {
        this.setState({
           activeAmount: index,
           amountValue: value,
        });
    }
    /**
     * @func handleActiveInput
     * @desc active custom amount input
     */
    private handleActiveInput(): void {
        this.setState({activeInput: true});
    }
    /**
     * @func handleAmount
     * @desc reset default amount buttons
     */
    private handleAmount(): void {
        this.setState({
            activeAmount: null,
        });
    }
    /**
     * @func handleInputChange
     * @desc set amount after each input change
     */
    private handleInputChange(value) {
        this.setState({
            amountValue: value,
        });
    }
    /**
     * @func handleInputCoupon
     * @desc get value of textfield also limit it to certain length
     */
    private handleInputCoupon(event) {
        if (event.target.value.length <= 10) {
            this.setState({
                couponInput: event.target.value
            });
        }
    }
    /**
     * @func amountFormatter
     * @desc formats number
     * @param amount
     * @param currency is optional (shown in front of number)
     */
    private amountFormatter(amount , currency= "" ) {
        if (amount > 0 && currency !== "" ) {
            return currencyFormatter(amount) + " " + currency;
        }
        if (amount > 0) {
            return currencyFormatter(amount)("en-US") ;
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className={(CONFIG.DIR === "rtl") ? "charge-container-rtl" : "charge-container"}>
                <Row type="flex">
                    <Col span={17}>
                        <Row>
                            <span className="circle-number">1</span>
                            <Translate value={"Ways to charge your account"}/>
                        </Row>
                        <Row className={"select-box-justify"}>
                            <SelectBox span={8} items={this.PaymentTypes} initialSelect={this.state.selectedPayment}
                                       onChange={this.handleChangePaymentType.bind(this)}
                                       disable={this.disable}
                                       className={`center-select-box payment-type ${this.disable ? "select-box-disable" : ""}`}/>
                        </Row>
                        {this.state.selectedPayment === PAYMENT.ONLINE &&
                        <div>
                            <Row>
                                <span className="circle-number">2</span>
                                <Translate value={"Account charge amount"}/>
                            </Row>
                            <Row className="amount-wrapper">
                                <div className="amount-container first">
                                    <div className={`amount-box ${this.state.activeAmount === 1 ? "active" : "" }`}
                                         onClick={() => {
                                             this.handleActiveAmount(1, 500000);
                                         }}>
                                        <Translate value={"500,000 Toman"}/>
                                    </div>
                                </div>
                                <div className="amount-container">
                                    <div className={`amount-box ${this.state.activeAmount === 2 ? "active" : "" }`}
                                         onClick={() => {
                                             this.handleActiveAmount(2, 1000000);
                                         }}>
                                        <Translate value={"1,000,000 Toman"}/>
                                    </div>
                                </div>
                                <div className="amount-container">
                                    <div className={`amount-box ${this.state.activeAmount === 3 ? "active" : "" }`}
                                         onClick={() => {
                                             this.handleActiveAmount(3, 4000000);
                                         }}>
                                        <Translate value={"4,000,000 Toman"}/>
                                    </div>
                                    {this.state.isOffer &&
                                    <span className="gift"><Translate value={"10% free extra charge"}/></span>
                                    }
                                </div>
                                <div className="amount-container" onClick={() => {
                                    this.handleActiveAmount(4, 10000000);
                                }}>
                                    <div className={`amount-box ${this.state.activeAmount === 4 ? "active" : "" }`}>
                                        <Translate value={"10,000,000 Toman"}/>
                                    </div>
                                    {this.state.isOffer &&
                                    <span className="gift"><Translate value={"20% free extra charge"}/></span>
                                    }
                                </div>
                                <div className="amount-input-wrapper error-position">
                                    {!this.state.activeInput &&
                                    <div className="amount-text" onClick={() => {
                                        this.handleActiveInput();
                                    }}>
                                        <Translate value={"Arbitrary amount"}/>
                                    </div>
                                    }
                                    {this.state.activeInput &&
                                        <FormItem className="reset-margin">
                                            {getFieldDecorator("bankAmount", {
                                                initialValue: this.state.amountValue,
                                                rules: [{required: true , message: this.i18n._t("This field is required")}],
                                            })(
                                    <Currency
                                        className={"input-campaign amount-input"}
                                        currencyLenght={9}
                                        placeholder={(this.state.amountValue === null) ?
                                            this.i18n._t("Enter your amount") as string : ""}
                                        onKeyDown={() => {
                                            this.handleAmount();
                                        }}
                                        onChange={(e) => {
                                            this.handleInputChange(e);
                                        }}
                                        value={this.state.amountValue}
                                    />)}
                                        </FormItem>
                                    }
                                </div>
                            </Row>
                            <Row type="flex" align="middle" className="payment-box">
                                <Col className="payment-content" span={6}>
                                    <Translate value={"Amount of your charge"}/>
                                    {(this.state.amountValue === null ) ? "_____" : this.amountFormatter(this.state.amountValue, this.i18n._t("Toman").toString())}
                                </Col>
                                <Col className="payment-content border" span={6}>
                                    <Translate value={"Amount after 9% tax"}/>
                                    {(this.state.amountValue === null ) ? "_____" : this.amountFormatter(Math.ceil(this.state.amountValue * 1.09).toFixed(0), this.i18n._t("Toman").toString())}
                                </Col>
                                <Col className="payment-content" span={6}>
                                    <Translate value={"Amount of account"}/>
                                    <span
                                        className="green">{this.amountFormatter(this.state.amountValue + this.state.accountDeposit, this.i18n._t("Toman").toString())}</span>
                                </Col>
                                <Col className="payment-content" span={6}>
                                    <RaisedButton
                                        label={<Translate value="transfer to Bank Gate"/>}
                                        primary={true}
                                        className="button-next-step"
                                    />
                                </Col>
                            </Row>
                        </div>
                        }
                        {this.state.selectedPayment === PAYMENT.RECEIPT &&
                        <div>
                            <Row>
                                <span className="circle-number">2</span>
                                <Translate value={"Receipt information"}/>
                            </Row>
                            <Row type="flex" align="middle" className={"mt-1"} gutter={40}>
                                <Col span={7}>
                                    <span className="span-block input-title">{this.i18n._t("Follow up transaction number")}</span>
                                    <FormItem className={"reset-margin error-position"}>
                                        {getFieldDecorator("TransactionNumber", {
                                            initialValue: "",
                                            rules: [{required: true , message: this.i18n._t("This field is required")}],
                                        })(
                                <Input
                                    className={"input-campaign receipt-input"}
                                />)}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                        <span className="span-block input-title">{this.i18n._t("Amount")}</span>
                                    <div className={"receipt-wrapper"}>
                                        <FormItem className={"reset-margin error-position"}>
                                            {getFieldDecorator("bankAmount", {
                                                initialValue: this.state.amountValue,
                                                rules: [{required: true , message: this.i18n._t("This field is required")}],
                                            })(
                                    <Currency
                                        className={"receipt-input input-campaign"}
                                        currencyLenght={10}
                                        onChange={(value) => {
                                            this.handleInputChange(value);
                                        }}
                                        value={this.state.amountValue}
                                    />)}
                                        </FormItem>
                                    <span className={"receipt-currency"}><Translate value={"Toman"}/></span>
                                    </div>
                                </Col>
                            </Row>
                            <Row type="flex" align="middle" className="payment-box">
                                <Col className="payment-content" span={6}>
                                    <Translate value={"Amount of your charge"}/>
                                    {(this.state.amountValue === null ) ? "_____" : this.amountFormatter(this.state.amountValue, "Toman")}
                                </Col>
                                <Col className="payment-content border" span={6}>
                                    <Translate value={"Amount after decrease 9% of tax"}/>
                                    {(this.state.amountValue === null ) ? "_____" : this.amountFormatter(Math.floor(this.state.amountValue * 0.91).toFixed(0), "Toman")}
                                </Col>
                                <Col className="payment-content" span={8}>
                                    <Translate value={"Amount of account after deposits approval"}/>
                                    <span
                                        className="green">{this.amountFormatter(this.state.amountValue * 0.91 + this.state.accountDeposit, "Toman")}</span>
                                </Col>
                                <Col className="payment-content" span={4}>
                                    <RaisedButton
                                        label={<Translate value="Approve deposits"/>}
                                        primary={true}
                                        className="button-next-step"
                                    />
                                </Col>
                            </Row>
                        </div>
                        }
                        {this.state.selectedPayment === PAYMENT.COUPON &&
                        <div>
                            <Row>
                                <span className="circle-number">2</span>
                                <Translate value={"Receipt information"}/>
                            </Row>
                            <Row type="flex" align="middle" gutter={40}>
                                <Col span={8} className="mt-1">
                                    <div>
                                        <span className="span-block input-title">{this.i18n._t("10 number of your coupon")}</span>
                                        <FormItem>
                                            {getFieldDecorator("bankAmount", {
                                                initialValue: this.state.couponInput,
                                                rules: [{required: true , message: this.i18n._t("This field is required")}],
                                            })(
                                        <Input
                                            className={"receipt-input input-campaign"}
                                            value={this.state.couponInput}
                                        />)}
                                        </FormItem>
                                    </div>
                                </Col>
                            </Row>
                            <Row type="flex" align="middle" className="payment-box">
                                <Col className="payment-content border-left" span={9}>
                                    <Translate value={"your coupon amount"}/>
                                    {(this.state.amountValue === null ) ? "_____" : this.amountFormatter(this.state.amountValue, "Toman")}
                                </Col>
                                <Col className="payment-content" span={9}>
                                    <Translate value={"Amount of account after coupon approval"}/>
                                    <span
                                        className="green">{this.amountFormatter(this.state.amountValue + this.state.accountDeposit, "Toman")}</span>
                                </Col>
                                <Col className="payment-content" span={6}>
                                    <RaisedButton
                                        label={<Translate value="Approve coupon"/>}
                                        primary={true}
                                        className="button-next-step"
                                    />
                                </Col>
                            </Row>
                        </div>
                        }
                    </Col>
                    <Col span={7}>
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state: RootState) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
        unsetBreadcrumb: (name: string) => dispatch(unsetBreadcrumb(name)),
    };
}

export default Form.create()(ChargeContainer);