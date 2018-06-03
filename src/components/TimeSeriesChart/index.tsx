import * as React from "react";
import {Row, Col} from "antd";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";
import "./style.less";
import I18n from "../../services/i18n/index";
import theme, {colorPalette} from "./theme";
import * as moment from "moment-jalaali";
import RangePickerWrapper, {IRangeObject} from "../RangePickerWrapper/index";
import {rangeType} from "../RangePicker";
import ServerStore from "../../services/ServerStore";
import {currencyFormatter} from "../../services/Utils/CurrencyFormatter";
import {renderMonth} from "../../services/Utils/renderMonth";


echarts.registerTheme("CampaignTimeSeries", theme);


export interface IDefinition {
  hash: string;
  checkable: boolean;
  multiselect: boolean;
  key: string;
}


/**
 * @interface IProps
 */
interface IProps {
  /**
   * @params dataFn - API call to get data
   */
  dataFn: any;

  /**
   * @params definitionFn - API call to get definition
   */
  definitionFn: any;

  /**
   * @params name - name of table for store in local storage
   */
  name: string;

  onChangeRange?: (rangeObj: IRangeObject) => void;

  query: any;

  dateRange?: IRangeObject;

  showRangePicker?: boolean;

  isGregorian ?: boolean;
}

interface IState {
  options: object;
  definition?: IDefinition;
  data?: any;
  loading?: boolean;
  chartData?: any;
  activeIndex?: number[];
  range?: IRangeObject;
}

class TimeSeriesChart extends React.Component<IProps, IState> {
  i18n = I18n.getInstance();
  queryLocal: any;
  dataLocal: any = this.props.dataFn;
  range: any;
  chartInc;
  monthFormat = this.props.isGregorian ? "month" : "jMonth";
  defaultRange: IRangeObject = {range: {
            from: moment().subtract(29 , "day"),
            to: moment() ,
        },
        type: rangeType.LAST_THIRTY_DAYS
    };

  constructor(props) {
    super(props);
    this.state = {
        options: {} ,
        activeIndex: [],
        chartData : {},
        range: props.dateRange ? props.dateRange : this.defaultRange,
    };

    this.changeRange = this.changeRange.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  public componentDidMount() {
      this.loadData();
  }
  public componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.query !== this.props.query) {
      this.queryLocal = nextProps.query;
        this.loadData();
        this.getOption();
    }
      if (nextProps.dataFn) {
          this.dataLocal = nextProps.dataFn;
       //   this.handleData();
          this.getOption();
      }
  }

  /**
   * Store table legend in local storage
   * @param  legend
   */
  private storeLegend(legend) {
    ServerStore.getInstance().setItem(`TIME_SERIES_LEGEND_${this.props.name}`, legend);
  }

  /**
   * Try to load legend from local storage
   * @returns
   */
  private restoreLegend() {
    return ServerStore.getInstance().getItem(`TABALE_SERIES_LEGEND_${this.props.name}`);
  }


