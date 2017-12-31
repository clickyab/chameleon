import * as React from "react";
import DataTable from "../DataTable/index";
import TimeSeriesChart from "../TimeSeriesChart/index";

interface IProps {
  dataTableDefinitionFn: any;
  dataTableDataFn: any;
  chartDefinitionFn: any;
  chartDataFn: any;
  name: string;
}

interface IState {
  query: any;
  range?: { from: string, to: string };
}

export default class DataTableChartWrapper extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      query: {},
    };

    this.onQueryChange = this.onQueryChange.bind(this);
    this.onChangeRange = this.onChangeRange.bind(this);
  }

  onQueryChange(query: any) {
    this.setState({query});
  }

  onChangeRange(range: { from: string, to: string }) {
    this.setState({range});
  }


  render() {
    return (
      <div>
        <TimeSeriesChart
          query={this.state.query}
          name={this.props.name}
          dataFn={this.props.chartDataFn}
          definitionFn={this.props.dataTableDefinitionFn}
          onChangeRange={this.onChangeRange}/>
        <DataTable
          name={this.props.name}
          dateRange={this.state.range}
          onQueryChange={this.onQueryChange}
          dataFn={this.props.dataTableDataFn}
          definitionFn={this.props.dataTableDefinitionFn}/>
      </div>
    );
  }
}
