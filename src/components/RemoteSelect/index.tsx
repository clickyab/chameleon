import {Select, Spin} from "antd";
import debounce from "lodash/debounce";

const Option = Select.Option;
import * as React from "react";

interface IProps {
    fetchFn: any;
    value: any;
    onChange: any[];
}

interface IState {
    data: any[];
    value: any[];
    fetching: boolean;
}

class RemoteSelect extends React.Component {
    lastFetchId = 0;

    constructor(props) {
        super(props);
        this.fetchUser = debounce(this.fetchUser, 800);
        this.state = {
            data: [],
            value: [],
            fetching: false,
        };
    }

    fetchUser = (value) => {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({data: [], fetching: true});
        fetch('https://randomuser.me/api/?results=5')
            .then(response => response.json())
            .then((body) => {
                if (fetchId !== this.lastFetchId) { // for fetch callback order
                    return;
                }
                const data = body.results.map(user => ({
                    text: `${user.name.first} ${user.name.last}`,
                    value: user.login.username,
                }));
                this.setState({data, fetching: false});
            });
    }
    handleChange = (value) => {
        this.setState({
            value,
            data: [],
            fetching: false,
        });
    }

    render() {
        const {fetching, data, value} = this.state;
        return (
            <Select
                mode="multiple"
                labelInValue
                value={value}
                placeholder="Select users"
                notFoundContent={fetching ? <Spin size="small"/> : null}
                filterOption={false}
                onSearch={this.fetchUser}
                onChange={this.handleChange}
                style={{width: "100%"}}
            >
                {data.map(d => <Option key={d.value}>{d.text}</Option>)}
            </Select>
        );
    }
}
