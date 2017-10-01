import * as React from "react";
import {MenuItem, SelectField} from "material-ui";
import "./style.less";

interface IProps {
    data: any;
}
interface IStates {
    values?: any;
    names?: string;
}

export default class Select2 extends React.Component<IProps, IStates> {
    constructor(props) {
        super(props);
        this.state = {values: []};
    }

    private  handleChange(event, index, values) {
        this.setState({values});
    }

    private handleRemove(dataValue) {
        let temp = this.state.values;
        temp.splice(temp.indexOf(dataValue), 1);
        this.setState({values: temp});
    }

    menuItems() {
        let Data = this.props.data;
            return Data.map((data) => (
                <MenuItem
                    key={data.value}
                    className={(this.state.values.indexOf(data.value) > -1) ? "hidden" : "show"}
                    insetChildren={true}
                    checked={this.state.values.indexOf(data.value) > -1}
                    value={data.value}
                    primaryText={data.name}
                />
            ));
        }

    private handleTags(data) {
        return data.map((data , i ) => (
            <div key={i} className={(this.state.values.indexOf(data.value) > -1) ? "show-tag" : "hidden-tag"}
                 data-value={data.value}>
                <span className="tag">{data.name}</span>
                <span className="close" onClick={() => {
                    this.handleRemove(data.value);
                }}>&#10005;</span>
            </div>
        ));
    }

    render() {
        return (
            <div>
                <SelectField
                    multiple={true}
                    value={this.state.values}
                    onChange={this.handleChange.bind(this)}
                >
                    {this.menuItems()}
                </SelectField>
                <div>
                    {this.handleTags(this.props.data)}
                </div>
            </div>
        );
    }
}
