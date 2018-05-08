import * as React from "react" ;
import {Input} from "antd";
import {InputProps} from "antd/lib/input/Input";

const {TextArea} = Input;

interface IState {
    value: string;
}

interface IProps extends InputProps {
    limit?: number;
    multiLine?: boolean;
}

export default class InputLimit extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value ? props.value : ""
        };
    }

    public componentWillReceiveProps(nextProps) {
        if (nextProps.value || nextProps.value === "") {
            this.setState({
                value: nextProps.value
            });
        }
    }

    public handleValueChange(e) {
        if (this.props.limit) {
            if (e.target.value.length <= this.props.limit) {
                this.setState({value: e.target.value});
                if (this.props.onChange) {
                    this.props.onChange(e);
                }
            }
        }
    }

    render() {
        let {limit, multiLine, ...rest} = this.props;
        return (
            <div className="input-limit-wrapper">
                {!this.props.multiLine &&
                <Input {...rest}
                    onChange={(e) => {
                    this.handleValueChange(e);
                }}  value={this.state.value}/>
                }
                {this.props.multiLine &&
                <TextArea onChange={(e) => {
                    this.handleValueChange(e);
                }} value={this.state.value} className={this.props.className} placeholder={this.props.placeholder}/>
                }
                {this.state.value &&
                <span className={`item-desc-num-input ${ (this.state.value.length < limit - 5) ? "green" : "red"}`}>
                 {limit - this.state.value.length}
                 </span>
                }
                {!this.state.value &&
                <span className={`item-desc-num-input green`}>
                 {limit - this.state.value.length}
                 </span>
                }
            </div>
        );
    }
}
