/**
 * @file Whitelabel Charge file
 * @address backoffice/whitelabel/billing/charge
 */
import * as React from "react";
import {connect} from "react-redux";
import {
    BASE_PATH,
    ControllersApi, OrmOnlinePayment,
    PaymentInitPaymentResp, UserApi,
    UserResponseLoginOKAccount, UserUserSearchResp
} from "../../../../../../api/api";
import {RootState} from "../../../../../../redux/reducers/index";
import I18n from "../../../../../../services/i18n/index";
import {currencyFormatter} from "../../../../../../services/Utils/CurrencyFormatter";
import Translate from "../../../../../../components/i18n/Translate/index";
import {Form, Row, Col, notification, Input, Button, Select} from "antd";
import {RaisedButton} from "material-ui/RaisedButton";
import {setUser, setBreadcrumb, unsetBreadcrumb} from "../../../../../../redux/app/actions/index";
import Icon from "../../../../../../components/Icon/index" ;
import CONFIG from "../../../../../../constants/config" ;
import "./style.less";
import SelectBox, {ISelectBoxItem} from "../../../../../Campaign/containers/Naming/Components/SelectBox";
import Currency from "../../../../../../components/Currency";
import {rangeCheck} from "../../../../../../services/Utils/CustomValidations";
import Modal from "../../../../../../components/Modal";
import {parseQueryString} from "../../../../../../services/Utils/parseQueryString";
import InputLimit from "../../../../../Campaign/components/InputLimit/InputLimit";

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

/**
 * @interface IProps
 * @desc define Prop object
 */
export interface IProps {
    form: any;
    user: UserResponseLoginOKAccount;
    setBreadcrumb: (name: string, title: string, parent: string) => void;
    unsetBreadcrumb: (name: string) => void;
    location?: any;
    history?: any;
}

/**
 * @interface IState
 * @desc define state object
 */
export interface IState {
    selectedPayment: PAYMENT;
    amountValue: number | null;
    accountDeposit: number | null;
    showModal?: boolean;
    JSXForm: JSX.Element;
    usersEmail: UserUserSearchResp;
}

enum PAYMENT { ACCOUNT = "account", GIFT = "gift"}

enum PAYMENT_STATUS {SUCCESS = "success", FAILED = "faild", RECEIPT = "receipt"}

@connect(mapStateToProps, mapDispatchToProps)

class WhiteLabelCharge extends React.Component<IProps, IState> {

    private i18n = I18n.getInstance();
    private cachedMails: any = {};
    private paymentStatus: PAYMENT_STATUS = PAYMENT_STATUS.SUCCESS;
    private paymentAmount: number;
    private clickyabResNumber: string;
    private bankRefNumber: string;
    private receiptTraceNumber: number;
    private errorBank: string;
    disable: boolean = false;

    constructor(props: IProps) {
        super(props);
        this.state = {
            selectedPayment: PAYMENT.ACCOUNT,
            amountValue: null,
            accountDeposit: props.user.balance ? props.user.balance : null,
            JSXForm: null,
            usersEmail: [],
        };
        this.handleTransactionTab = this.handleTransactionTab.bind(this);
    }

    PaymentTypes: ISelectBoxItem[] = [
        {
            title: this.i18n._t("Charge account").toString(),
            value: PAYMENT.ACCOUNT,
            icon: <Icon name="cif-money-charge" className={"whitelabel-charge-icon"}/>,
        },
        {
            title: this.i18n._t("With bank receipt").toString(),
            value: PAYMENT.GIFT,
            icon: <Icon name="cif-gift-charge" className={"whitelabel-charge-icon"}/>,
        },
    ];

    componentDidMount() {
        this.props.setBreadcrumb("charge", this.i18n._t("Charge").toString(), "home");
        const controllerApi = new ControllersApi();
        let parsedQuery = parseQueryString(this.props.location.search);
        if (parsedQuery.payment) {
            controllerApi.financialPaymentIdGet({id: parsedQuery.payment.toString()})
                .then((res: OrmOnlinePayment) => {
                    this.paymentAmount = res.amount;
                    this.clickyabResNumber = res.res_num;
                    this.bankRefNumber = res.ref_num;
                    this.errorBank = res.error_reason.BankReason;
                });
            this.setState({showModal: true});
            console.log("success", parsedQuery.success);
            if (parsedQuery.success === "true") {
                this.paymentStatus = PAYMENT_STATUS.SUCCESS;
            } else {
                this.paymentStatus = PAYMENT_STATUS.FAILED;
            }
        }
    }

    /**
     * @func handleChangePaymentType
     * @desc Change Payment Type after click each payment method
     */
    private handleChangePaymentType(value: PAYMENT): void {
        if (!this.disable) {
            this.setState({
                selectedPayment: value,
            });
        }
    }

