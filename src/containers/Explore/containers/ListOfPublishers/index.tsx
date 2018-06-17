import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {RootState} from "../../../../redux/reducers/index";
import {Form} from "antd";
import {Row, Col, notification} from "antd";
import RaisedButton from "material-ui/RaisedButton";
import RadioButtonGroup from "material-ui/RadioButton/RadioButtonGroup";
import TextField from "material-ui/TextField";
import RadioButton from "material-ui/RadioButton";
import I18n from "../../../../services/i18n/index";
import Translate from "../../../../components/i18n/Translate/index";
import {Select} from "antd";
import Icon from "../../../../components/Icon";
import CONFIG from "../../../../constants/config";
import Tooltip from "../../../../components/Tooltip/index";
import {ControllersApi, OrmCampaign} from "../../../../api/api";
import DataTable from "../../../../components/DataTable/index";
import LiveCounter from "./LiveCounter";
import "./style.less";
import {setBreadcrumb} from "../../../../redux/app/actions/index";
import RemoteSelect from "../../../../components/RemoteSelect";

const Option = Select.Option;

const FormItem = Form.Item;


interface IOwnProps {
    match?: any;
    history?: any;
}

interface IProps {
    form: any;
    match: any;
    history: any;
    setBreadcrumb: (name: string, title: string, parent: string) => void;
}

interface IState {
    listName: string;
    whiteList: boolean;
    listOFLists?: any[];
    listID?: number;
    updateList: boolean;
    Statistics?: any;
}


@connect(mapStateToProps, mapDispatchToProps)
class ListOfPublisherComponent extends React.Component <IProps, IState> {

    private i18n = I18n.getInstance();
    private checkedItems = [];
    private controllerApi = new ControllersApi();

    constructor(props: IProps) {
        super(props);
        this.state = {
            listName: "",
            whiteList: true,
            listOFLists: [],
            updateList: false,
        };
    }

    public componentDidMount() {
        this.props.setBreadcrumb("explore", this.i18n._t("Explore").toString(), "home");
    }


    /**
     * @func
     * @description handle select publisher list's items
     * @param {string[]} keys
     * @param {any[]} rows
     */
    onSelectRow(keys: string[], rows: any[]) {
        this.checkedItems = rows.map(d => d.id);
    }


    /**
     * @func handleChangeUpdateMode
     * @desc Show update list/ text field to list's name
     * @param e
     * @param setAll
     */
    private handleChangeUpdateMode(e: any, update) {
        this.setState({
            updateList: update,
        });
    }

    private updateList(values) {
        this.controllerApi.inventoryAddpubIdPatch({
            id: values.listId,
            payloadData: {
                pub_ids: this.checkedItems,
            }
        }).then((data) => {
            notification.success({
                message: this.i18n._t("%s Updated.", {params: [data.label]}).toString(),
                className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                description: this.i18n._t("The publishers added to list!").toString(),
            });
        }).catch(e => {
            notification.error({
                message: this.i18n._t("Submit failed!").toString(),
                className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                description: this.i18n._t("Please check all fields and try again!").toString(),
            });
        });
    }

    private createNewList(values) {
        this.controllerApi.inventoryCreatePost({
            payloadData: {
                label: values.listName,
                pub_ids: this.checkedItems,
            }
        }).then(data => {
            notification.success({
                message: this.i18n._t("%s has been created.", {params: [data.label]}).toString(),
                className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                description: this.i18n._t("The publishers added to list!").toString(),
            });
        }).catch(() => {
            notification.error({
                message: this.i18n._t("Submit failed!").toString(),
                className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                description: this.i18n._t("Please check all fields and try again!").toString(),
            });
        });
    }

    private handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                notification.error({
                    message: this.i18n._t("Submit failed!").toString(),
                    className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                    description: this.i18n._t("Please check all fields and try again!").toString(),
                });
                return;
            }

            if (this.state.updateList) {
                this.updateList(values);
            } else {
                this.createNewList(values);
            }


        });
    }

    private onQueryChange(query) {
        this.controllerApi.inventoryBasePublishersStatisticsGet(query)
            .then((data) => {
                this.setState({
                    Statistics: data.data[0],
                });
            });
    }

    public render() {

        const {getFieldDecorator} = this.props.form;
        return (
            <div dir={CONFIG.DIR}>
                <Row type="flex" align="middle">
                    <LiveCounter
                        publisherCount={this.state.Statistics ? this.state.Statistics.count : 0}
                        avgViewCount={this.state.Statistics ? this.state.Statistics.avg_imp : 0}
                        exchangeCount={this.state.Statistics ? this.state.Statistics.exchange_count : 0}/>
                </Row>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Row type="flex" align="middle">
                        <DataTable
                            infinite={true}
                            name="publisherList"
                            onQueryChange={this.onQueryChange.bind(this)}
                            onSelectRow={this.onSelectRow.bind(this)}
                            definitionFn={this.controllerApi.inventoryPublisherListDefinitionGet}
                            dataFn={this.controllerApi.inventoryPublisherListGet}/>
                    </Row>

                    <Row type="flex" align="top">
                        <Col span={4}>
                            <label>
                                <Tooltip/>
                                <Translate value={"List Name"}/>
                            </label>
                        </Col>
                        <Col span={14} offset={6}>
                            <Row type="flex" gutter={16}>
                                <Col span={14}>
                                    <RadioButtonGroup className="campaign-radio-group" name="setAll"
                                                      defaultSelected={this.state.updateList}
                                                      onChange={this.handleChangeUpdateMode.bind(this)}>
                                        <RadioButton className="campaign-radio-button"
                                                     value={false}
                                                     label={this.i18n._t("Create New List")}
                                        />
                                        <RadioButton className="campaign-radio-button"
                                                     value={true}
                                                     label={this.i18n._t("Add to your created lists")}
                                        />
                                    </RadioButtonGroup>
                                </Col>
                            </Row>
                            <Row type="flex" gutter={16}>
                                <Col span={19}>
                                    {!this.state.updateList &&
                                    <div>
                                        {getFieldDecorator("listName", {
                                            initialValue: this.i18n._t("Inventory name").toString(),
                                            rules: [{
                                                required: true,
                                                message: this.i18n._t("Enter inventory name")
                                            }],
                                        })(
                                            <TextField
                                                fullWidth={true}
                                                onChange={(e, value) => {
                                                    this.setState({listName: value});
                                                }}
                                            />
                                        )}
                                    </div>
                                    }
                                    {this.state.updateList &&
                                    <div>
                                        {getFieldDecorator("listId", {
                                            rules: [{
                                                required: true,
                                                message: this.i18n._t("Enter inventory name")
                                            }],
                                        })(
                                            <RemoteSelect
                                                keyProps={"id"}
                                                labelProps={"label"}
                                                placeHolder={this.i18n._t("Select Inventory").toString()}
                                                dataFn={this.controllerApi.inventoryInventoryListGet}/>
                                        )}
                                    </div>
                                    }

                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row>

                        <RaisedButton
                            onClick={this.handleSubmit.bind(this)}
                            label={<Translate value="Save"/>}
                            primary={true}
                            className="button-next-step"
                            icon={<Icon name="cif-arrow-left" className={"arrow-next-step"}/>}
                        />
                    </Row>
                </Form>
            </div>
        );
    }
}


function mapStateToProps(state: RootState, ownProps: IOwnProps) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
    };
}

export default Form.create()(withRouter(ListOfPublisherComponent as any));
