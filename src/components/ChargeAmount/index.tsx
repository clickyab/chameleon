/**
 * @file ChargeAmount Shortcut  component file
 */
import * as React from "react";
import {rangeCheck} from "../../services/Utils/CustomValidations";
import Translate from "../i18n/Translate/index";
import {Form, Row} from "antd";
import Currency from "../Currency/index";
import I18n from "../../services/i18n/index";

const FormItem = Form.Item;

interface IProps {
    onChange?: (item: number | null) => void;
    value?: number | null;
    isOffer?: boolean;
    hasDefault?: boolean;
}

interface IState {
    activeAmount: number | null;
    activeInput: boolean;
    amountValue: number | null;
    amountString: string | null;
    isOffer: boolean;
    value: number | null;
}


class ChargeAmountSelector extends React.Component<IProps, IState> {

    private i18n = I18n.getInstance();

    constructor(props) {
        super(props);
        this.state = {
            activeAmount: null,
            activeInput: false,
            amountValue: props.value ? props.value : null,
            amountString: null,
            isOffer: props.isOffer ? props.isOffer : false,
            value: props.value ? props.value : null,
        };
    }

    public componentDidMount() {
        if (this.props.hasDefault) {
            this.handleActiveAmount(1, 500000);
        }
    }

    /**
     * @func handleActiveAmount
     * @desc Change default amount buttons
     */
    private handleActiveAmount(index: number, value: number): void {
        this.setState({
            activeAmount: index,
            amountValue: value,
            value: value,
        });
        if (this.props.onChange) {
            this.props.onChange(value);
        }
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
    private handleInputChange = (value) => {
        this.setState({
            amountValue: value,
        });

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    render() {
        return (
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
                    <div className="reset-margin" style={{display: this.state.activeInput ? "block" : "none"}}>
                            <Currency
                                className={"input-campaign amount-input"}
                                currencyLenght={9}
                                placeholder={(this.state.amountValue === null) ?
                                    this.i18n._t("Enter your amount") as string : ""}
                                onFocus={() => {
                                    this.handleAmount();
                                }}
                                onChange={this.handleInputChange}
                                value={this.state.amountValue}
                            />
                    </div>
                </div>
            </Row>
        );
    }

}

export default ChargeAmountSelector;
