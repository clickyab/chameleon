import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
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
import LiveCounter from "./LiveCounter";
import "./style.less";
import {setBreadcrumb} from "../../../../redux/app/actions/index";

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
        this.controllerApi.inventoryPresetsGet({})
            .then(data => {
                this.setState({
                    listOFLists: data,
                });
            });
    }


    /**
     * @func
     * @description handle select publisher list's items
     * @param {string[]} keys
     * @param {any[]} rows
     */
    onSelectRow(keys: string[], rows: any[]) {
        this.checkedItems = keys;
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
        });
    }


    public render() {

        const {getFieldDecorator} = this.props.form;
        return (
            <div dir={CONFIG.DIR}>
                <Row type="flex" align="middle">
                    <LiveCounter publisherCount={50943} avgViewCount={12931443} exchangeCount={2}/>
                </Row>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Row type="flex" align="middle">
                        <DataTable
                            infinite={true}
                            name="publisherList"
                            onSelectRow={this.onSelectRow.bind(this)}
                            definitionFn={this.controllerApi.inventoryListDefinitionGet}
                            dataFn={this.controllerApi.inventoryListGet}/>
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
                                    <TextField
                                        fullWidth={true}
                                        onChange={(e, value) => {
                                            this.setState({listName: value});
                                        }}
                                        defaultValue={this.state.listName}
                                    />
                                    }
                                    {this.state.updateList &&
                                    <SelectField
                                        value={this.state.listID}
                                        onChange={(e, i, value) => {
                                            this.setState({
                                                listID: value,
                                            });
                                        }}
                                        className="select-list-rtl full-width">
                                        {this.state.listOFLists.map(item =>
                                            (<MenuItem key={item.id} value={item.id}
                                                       primaryText={item.label + item.id}/>)
                                        )}
                                    </SelectField>
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
    return {
        currentStep: state.campaign.currentStep,
        currentCampaign: state.campaign.currentCampaign,
        selectedCampaignId: state.campaign.selectedCampaignId,
        match: ownProps.match,
        history: ownProps.history,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
    };
}

export default Form.create()(withRouter(ListOfPublisherComponent as any));
