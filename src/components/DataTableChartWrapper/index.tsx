import * as React from "react";
import DataTable from "../DataTable/index";
import TimeSeriesChart from "../TimeSeriesChart/index";
import {rangeType , IRangeObject} from "../RangePicker";
import * as moment from "moment";
import {ITableBtn} from "../DataTable/lib/interfaces";

interface IProps {
  dataTableDefinitionFn: any;
  dataTableDataFn: any;
  chartDefinitionFn: any;
  chartDataFn: any;
  name: string;
  dataTableDescription?: JSX.Element;
  showRangePicker?: boolean;
  dataTableButtons?: ITableBtn[];
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
      // rangeObj: {range: {
      //     from: moment(),
      //     to: moment().add(1, "day"),
      //     },
      //     type: rangeType.CUSTOM
      //     },
    };

    this.onQueryChange = this.onQueryChange.bind(this);
    this.onChangeRange = this.onChangeRange.bind(this);
  }

  onQueryChange(query: any) {
    this.setState({query});
  }

  onChangeRange(rangeObj: IRangeObject) {
    this.setState({rangeObj});
  }


  render() {
    return (
      <div>
        <TimeSeriesChart
          query={this.state.query}
          name={this.props.name}
          dataFn={this.props.chartDataFn}
          definitionFn={this.props.dataTableDefinitionFn}
          onChangeRange={this.onChangeRange}
          dateRange={this.state.rangeObj}
          showRangePicker={!!this.props.showRangePicker}
        />
        <DataTable
          name={this.props.name}
          dateRange={(this.state.rangeObj) ? this.state.rangeObj.range : null}
          onQueryChange={this.onQueryChange}
          dataFn={this.props.dataTableDataFn}
          tableDescription={this.props.dataTableDescription}
          definitionFn={this.props.dataTableDefinitionFn}
          tableButtons={this.props.dataTableButtons}/>
      </div>
    );
  }
}
