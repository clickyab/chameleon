import * as React from "react";
import {Row, Col} from "antd";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";
import "./style.less";
import I18n from "../../services/i18n/index";
import theme, {colorPalette} from "./theme";
import * as moment from "moment-jalaali";
import RangePickerWrapper, {IRangeObject} from "../RangePickerWrapper/index";


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
}

interface IState {
  options: object;
  definition?: IDefinition;
  data?: any;
  loading?: boolean;
  api?: any;
  activeIndex?: number[];
}

const api = {
  xType: "string | date",
  dataType: "number | percent",
  xaxis : ["۱ آبان", "cardign", "chiffon shirt", "pants", "heels", "socks", "shirt", "cardign", "chiffon shirt", "pants", "heels", "socks",
    "shirt", "cardign", "chiffon shirt", "pants", "heels", "socks", "shirt", "cardign", "chiffon shirt", "pants", "heels", "socks"],
  data: [
    {
      title: "fd  gdf gfd aaa",
      name: "aaa",
      type: "bar",
      hidden: true,
      data: [100, 20, 36, 10, 10, 20, 5, 20, 36, 10, 10, 20, 5, 20, 36, 10, 10, 20, 5, 20, 36, 10, 10, 20],
    },
    {
      title: "vvv",
      name: "vvv",
      type: "line",
      data: [4, 14, 50, 20, 5, 14, 8, 13, 15, 60, 10, 27, 4, 14, 50, 20, 5, 14, 8, 13, 15, 60, 10, 27]
    },
    {
      title: "hhh",
      name: "hhh",
      type: "line",
      data: [5, 20, 36, 10, 10, 20, 5, 20, 36, 10, 10, 20, 4, 14, 50, 20, 5, 14, 8, 13, 15, 60, 10, 27]
    }
  ]
};



class TimeSeriesChart extends React.Component<IProps, IState> {
  i18n = I18n.getInstance();
  query: any;
  range: any;
  chartInc;

  constructor(props) {
    super(props);
    this.state = {
        options: {} ,
        activeIndex: [],
        api : api,
    };

    this.changeRange = this.changeRange.bind(this);
  }

  public componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.query) {
      this.query = nextProps.query;
      this.getOption();
    }
  }

  /**
   * Store table definition in local storage
   * @param {IDefinition} definition
   */
  private storeDefinition(definition: IDefinition) {
    localStorage.setItem(`TIME_SERIES_DEFINITION_${this.props.name}`, JSON.stringify(definition));
  }

  /**
   * Try to load definition from local storage
   * @returns {IDefinition}
   */
  private restoreDefinition(): IDefinition | null {
    const def = localStorage.getItem(`TABALE_DEFINITION_${this.props.name}`);
    if (def) {
      return JSON.parse(def);
    } else {
      return null;
    }
  }

  /**
   * Try to load definition from local storage or API Call
   * @returns {Promise<IDefinition>}
   */
  private loadDefinition(): Promise<IDefinition> {
    return new Promise((res, rej) => {
      let def = this.restoreDefinition();
      if (def) {
        this.setState({
          definition: def,
        });
        res(def);
      } else {
        this.props.definitionFn({})
          .then((definition: IDefinition) => {
            this.setState({
              definition,
            });
            this.storeDefinition(definition);
            res(definition);
          })
          .catch((err) => {
            rej(err);
          });
      }
    });
  }


  /**
   * Try to load data from API Call and if data's hash response is different with definition's hash, try to load
   * new definition
   */
  loadData(callOnQueryChange: boolean = true) {

    let config = {
      loading: true,
    };

    if (this.range && this.range.from) {
      config["start"] = this.range.from.toISOString();
    }
    if (this.range && this.range.to) {
      config["end"] = this.range.to.toISOString();
    }

    this.props.dataFn(config).then((data: any) => {

      // TODO:: remove me
      data.data = data.data.map(d => {
        d["_actions"] = "edit, archive, copy";
        return d;
      });

      let def = this.restoreDefinition();
      if (def && def.hash === data.hash) {

        this.setState({
          data,
          definition: def,
          loading: false,
        });


      } else {
        this.storeDefinition(null);
        this.loadDefinition()
          .then((def) => {
            this.setState({
              data,
              // customField,
              loading: false,
              definition: def,
            }, () => {

            });

          });

      }
    });
  }


  private getOption() {
    let options = {
      grid: {
        top: 30,
        containLabel: true
      },
      tooltip: {
        formatter: (a) => {
          let tooltip = `<div class="chart-tooltip">
            <p class="pr-1">${a[0].axisValueLabel}</p>
            <table>
              ${a.map(c => {
              let hidden = false ;
              for (let i = 0 ; i < this.state.api.data.length ; i++ ) {
                if (this.state.api.data[i].title === c.seriesName && this.state.api.data[i].hidden !== undefined) {
                  hidden = this.state.api.data[i].hidden;
                }
              }
            const tr = `
                    <tr>
                      <td>${c.marker}</td>
                      <td>${c.seriesName}</td>
                      <td>${c.value}</td>
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
        data: this.state.api.xaxis
      },
      legend: {
        show: true,
        // data: ["a", "b", "c"]
      },
      yAxis: {},
      series: this.state.api.data.map(d => {
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
      }),
    };
    this.setState({options});
  }

  private renderLegends(record, index) {
    const sum = record.data.reduce((t, v) => (t + v));
    return <Col className="legend-item" key={index}>
      <a className={(record.hidden) ? "deactive" : "" } onClick={(e) => {
        e.persist();
        this.chartInc.dispatchAction({type: "legendToggleSelect", name: record.name});
        let tempRecord = record;
        tempRecord.hidden = !record.hidden;
        let tempApi = this.state.api;
        tempApi[this.state.api.data.indexOf(record)] = tempRecord;
        this.setState({
            api : tempApi
        } , () => {this.getOption(); });
      }}>
        <h4>{sum}</h4>
        <div className="bullet" style={{backgroundColor: colorPalette[index]}}></div>
        <h5 style={{color: colorPalette[index]}}>{record.title}</h5>
      </a>
    </Col>;
  }

  private changeRange(rangeObject: IRangeObject) {
    if (this.props.onChangeRange) {
      this.props.onChangeRange(rangeObject);
    }
  }

  public render() {
    return (
      <div>
        <Row type={"flex"} className="chart-header" align="middle">
          <Col>
            {this.state.api.data && this.state.api.data.map(this.renderLegends.bind(this))}
          </Col>
              {this.props.showRangePicker &&
              <Col className="chart-range-picker">
              <RangePickerWrapper
                  onChange={(range) => this.changeRange(range)}
                  value={this.props.dateRange}
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
