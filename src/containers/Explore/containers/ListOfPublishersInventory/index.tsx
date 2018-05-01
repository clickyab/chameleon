import * as React from "react";
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import {RootState} from "../../../../redux/reducers/index";
import {Form} from "antd";
import {Row, Col, notification, Spin} from "antd";
import {MenuItem, RadioButton, SelectField, TextField, RadioButtonGroup, RaisedButton} from "material-ui";
import I18n from "../../../../services/i18n/index";
import Translate from "../../../../components/i18n/Translate/index";
import {Select} from "antd";
import Icon from "../../../../components/Icon";
import CONFIG from "../../../../constants/config";
import Tooltip from "../../../../components/Tooltip/index";
import {ControllersApi, OrmCampaign} from "../../../../api/api";
import DataTable from "../../../../components/DataTable/index";
import "./style.less";
import {setBreadcrumb} from "../../../../redux/app/actions/index";

const FormItem = Form.Item;


interface IOwnProps {
    inventory: any;
    onChange: (record) => void;
}

interface IProps extends RouteComponentProps<any> {
    form: any;
    inventory: any;
    onChange: (record) => void;
    setBreadcrumb: (name: string, title: string, parent: string) => void;
}

interface IState {
    listName: string;
    whiteList: boolean;
    listID?: number;
    updateList: boolean;
}


@connect(mapStateToProps, mapDispatchToProps)
class ListOfPublishersInventoryComponent extends React.Component <IProps, IState> {

    private i18n = I18n.getInstance();
    private checkedItems = [];
    private controllerApi = new ControllersApi();

    constructor(props: IProps) {
        super(props);
        this.state = {
            listName: "",
            whiteList: true,
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


    private updateList() {
        this.controllerApi.inventoryRemovepubIdPatch({
            id: this.props.inventory.id.toString(),
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
        this.controllerApi.inventoryIdPut({
            id: this.props.inventory.id.toString(),
            payloadData: {
                label: values.listName,
            }
        }).then(data => {
            this.props.onChange(data);
            notification.success({
                message: this.i18n._t("%s has been updated.", {params: [data.label]}).toString(),
                className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                description: this.i18n._t("").toString(),
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
            this.createNewList(values);
        });
    }

    private loadData(config) {
        config.id = this.props.inventory.id;
        return this.controllerApi.inventoryPublisherListSingleIdGet(config);
    }

    private loadDefinition(config) {
        config.id = this.props.inventory.id;
        return this.controllerApi.inventoryPublisherListSingleIdDefinitionGet(config);
    }


    public render() {

        const {getFieldDecorator} = this.props.form;
        return (
            <div dir={CONFIG.DIR}>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Row type="flex" align="middle">
                        <DataTable
                            ref={"table"}
                            infinite={true}
                            name="publisherList"
                            onSelectRow={this.onSelectRow.bind(this)}
                            definitionFn={this.loadDefinition.bind(this)}
                            dataFn={this.loadData.bind(this)}
                            tableButtons={
                                [{
                                    title: this.i18n._t("Remove pulishers from list").toString(),
                                    icon: "cif-trashbin",
                                    onClick: () => {
                                        this.updateList();
                                        this.refs.table["removeRecords"](this.checkedItems);
                                    }
                                }
                                ]}
                        />
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
                                <Col span={19}>
                                    <div>
                                        {getFieldDecorator("listName", {
                                            initialValue: this.props.inventory.label,
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

export default withRouter<IOwnProps>(Form.create()(ListOfPublishersInventoryComponent));
