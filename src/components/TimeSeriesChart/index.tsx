import * as React from "react";
import {Row, Col} from "antd";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";
import "./style.less";
import I18n from "../../services/i18n/index";
import theme, {colorPalette} from "./theme";
import RangePicker, {IRangeObject} from "../RangePicker/index";


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

  onChangeRange?: (range: { from: string, to: string }) => void;

  query: any;
}

interface IState {
  options: object;
  definition?: IDefinition;
  data?: any;
  loading?: boolean;
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
      data: [5, 20, 36, 10, 10, 20, 5, 20, 36, 10, 10, 20, 5, 20, 36, 10, 10, 20, 5, 20, 36, 10, 10, 20]
    },
    {
      title: "bbb",
      name: "bbb",
      type: "line",
      hidden: true,
      data: [5, 20, 36, 10, 10, 20, 5, 20, 36, 10, 10, 20, 4, 14, 50, 20, 5, 14, 8, 13, 15, 60, 10, 27]
    },
    {
      title: "vvv",
      name: "vvv",
      type: "line",
      data: [4, 14, 50, 20, 5, 14, 8, 13, 15, 60, 10, 27, 4, 14, 50, 20, 5, 14, 8, 13, 15, 60, 10, 27]
    },
    {
      title: "bbb",
      name: "bbb",
      type: "line",
      data: [5, 20, 36, 10, 10, 20, 5, 20, 36, 10, 10, 20, 4, 14, 50, 20, 5, 14, 8, 13, 15, 60, 10, 27]
    },
    {
      title: "vvv",
      name: "vvv",
      type: "line",
      data: [4, 14, 50, 20, 5, 14, 8, 13, 15, 60, 10, 27, 4, 14, 50, 20, 5, 14, 8, 13, 15, 60, 10, 27]
    },
    {
      title: "bbb",
      name: "bbb",
      type: "line",
      data: [5, 20, 36, 10, 10, 20, 5, 20, 36, 10, 10, 20, 4, 14, 50, 20, 5, 14, 8, 13, 15, 60, 10, 27]
    },
    {
      title: "vvv",
      name: "vvv",
      type: "line",
      data: [4, 14, 50, 20, 5, 14, 8, 13, 15, 60, 10, 27, 4, 14, 50, 20, 5, 14, 8, 13, 15, 60, 10, 27]
    },
  ]
};



class TimeSeriesChart extends React.Component<IProps, IState> {
  i18n = I18n.getInstance();
  query: any;
  range: any;
  chartInc;

  constructor(props) {
    super(props);
    this.state = {options: {}};

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
        top: 80,
        containLabel: true
      },
      tooltip: {
        formatter: (a) => {
          let tooltip = `<div class="chart-tooltip">
            <p>${a[0].axisValueLabel}</p>
            <table>
              ${a.map(c => {
            const tr = `
                    <tr>
                      <td>${c.marker}</td>
                      <td>${c.seriesName}</td>
                      <td>${c.value}</td>
                    </tr>
                 `;
            return tr;
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
        extraCssText: "box-shadow: 0 0 5px rgba(0,0,0,0.3);"
      },
      color: ["rgb(25, 183, 207)"],
      title: {
        text: "ECharts entry example"
      },
      theme: "CampaignTimeSeries",
      xAxis: {
        data: api.xaxis
      },
      legend: {
        show: true,
        // data: ["a", "b", "c"]
      },
      yAxis: {},
      series: api.data.map(d => {
        return {
          name: d.title,
          type: d.type,
          areaStyle: {normal: {}},
          data: d.data
        };
      }),
    };
    this.setState({options});
  }

  private renderLegends(record, index) {
    const sum = record.data.reduce((t, v) => (t + v));
    return <Col key={index}>
      <a onClick={(e) => {
        e.persist();
        console.log(record);
        this.chartInc.dispatchAction({type: "legendToggleSelect", name: record.name});
      }}>
        <h4>{sum}</h4>
        <h1 style={{color: colorPalette[index]}}>.</h1>
        {record.title}
      </a>
    </Col>;
  }

  private changeRange(rangeObject: IRangeObject) {
    if (this.props.onChangeRange) {
      this.props.onChangeRange(rangeObject.range);
    }
  }

  public render() {
    return (
      <div>
        <Row type={"flex"}>
          <Col>
            {api.data && api.data.map(this.renderLegends.bind(this))}
          </Col>
          <Col>
            {/*<RangePicker*/}
              {/*onChange={this.changeRange}*/}
            {/*/>*/}
          </Col>
        </Row>
        <Row>
          <ReactEcharts
            ref={(e) => {
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