private createXaxis(obj) {
    let xaxis = [];
    for (let i = 0 ; i < obj.data[0].data.length ; i++ ) {
       let x = new Date(obj.from);
        xaxis[i] = moment(x).add(i, "day").format("jYYYY/jM/jD");
    }
    let tempData = this.state.chartData;
    tempData.xaxis = xaxis;
    this.setState({chartData: tempData});
}
  /**
   * Try to load data from API Call
   * Also there was conflict between send date and date which come from API Call convert add 3:30 for fixing issue
   */
  loadData(callOnQueryChange: boolean = true) {

    let config = {};
    this.range = this.state.range.range ;
    if (this.range && this.range.from) {
        let fromTime = new Date(moment(this.range.from).toISOString()).getTimezoneOffset();
        config["from"] = moment(this.range.from).add(-fromTime , "minutes").toISOString();
    }
    if (this.range && this.range.to) {
        let toTime = new Date(moment(this.range.from).toISOString()).getTimezoneOffset();
        config["to"] = moment(this.range.to).add(-toTime , "minutes").toISOString();
    }
    this.props.dataFn(config).then((respond: any) => {
        let tempData = this.state.chartData;
        tempData.data = respond.data;
        tempData.data.sort(function(x , y){
            return x.order - y.order;
        });
        this.setState({chartData : tempData} , () => { this.createXaxis(respond); this.getOption(); } );
    });
  }


  private getOption() {
    let options = {
      grid: {
        top: 30,
        containLabel: true,
        left: -30,
      },
      tooltip: {
        formatter: (a) => {
          let tooltip = `<div class="chart-tooltip">
            <p class="pr-1">${a[0].axisValueLabel}</p>
            <table>
              ${a.map(c => {
              let hidden = false ;
              for (let i = 0 ; i < this.state.chartData.data.length ; i++ ) {
                if (this.state.chartData.data[i].title === c.seriesName && this.state.chartData.data[i].hidden !== undefined) {
                  hidden = this.state.chartData.data[i].hidden;
                }
              }
            const tr = `
                    <tr>
                      <td>${c.marker}</td>
                      <td>${this.i18n._t(c.seriesName)}</td>
                      <td>${currencyFormatter(c.value)}</td>
                    </tr>
                 `;
            return (hidden) ? "" : tr;
          }).join("")}
            </table>
          </div>`;
          return tooltip;
        },
        trigger: "axis",
        textStyle: {
          color: "#485465",
        },
        axisPointer: {
          type: "shadow",
          label: {
            show: true,
            backgroundColor: "#868686"
          }
        },
        backgroundColor: "rgba(255,255,255,1)",
        extraCssText: "border: 1px solid #DBDDE1; opacity: 0.9;"
      },
      title: {
        text: "ECharts entry example"
      },
      theme: "CampaignTimeSeries",
      xAxis: {
        data: this.state.chartData.xaxis,
        axisLabel: {
            fontFamily: "IRANSans",
            color: "#485465",
            fontSize: 12,
            formatter: (data) =>  {
                if ( data.length > 2  && (this.range.from.jYear() === this.range.to.jYear() && moment().jYear() === this.range.to.jYear())) {
                    return moment(data, "jYYYY/jM/jDD").jDate() + " " + renderMonth(moment(data, "jYYYY/jM/jDD") , false)  ;
                } else {
                    return data;
                }
            },
        }
      },
      legend: {
        show: true,
        // data: ["a", "b", "c"]
      },
      yAxis: {
          show: true,
          offset: -30,
          zlevel: 1,
          splitLine: {
              show: true,
              lineStyle: {
                  color: ["#000"],
                  opacity: 0.03
              }
          },
          axisLine: {
              show: false
          },
          axisTick: {
              show: false
          },
          axisLabel: {
              formatter: function(data){
                  if (this.state.chartData.data && this.state.chartData.data[0] && this.state.chartData.data[0].title === "Spend") {
                      return currencyFormatter(data) + "T";
                  }
                  if (data >= 1000 && data < 1000000) {
                      return  (data / 1000).toFixed(1) + "K";
                  }
                  if (data >= 1000000 ) {
                      return (data / 1000000).toFixed(1) + "M";
                  }
                  else {
                      return data;
                  }
              }.bind(this),
          verticalAlign: "bottom",
          }
      },
      data: this.state.chartData.data,
      series: (this.state.chartData.data) ? this.state.chartData.data.map(d => {
         if (d.hidden === false || d.hidden === undefined) {
             return {
                 name: d.title,
                 type: d.type,
                 areaStyle: {normal: {opacity: 0.3}},
                 data: d.data
             };
         }
         else {
             return {
                 name: d.title,
                 type: d.type,
                 areaStyle: {normal: {opacity: 0.3}},
                 data: 0
             };
         }
      }) : [],
    };
    this.setState({options});
  }

  private renderLegends(record, index) {
    const sum =  (record.data.length > 0) ? (record.data.reduce((t, v) => (t + v))) : 0 ;
    return <Col className="legend-item" key={index}>
      <a className={(record.hidden) ? "deactive" : "" } onClick={(e) => {
        e.persist();
        this.chartInc.dispatchAction({type: "legendToggleSelect", name: record.name});
        let tempRecord = record;
        tempRecord.hidden = !record.hidden;
        let tempChartData = this.state.chartData;
        tempChartData[this.state.chartData.data.indexOf(record)] = tempRecord;
        this.setState({
            chartData : tempChartData
        } , () => {this.getOption(); });
      }}>
        <h4>{currencyFormatter(sum)}</h4>
        <div className="bullet" style={{backgroundColor: colorPalette[index]}}></div>
        <h5 style={{color: colorPalette[index]}}>{this.i18n._t(record.title)}</h5>
      </a>
    </Col>;
  }

  private changeRange(rangeObject: IRangeObject) {
    this.setState({range: rangeObject} , () => {this.loadData(); });
    if (this.props.onChangeRange) {
      this.props.onChangeRange(rangeObject);
    }
  }

  public render() {
    return (
      <div>
        <Row type={"flex"} className="chart-header" align="middle">
          <Col>
            {this.state.chartData.data && this.state.chartData.data.map(this.renderLegends.bind(this))}
          </Col>
              {this.props.showRangePicker &&
              <Col className="chart-range-picker">
              <RangePickerWrapper
                  onChange={(range) => this.changeRange(range)}
                  value={this.state.range}
              />
              </Col>
              }
        </Row>
        <Row>
          <ReactEcharts className={"time-series-chart"}
            ref={(e: any) => {
              if (e)
                this.chartInc = e.getEchartsInstance();
            }}
            showLoading={false}
            theme="CampaignTimeSeries"
            option={this.state.options}
            notMerge={true}
            lazyUpdate={true}
          />
        </Row>
      </div>
    );
  }
}

export default TimeSeriesChart;
