import {Select, Spin} from "antd";
// import debounce from "lodash/debounce";

const Option = Select.Option;
import * as React from "react";
import Translate from "../i18n/Translate";

interface IProps {
    dataFn: any;
    value?: any;
    onChange?: (value: string) => void;
    keyProps: string;
    labelProps: string;
    multiple?: boolean;
    placeHolder?: string;
}

interface IState {
    data: any[];
    value: any;
    fetching: boolean;
}

export default class RemoteSelect extends React.Component <IProps, IState> {

    constructor(props) {
        super(props);
        this.fetchData = this.fetchData;
        this.state = {
            data: [],
            value: this.props.value || null,
            fetching: false,
        };
    }

    fetchData = (value) => {
        this.setState({data: [], fetching: true});
        this.props.dataFn({params: {q: value}})
            .then((res) => {
                this.setState({data: res.data, fetching: false});
            });
    }

    handleChange = (value) => {
        let valueObj = value;
        let label;
        try {
            valueObj = JSON.parse(value);
            label = valueObj[this.props.labelProps];
            this.props.onChange(valueObj[this.props.keyProps]);
        } catch (e) {
            label = value;
            this.props.onChange(value);
        }
        this.setState({
            value: label,
            data: [],
            fetching: false,
        });
    }

    render() {
        const {fetching, data, value} = this.state;
        return (
            <Select
                mode={this.props.multiple ? "multiple" : "combobox"}
                value={value && value[this.props.labelProps] !== undefined && value[this.props.labelProps] !== null ? value[this.props.labelProps] : value}
                placeholder={this.props.placeHolder}
                notFoundContent={fetching ? <Spin size="small"/> : <Translate value={"Not Found"}/>}
                filterOption={false}
                onSearch={this.fetchData}
                onChange={this.handleChange}
                className="select-input full-width"
                dropdownClassName={"select-dropdown"}
                style={{width: "100%"}}>
                {data.map(d => <Option value={JSON.stringify(d)} key={d[this.props.keyProps]}>{d[this.props.labelProps]}</Option>)}
            </Select>
        );
    }
}
