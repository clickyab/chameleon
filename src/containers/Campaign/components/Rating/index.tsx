import * as React from "react";
import {Rate} from "antd";
import {RateProps} from "antd/lib/rate";
import Translate from "../../../../components/i18n/Translate";
import "./style.less";

interface IProps extends RateProps {
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
        return (<div>
            {this.state.value || this.state.value === 0 && <span className={"rating-value"}><Translate value={"%s from 5"} params={[this.state.value.toString()]}/></span>}
            <Rate {...this.props} onChange={(value) => this.handleValue(value)} value={this.state.value}/>
        </div>);
    }

}
