/**
 * @file Currency Selector Component
 * @desc Currency Selector component formats currency on input
 */
import * as React from "react";
import Currency from "../../../../components/Currency";
import {commonCurrency} from "./commonCurrency";
import "./style.less";

interface IProps  {
    value?: string;
    type?: string;
    onChange?: (value) => void;
    onSubmit?: (type, value) => void;
    className?: string;
    placeholder?: string;
    currencyLimit?: number;
}

interface IState {
    value: string;
    type: string;
}

export default class CurrencySelector extends React.Component<IProps, IState> {
    private CurrencyTypes = commonCurrency;

    constructor(props) {
        super(props);
        this.state = {
            value: props.value ? props.value : "",
            type: props.type ? props.type : "",
        };
    }

    /**
     * @func handleValue
     * @param e send form event
     * @desc selector value will be handled also set onSubmit
     */
    private handleType(e) {
        let typeValue = e.target.value;
        this.setState({
            type: typeValue
        });
        if (this.props.onSubmit) {
            this.props.onSubmit(typeValue , this.state.value );
        }
    }

    /**
     * @func handleValue
     * @param item send form Currency Component which send value
     * @desc selector value will be handled also set onChange for antd pattern and onSubmit
     */
    private handleCurrency(item) {
        this.setState({
            value: item
        });
        if (this.props.onChange) {
            this.props.onChange(item);
        }
        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.type , item );
        }
    }

    render() {
        return(
            <div className={`currency-selector ${this.props.className ? this.props.className : ""}`}>
                <Currency placeholder={this.props.placeholder}
                          currencyLenght={this.props.currencyLimit ? this.props.currencyLimit : 9}
                          className={"input-campaign currency-selector"} value={this.state.value}
                          onChange={(item) => this.handleCurrency(item)}/>
                <select className="selector" value={this.state.type} onChange={this.handleType.bind(this)}>
                    {Object.values(this.CurrencyTypes).map((item, index) => {
                        return <option key={index}  value={item["symbol"]}>{item["symbol_native"]}</option>;
                    })}
                </select>
            </div>
        );
    }
}
