///<reference path="../../../../../node_modules/@types/react-router/index.d.ts"/>
import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import {ControllersApi, ControllersCampaignGetResponse, UserResponseLoginOKAccount} from "../../../../api/api";
import {Form, Row, Col} from "antd";
import {setIsLogin, setUser} from "../../../../redux/app/actions/index";
// import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";
import CONFIG from "../../../../constants/config";
import "./style.less";
import {pieTheme, pieColorPalette} from "../../../../components/TimeSeriesChart/theme";
import Translate from "../../../../components/i18n/Translate";
import DataTable from "../../../../components/DataTable";
import {setBreadcrumb} from "../../../../redux/app/actions";
import moment = require("moment");

echarts.registerTheme("CampaignPieChart", pieTheme);

const FormItem = Form.Item;

interface IOwnProps {
    history?: any;
}

interface IProps extends RouteComponentProps<void> {
    setBreadcrumb: (name: string, title: string, parent: string) => void;
    form: any;
    dataTableDefinitionFn: any;
    dataTableDataFn: any;
    chartDefinitionFn: any;
    chartDataFn: any;
    name: string;
    dataTableDescription?: JSX.Element;
}

interface IState {
    options: object;
    apiData: any;
    apiTitle: string[];
    totalValue: number;
    query: any;
    range?: { from: string, to: string };
    currentCampaign?: ControllersCampaignGetResponse;
}


const api = [
    {value: 255, name: "11"},
    {value: 2000, name: "222"},
    {value: 12, name: "3333"}
];

@connect(mapStateToProps, mapDispatchToProps)
class DetailsDaily extends React.Component<IProps, IState> {

    private i18n = I18n.getInstance();
    private controllerApi = new ControllersApi();

    constructor(props: IProps) {
        super(props);
        this.state = {
            options: {},
            apiData: api,
            apiTitle: [],
            totalValue: 0,
            query: {},
        };
    }

    private loadCampaign() {
        const api = new ControllersApi();
        api.campaignGetIdGet({id: this.props.match.params["id"]})
            .then((campaign) => {
                this.setState({
                    currentCampaign: campaign,
                });
            });
    }

    /**
     * get title of piChart data (for sending to the chart option directly)
     * @param  data
     */
    private fillTitle(data) {
        let title: string[] = [];
        for (let i = 0; i < data.length; i++) {
            title[i] = data[i].name;
        }
        this.setState({
            apiTitle: title
        });
    }

    /**
     * find total value of pieChart element for finding percent
     * @param  data
     */
    private findTotalValue(data) {
        let totalValue = 0;
        for (let i = 0; i < data.length; i++) {
            totalValue += parseFloat(data[i].value);
        }
        this.setState({totalValue});
    }

    /**
     * Sort values of PieChart data
     * @param  data
     */
    private sortByValue(data) {
        let tempData = data;
        tempData.sort(function (x, y) {
            return y.value - x.value;
        });
        this.setState({apiData: tempData});
    }

    private loadData(config) {
        config.id = this.props.match.params["id"];
        return this.controllerApi.campaignPublisherDetailsIdGet(config);
    }

    private loadDefinition(config) {
        config.id = this.props.match.params["id"];
        return this.controllerApi.campaignPublisherDetailsIdDefinitionGet(config);
    }

    public componentDidMount() {
        this.props.setBreadcrumb("Daily", this.i18n._t("Detail of seprate viewer of %s - Data %s", {params: ["campName", "date"]}).toString(), "campaigns");
        this.sortByValue(this.state.apiData);
        // this.findTotalValue(this.state.apiData);
        // this.fillTitle(this.state.apiData);
        // this.getOption();
        this.loadCampaign();
    }

    public componentWillReceiveProps(nextProps: IProps) {
        this.getOption();
    }

    private getOption() {
        let options = {
            tooltip: {
                show: false,
            },
            legend: {
                orient: "vertical",
                x: "right",
                show: false,
                data: this.state.apiTitle
            },
            series:
                {
                    name: "alireza",
                    type: "pie",
                    selectedMode: "single",
                    radius: [0, "65%"],
                    label: {
                        normal: {
                            formatter: function (params) {
                                return `{b|${params.name}}\n{hr|}\n ${(params.percent).toFixed(1)}`;
                            },
                            backgroundColor: "#eee",
                            borderColor: "#aaa",
                            borderWidth: 1,
                            borderRadius: 4,
                            rich: {
                                hr: {
                                    borderColor: "#aaa",
                                    width: "100%",
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    color: "#999",
                                    lineHeight: 22,
                                    align: "center"
                                },
                                per: {
                                    color: "#eee",
                                    backgroundColor: "#334455",
                                    padding: [2, 4],
                                    borderRadius: 2
                                }
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true
                        }
                    },
                    data: this.state.apiData
                }

        };
        this.setState({options});
    }

    private renderLegends(record, index) {
        return <Col span={12} className="pie-legend-item" key={index}>
            <h4>{(parseFloat(record.value) * 100 / this.state.totalValue).toFixed(1) + "%"}</h4>
            <div className="bullet" style={{backgroundColor: pieColorPalette[index]}}></div>
            <h6 style={{color: pieColorPalette[index]}}>{record.name}</h6>
        </Col>;
    }

    public render() {
        const from = this.props.match.params["from"];
        const to = this.props.match.params["to"];
        return (
            <div dir={CONFIG.DIR} className="campaign-content">
                {this.state.currentCampaign &&
                <Row className="campaign-title" style={{marginBottom: "25px"}}>
                    <h5>
                        {from === to &&
                        <Translate value={"Detail of separate viewer of %s - Data %s"}
                                   params={[this.state.currentCampaign.title, this.i18n._d(from)]}/>
                        }
                        {from !== to &&
                        <Translate value={"Detail of separate viewer of %s - Data %s to %s"}
                                   params={[this.state.currentCampaign.title, this.i18n._d(from), this.i18n._d(to)]}/>
                        }
                    </h5>
                </Row>
                }
                <Row type="flex" className="campaign-details">
                    <Col span={6} className="legend-float">
                        {/*{this.state.apiData && this.state.apiData.map(this.renderLegends.bind(this))}*/}
                    </Col>
                    <Col span={6}>
                        {/*<ReactEcharts*/}
                        {/*className="piechart-container"*/}
                        {/*option={this.state.options}*/}
                        {/*theme={"CampaignPieChart"}*/}
                        {/*/>*/}
                    </Col>
                </Row>
                <Row type="flex">
                    <DataTable
                        infinite={true}
                        name="publisherList"
                        definitionFn={this.loadDefinition.bind(this)}
                        dateRange={{
                            from: moment(from),
                            to: moment(to),
                        }}
                        dataFn={this.loadData.bind(this)}/>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state: RootState, ownProps: IOwnProps) {
    return {
        user: state.app.user,
        history: ownProps.history,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setUser: (user: UserResponseLoginOKAccount) => dispatch(setUser(user)),
        setIsLogin: () => dispatch(setIsLogin()),
        setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
    };
}

export default Form.create()(withRouter(DetailsDaily as any));