    /**
     * @func amountFormatter
     * @desc formats number
     * @param amount
     * @param currency is optional (shown in front of number)
     */
    private amountFormatter(amount, currency = "") {
        if (amount >= 0 && currency !== "") {
            return currencyFormatter(amount) + " " + currency;
        }
        if (amount >= 0) {
            return currencyFormatter(amount)("en-US");
        }
    }

    /**
     * @func handleSubmitOnlinePayment
     * @desc as it's name indicate this function will validate and then redirect to bank gateway
     * @return {void}
     */
    private handleSubmitOnlinePayment = (e) => {
        if (e) e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                notification.error({
                    message: this.i18n._t("can't connect to gateway"),
                    className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                    description: this.i18n._t("Please check all fields and try again!").toString(),
                });
                return;
            }
            const controllerApi = new ControllersApi();
            controllerApi.financialPaymentInitPost({
                    payloadData: {
                        charge_amount: parseInt(values.paymentAmount),
                        gate_way: 1,
                    }
                }
            ).then((res) => {
                this.formGenerate(res);
                setTimeout(() => {
                    (document.getElementById("bank-online-payment") as HTMLFormElement).submit();
                }, 200);
            });
        });
    }

    private searchEmail(value) {
        if (value.length < 4) return;
        this.setState({usersEmail: []});
        const userApi = new UserApi();
        userApi.userSearchAdvertiserMailPost({
            payloadData: {
                email: value,
            }
        }).then((users) => {
            users.forEach(u => {
                this.cachedMails[u.email] = u.id;
            });
            this.setState({usersEmail: users});
        });
    }
    /**
     * @func handleTransactionTab
     * @desc Redirect to transactions Tab
     * @return {void}
     */
    private handleTransactionTab() {
        this.props.history.push(`/user/transactions`);
    }

    /**
     * @func handleSubmitReceipt
     * @desc will send request to submit bank receipt
     * @return {void}
     */
    private handleSubmitReceipt = (e) => {
        if (e) e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                notification.error({
                    message: this.i18n._t("can't submit receipt"),
                    className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                    description: this.i18n._t("Please check all fields and try again!").toString(),
                });
                return;
            }
            const controllerApi = new ControllersApi();
            controllerApi.financialAddPost({
                payloadData: {
                    amount: parseInt(values.bankAmount),
                    trace_number: parseInt(values.TransactionNumber)
                }
            })
                .then((res) => {
                    this.receiptTraceNumber = parseInt(values.TransactionNumber);
                    this.paymentStatus = PAYMENT_STATUS.RECEIPT;
                    this.setState({showModal: true});
                });
        });
    }

    /**
     * @func formGenerate
     * @desc generate Form for online payment
     * @return {void}
     */
    private formGenerate(data: PaymentInitPaymentResp) {
        let inputJSX = [];
        for (let key in data.params) {
            inputJSX.push(<Input key={key} readOnly={true} name={key} value={data.params[key]}/>);
        }
        this.setState({
            JSXForm: (
                <form id="bank-online-payment" method={data.method} action={data.bank_url}>
                    {inputJSX}
                </form>
            )
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className={"charge-container"}>
                <Row type="flex">
                    <Col span={17}>
                        <Row className="charge-titles mt-2">
                            <span className="circle-number">1</span>
                            <Translate value={"Ways to charge your account"}/>
                        </Row>
                        <Row className={"select-box-justify"}>
                            <SelectBox span={8} items={this.PaymentTypes} initialSelect={this.state.selectedPayment}
                                       onChange={this.handleChangePaymentType.bind(this)}
                                       disable={this.disable}
                                       className={`center-select-box payment-type ${this.disable ? "select-box-disable" : ""}`}/>
                        </Row>
                        <div>
                            <Row className="charge-titles">
                                <span className="circle-number">2</span>
                                <Translate value={"Account charge amount"}/>
                            </Row>
                            <Col span={12}>
                            </Col>
                            <Col span={12} className="charge-form">
                                <span className="span-block input-title require"><Translate value="Charge amount"/></span>
                                <Col span={12} className={"currency-container"}>
                                    <span className="vertical-center"><Translate value={"Toman"}/></span>
                                </Col>
                                <Col span={12}>
                                    <FormItem className="reset-margin">
                                        {getFieldDecorator("paymentAmount", {
                                            initialValue: this.state.amountValue,
                                            rules: [{
                                                validator: rangeCheck,
                                                minimum: 1000000,
                                                message: this.i18n._t("Minimum price is 1000000 toman per click")
                                            }],
                                        })(
                                            <Currency className={"input-campaign"} type={"toman"}
                                                      placeholder={"example: 25"}/>)}
                                    </FormItem>
                                        <span className={`span-block input-title mt-2`}>{this.i18n._t("Description")}</span>
                                    <FormItem>
                                        {getFieldDecorator("description"
                                        )(
                                            <InputLimit
                                                className={`input-campaign full-width description-input`}
                                                multiLine={true}
                                                limit={200}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Col>
                            <Row className="charge-titles">
                                <span className="circle-number">3</span>
                                <Translate value={"User information"}/>
                            </Row>
                            <Col span={18}>
                            </Col>
                            <Col span={6} style={{margin: "15px 0"}}>
                                <span className="span-block input-title require"><Translate value="User email"/></span>
                            <FormItem>
                                {getFieldDecorator("user_email"
                                )(
                                    <Select
                                        showSearch={false}
                                        mode="combobox"
                                        filterOption={false}
                                        className={"input-campaign full-width "}
                                        placeholder={this.i18n._t("exp: farzad.mohsenvand@gmail.com") as string}
                                        onSearch={this.searchEmail.bind(this)}
                                    >
                                        {this.state.usersEmail.map(d => <Option
                                            key={d.email}>{d.email}</Option>)}
                                    </Select>
                                )}
                            </FormItem>
                            </Col>
                            <Row type="flex" align="middle" className="payment-box">
                                <Col className="payment-content" span={6}>
                                    <Translate value={"User current balance"}/>
                                    {(this.props.form.getFieldValue("paymentAmount") === null) ? "_____" : this.amountFormatter(this.props.form.getFieldValue("paymentAmount"), this.i18n._t("Toman").toString())}
                                </Col>
                                <Col className="payment-content border" span={6}>
                                    <Translate value={"Name of receiver"}/>
                                    {}
                                </Col>
                                <Col className="payment-content" span={6}>
                                    <Translate value={"Amount of account after charging"}/>
                                    <span
                                        className="green">{this.amountFormatter(parseInt(this.props.form.getFieldValue("paymentAmount")) + this.state.accountDeposit, this.i18n._t("Toman").toString())}</span>
                                </Col>
                                <Col className="payment-content" span={6}>
                                    <RaisedButton
                                        label={<Translate value="Approve operation"/>}
                                        onClick={this.handleSubmitOnlinePayment}
                                        primary={true}
                                        className="button-next-step"
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col span={7}>
                    </Col>
                </Row>
                <div className={"form-hide"}>
                    {this.state.JSXForm}
                </div>
                <Modal visible={this.state.showModal}
                       footer={false}
                       customClass="payment-modal"
                >
                    <div className="info-modal-container">
                        {this.paymentStatus === PAYMENT_STATUS.SUCCESS &&
                        <div className="content-container-modal success">
                            <Icon name={"cif-checked-circle"} className={"info-modal-icon"}/>
                            <Translate className="success-title" value={"Account successfully charged"}/>
                            <span
                                className={"amount-modal"}>{this.paymentAmount ? currencyFormatter(Math.floor(this.paymentAmount * 1.91)) : null}</span>
                            <span className={"currency-modal"}>{this.i18n._t("Toman")}</span>
                            <Translate className="transaction-number" value={"number of transaction: %s"}
                                       params={[this.clickyabResNumber]}/>
                        </div>
                        }
                        {this.paymentStatus === PAYMENT_STATUS.FAILED &&
                        <div className="content-container-modal fail">
                            <Icon name={"cif-alert"} className={"info-modal-icon"}/>
                            <Translate className="fail-title" value={this.errorBank}/>
                            <Translate className="modal-description"
                                       value={"If the amount of your account deducted by the bank it should return after 72 hours to ypur account."}/>
                            <Translate className="transaction-number" value={"trace of bank: %s"}
                                       params={[this.bankRefNumber]}/>
                        </div>
                        }
                        {this.paymentStatus === PAYMENT_STATUS.RECEIPT &&
                        <div className="content-container-modal receipt">
                            <Icon name={"cif-alert"} className={"info-modal-icon"}/>
                            <Translate className="receipt-title"
                                       value={"Your account charge now added to financial department"}/>
                            <Translate className="modal-description"
                                       value={"Your bank receipt will be checked and your account will be charged and an email will send to you."}/>
                            <Translate className="transaction-number" value={"trace number: %s"}
                                       params={[this.receiptTraceNumber]}/>
                        </div>
                        }
                        <Button className="gray-btn" onClick={this.handleTransactionTab}>
                            <Icon name={"cif-arrow-left"}/>
                            <Translate value={"Go to list of transaction"}/>
                        </Button>
                    </div>
                </Modal>
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

export default Form.create()(WhiteLabelCharge);
