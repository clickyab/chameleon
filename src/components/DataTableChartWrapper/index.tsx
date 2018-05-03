import * as React from "react";
import DataTable from "../DataTable/index";
import TimeSeriesChart from "../TimeSeriesChart/index";
import {rangeType, IRangeObject} from "../RangePicker";
import {IActionsFn, ITableBtn} from "../DataTable/lib/interfaces";

interface IProps {
    dataTableDefinitionFn: any;
    dataTableDataFn: any;
    chartDefinitionFn: any;
    chartDataFn: any;
    name: string;
    dataTableDescription?: JSX.Element;
    showRangePicker?: boolean;
    dataTableButtons?: ITableBtn[];
    dataTableCustomRenderColumns?: { [key: string]: (value?: string, record?: any, index?: number) => JSX.Element };
    /**
     * @params actionsFn - an object with keys of each action function
     */
    dataTableActionsFn?: IActionsFn;

}

interface IState {
    query: any;
    rangeObj?: IRangeObject;
}

export default class DataTableChartWrapper extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            query: {},
        };

        this.onQueryChange = this.onQueryChange.bind(this);
        this.onChangeRange = this.onChangeRange.bind(this);
        this.dataTableRemoveRecords = this.dataTableRemoveRecords.bind(this);
        this.dataTableChangeRecordData = this.dataTableChangeRecordData.bind(this);
    }

    onQueryChange(query: any) {
        this.setState({query});
    }

    onChangeRange(rangeObj: IRangeObject) {
        this.setState({rangeObj});
    }

    public dataTableRemoveRecords(ids: number[]) {
        this.refs.table["removeRecords"](ids);
        this.refs.chart["loadData"]();
    }

    public dataTableChangeRecordData(index: number, newRecord: any) {
        this.refs.table["changeRecordData"](index, newRecord);
        this.refs.chart["loadData"]();
    }

    render() {
        return (
            <div>
                <TimeSeriesChart
                    ref={"chart"}
                    query={this.state.query}
                    name={this.props.name}
                    dataFn={this.props.chartDataFn}
                    definitionFn={this.props.dataTableDefinitionFn}
                    onChangeRange={this.onChangeRange}
                    dateRange={this.state.rangeObj}
                    showRangePicker={!!this.props.showRangePicker}
                />
                <DataTable
                    ref={"table"}
                    name={this.props.name}
                    dateRange={(this.state.rangeObj) ? this.state.rangeObj.range : null}
                    onQueryChange={this.onQueryChange}
                    dataFn={this.props.dataTableDataFn}
                    tableDescription={this.props.dataTableDescription}
                    definitionFn={this.props.dataTableDefinitionFn}
                    tableButtons={this.props.dataTableButtons}
                    actionsFn={this.props.dataTableActionsFn}
                    customRenderColumns={this.props.dataTableCustomRenderColumns}/>
            </div>
        );
    }
}
