/**
 * @file Live Counter for explore page
 */
import * as React from "react";
import {Row, Col} from "antd";
import "./style.less";
import Translate from "../../../../../components/i18n/Translate";
import Icon from "../../../../../components/Icon";

interface IProps {
    publisherCount: number;
    avgViewCount: number;
    exchangeCount: number;
}

interface IState {
    publisherCount: number;
    avgViewCount: number;
    exchangeCount: number;
}

/**
 * @class LiveCounter
 * @desc Live counter for datatable showing publishers, avgView, exchange Count
 */
class LiveCounter extends React.Component<IProps , IState> {
    constructor(props) {
        super(props);
        this.state = {
            publisherCount: props.publisherCount ,
            avgViewCount: props.avgViewCount ,
            exchangeCount: props.exchangeCount ,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            publisherCount: nextProps.publisherCount,
            avgViewCount: nextProps.avgViewCount,
            exchangeCount: nextProps.exchangeCount,
        });
    }
    public render() {
        return (
            <Row type={"flex"} className="live-counter-container">
                <Col span={8} className="item-wrapper">
                    <div className="item-container">
                        <div className="live-counter-icon-container">
                            <Icon name={"cif-plusregular live-counter-icon"}/>
                        </div>
                        <span className="live-counter-title">
                           <Translate value={"Total Publishers"}/>
                            <span className="counter">{this.state.publisherCount}</span>
                        </span>
                    </div>
                </Col>
                <Col span={8} className="item-wrapper space">
                    <div className="item-container">
                        <div className="live-counter-icon-container">
                        <Icon name={"cif-plusregular live-counter-icon"}/>
                        </div>
                        <span className="live-counter-title">
                           <Translate value={"Average visit per month"}/>
                            <span className="counter">{this.state.avgViewCount}</span>
                        </span>
                    </div>
                </Col>
                <Col span={8} className="item-wrapper">
                    <div className="item-container">
                        <div className="live-counter-icon-container">
                            <Icon name={"cif-plusregular live-counter-icon"}/>
                        </div>
                        <span className="live-counter-title">
                           <Translate value={"Number of Exchanges"}/>
                            <span className="counter">{this.state.exchangeCount}</span>
                        </span>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default LiveCounter;