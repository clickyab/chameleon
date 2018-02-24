import * as React from "react";
import {Rate} from "antd";
import {RateProps} from "antd/lib/rate";
import Translate from "../../../../components/i18n/Translate";
import "./style.less";

interface IProps extends RateProps {
    customOnChange?: (item) => void;
}
interface IState {
    value: number;
}
export default class Rating extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value ? props.value : 0
        };
    }
    private handleValue(value) {
        this.setState({ value });
    }
    render() {
        const {onChange, ...rest} = this.props;
        return (<div>
            {this.state.value && <span className={"rating-value"}><Translate value={"%s from 5"} params={[this.state.value]}/></span>}
            <Rate {...rest} onChange={(value) => this.handleValue(value)} value={this.state.value}/>
        </div>);
    }

}