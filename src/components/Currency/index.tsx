/**
 * @file Currency Component
 * @desc Currency component formats currency on textfields
 */
import * as React from "react";
import {TextField , TextFieldProps} from "material-ui";
import {currencyFormatter} from "../../services/Utils/CurrencyFormatter";

interface IProps extends TextFieldProps {
    onChange?(e: React.FormEvent<{}>, newValue: string ): void;
    stringValue?: (value: string) => void;
    className?: string;
    currencyLenght?: number;
}
interface IState {
    value?: number | string;
}


class Currency extends React.Component<IProps , IState> {
    constructor(props) {
        super(props);
        this.state = { value: props.value ? props.value : ""};
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
    private handleValue(e, val) {
     let valueNumber = val.replace(/\D|,/g, "");
     if (!this.props.currencyLenght || this.props.currencyLenght >= valueNumber.length) {
         this.setState({value: valueNumber});
         if (this.props.onChange) {
             this.props.onChange(e, valueNumber);
         }
         if (this.props.stringValue) {
             this.props.stringValue(currencyFormatter(valueNumber));
         }
     }
    }
    public render() {
        return(
            <div>
            <TextField {...this.props} value={this.state.value ? currencyFormatter(this.state.value) : ""}
                       onChange={(e, value) => this.handleValue(e, value) } />
            </div>
        );
    }
}

export default Currency;