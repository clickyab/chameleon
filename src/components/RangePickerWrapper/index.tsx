import * as React from "react";
import "./style.less";
import RangePicker , {rangeType} from "../RangePicker";
import * as moment from "moment-jalaali";
import onClickOutside from "react-onclickoutside";
import I18n from "../../services/i18n/index";

export interface IRangeObject {
    range: {
        from: moment.type;
        to: moment.type;
    };
    type: rangeType;
}

interface IProps {
    onChange?: (value: IRangeObject) => void;
    value?: IRangeObject | string;
}

interface IState {
    value: IRangeObject;
    selectedDay: any;
    currentMonth: moment.type;
    enterSecond: boolean;
    isGregorian: boolean;
    display: boolean;
}



class RangePickerWrapper extends React.Component<IProps, IState> {
    private i18n = I18n.getInstance();

    constructor(props) {
        super(props);
        this.state = {
            value: props.value ? props.value : moment(),
            selectedDay: [],
            currentMonth: moment(props.value),
            isGregorian: props.isGregorian ? props.isGregorian : false,
            enterSecond: false,
            display: false,
        };
    }
    private handleClick() {
        this.setState({display: !this.state.display});
    }

    private handleChange(value) {
        if (value.type === "custom") {
            let temp = value;
            temp.type = (temp.range.from.toString() === temp.range.to.toString()) ? moment(temp.range.from).format("jYYYY/jM/jD") : moment(temp.range.from).format("jYYYY/jM/jD") + this.i18n._t(" to ").toString() + ((temp.range.to) ? moment(temp.range.to).format("jYYYY/jM/jD") : "");
            if (this.props.onChange) {
                this.props.onChange(value);
            }
            this.setState({value: temp});
        }
        else {
            this.setState({value});
            if (this.props.onChange) {
                this.props.onChange(value);
            }
        }
        this.setState({display: false});
    }
    private handleClickOutside(evt) {
        this.setState({display: false});
    }

    render() {
        return (
            <div className="range-wrapper" >
                <div className="range-wrapper-input" onClick={this.handleClick.bind(this)}>
                    <input value={(this.state.value.type) ? this.i18n._t(this.state.value.type).toString() : this.i18n._t("Choose Date").toString()}/>
                </div>
                {this.state.display &&
                <div className="range-inside-wrapper">
                    <RangePicker {...this.props} onChange={(value) => this.handleChange(value)}/>
                </div>
                }
            </div>
        );
    }
}

export default onClickOutside(RangePickerWrapper);