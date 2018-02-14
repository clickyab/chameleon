import * as React from "react" ;

interface IState {
    value: string;
}

interface IProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>{
    limit?: number;
}
export default class InputLimit extends React.Component<IProps , IState> {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value ? props.value : ""
        };
    }
    public handleValueChange(e) {
        if (this.props.limit) {
            if (e.target.value.length <= this.props.limit) {
                this.setState({value: e.target.value});
            }
        }
    }
    render() {
        let {limit , ...rest} = this.props;
        return (
            <div>
            <input  onChange={(e) => {this.handleValueChange(e); }} {...rest} value={this.state.value} />
                {this.state.value &&
                <span
                    className={`item-desc-num-input ${ (this.state.value.length < limit - 5 ) ? "green" : "red"}`}>
                 {limit - this.state.value.length}
                 </span>
                }
                {!this.state.value &&
                <span
                    className={`item-desc-num-input green`}>
                 {limit - this.state.value.length}
                 </span>
                }
            </div>
        );
    }
}