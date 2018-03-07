/**
 * @file Currency Component
 * @desc Currency component formats currency on input
 */
import * as React from "react";
import {TextField, TextFieldProps} from "material-ui";
import {currencyFormatter} from "../../services/Utils/CurrencyFormatter";
import {InputProps} from "antd/lib/input/Input";
import {Input} from "antd";

export interface IProps extends InputProps {
    stringValue?: (value: string) => void;
    className?: string;
    currencyLenght?: number;
}

interface IState {
    value?: number | string;
}

class Currency extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {value: props.value ? props.value : ""};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.value});
    }

    /**
     * @func handleValue
     * @param e send form event
     * @param val value of textfield
     * @desc only let user to type number type, remove ","  and set value and onChange
     */
    private handleValue(e) {
        let valueNumber = e.target.value.replace(/\D|,/g, "");
        if (!this.props.currencyLenght || this.props.currencyLenght >= valueNumber.length) {
            this.setState({value: valueNumber});
            if (this.props.onChange) {
                this.props.onChange(valueNumber);
            }
            if (this.props.stringValue) {
                this.props.stringValue(currencyFormatter(valueNumber));
            }
        }
    }

    public render() {
        const {currencyLenght, stringValue, ...rest} = this.props;
        return (
            <Input {...rest} value={this.state.value ? currencyFormatter(this.state.value) : ""}
                   onChange={(e) => this.handleValue(e)}/>
        );
    }
}

export default Currency;