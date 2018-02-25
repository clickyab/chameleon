import * as React from "react" ;

interface IState {
    value: string;
}

interface IProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    limit?: number;
    customOnChange?: (event) => void;
    multiLine?: boolean;
}
export default class InputLimit extends React.Component<IProps , IState> {
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
                if (this.props.customOnChange) {
                    this.props.customOnChange(e);
                }
            }
        }
    }
    render() {
        let {limit , customOnChange , ...rest} = this.props;
        return (
            <div className="input-limit-wrapper">
                {!this.props.multiLine &&
                <input onChange={(e) => {this.handleValueChange(e); }} {...rest} value={this.state.value} />
                }
                {this.props.multiLine &&
                    <textarea onChange={(e) => {this.handleValueChange(e); }} value={this.state.value}  className={this.props.className}>
                    </textarea>
                }
                {this.state.value &&
                <span className={`item-desc-num-input ${ (this.state.value.length < limit - 5 ) ? "green" : "red"}`}>
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