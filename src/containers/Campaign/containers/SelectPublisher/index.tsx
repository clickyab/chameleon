import * as React from "react";
import DataTable from "../../../../components/DataTable/index";
import CONFIG from "../../../../constants/config";
import Translate from "../../../../components/i18n/Translate/index";
import {Row, Form, Col, notification, Checkbox, Spin, Input, Select} from "antd";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import Modal from "../../../../components/Modal/index";
import {RootState} from "../../../../redux/reducers/index";
import STEPS from "../../steps";
import {setCurrentCampaign, setCurrentStep, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {RadioButton, RadioButtonGroup} from "material-ui";
import I18n from "../../../../services/i18n/index";
import Icon from "../../../../components/Icon/index";
import {ControllersApi, ControllersCampaignGetResponse} from "../../../../api/api";
import Tooltip from "../../../../components/Tooltip/index";
import {setBreadcrumb} from "../../../../redux/app/actions/index";
import "./style.less";
import StickyFooter from "../../components/StickyFooter";
import RemoteSelect from "../../../../components/RemoteSelect";

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

enum List {NEW, PREVIOUS}

enum LIST_TYPE {WHITE = "white_list", BLACK = "black_list"}

/**
 * @interface IProps
 */
interface IProps {
    setBreadcrumb: (name: string, title: string, parent: string) => void;
    setCurrentCampaign: (campaign: ControllersCampaignGetResponse) => void;
    currentCampaign: ControllersCampaignGetResponse;
    setCurrentStep: (step: STEPS) => {};
    form: any;
    setSelectedCampaignId: (id: number | null) => {};
    currentStep: STEPS;
    selectedCampaignId: number | null;
    match: any;
    history: any;
}

/**
 * @interface IState
 */
interface IState {
    currentCampaign: ControllersCampaignGetResponse;
    showPublisherTable: boolean;
    whiteList: LIST_TYPE.WHITE;
    selectedWebSites: any[];
    listType: List;
    typeModal: boolean;
    listName?: string;
    listID?: number;
    listOFList?: any[];
}

@connect(mapStateToProps, mapDispatchToProps)
class SelectPublisherComponent extends React.Component <IProps, IState> {

    private i18n = I18n.getInstance();
    private checkedItems = [];
    private controllerApi = new ControllersApi();
    private listName;

    /**
     * @constructor
     * @description set initial values
     * @param {IProps} props
     */
    constructor(props: IProps) {
        super(props);
        this.state = {
            currentCampaign: props.currentCampaign && props.currentCampaign.id === this.props.match.params.id ? props.currentCampaign : null,
            whiteList: LIST_TYPE.WHITE,
            showPublisherTable: false,
            selectedWebSites: [],
            listType: List.NEW,
            typeModal: false,
        };
    }

    public componentDidMount() {
        this.props.setCurrentStep(STEPS.SELECT_PUBLISHER);
        this.props.setBreadcrumb("selectPublisher", this.i18n._t("Select Publisher").toString(), "campaign");
        const collectionApi = new ControllersApi();
        collectionApi.campaignGetIdGet({
            id: this.props.match.params.id,
        }).then(campaign => {
            let listType: List;
            if (campaign.inventory_id !== 0 && campaign.inventory_id !== null) {
                listType = List.PREVIOUS;
            } else if (!campaign.exchange && campaign.inventory_id === 0) {
                listType = List.PREVIOUS;
            } else {
                listType = List.NEW;
            }

            this.setState({
                listType,
            });

            this.props.setBreadcrumb("campaignTitle", campaign.title, "selectPublisher");
            this.setState({
                currentCampaign: campaign,
                listID: campaign.inventory_id,
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
        this.checkedItems = rows.map(d => d.id);
    }

    private createCustomList(listName): Promise<number> {
        return new Promise((res, rej) => {
            const controllerApi = new ControllersApi();
            controllerApi.inventoryCreatePost({
                payloadData: {
                    label: listName,
                    pub_ids: this.checkedItems,
                }
            }).then(data => {

                this.setState({
                    listID: data.id,
                }, () => {
                    res(data.id);
                });
            }).catch(() => {
                rej();
            });
        });
    }

    private handleSubmit(e) {

        console.log(this.state);
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const controllerApi = new ControllersApi();
            let promise: Promise<any>;
            let params = {
                id: this.state.currentCampaign.id.toString(),
                payloadData: {
                    state: this.state.listType === List.NEW ? values.newListType : values.listType,
                    id: values.listId,
                }
            };

            switch (this.state.listType) {
                case  List.NEW:
                    promise = this.createCustomList(values.listName)
                        .then(id => {
                            params.payloadData.id = id;
                            return controllerApi.campaignInventoryIdPut(params);
                        });
                    break;

                case List.PREVIOUS :
                    promise = controllerApi.campaignInventoryIdPut(params);
                    break;

                default:
                    throw("List type have to selected");
            }

            promise.then((data) => {
                this.props.setSelectedCampaignId(data.id);
                this.props.setCurrentCampaign(data as ControllersCampaignGetResponse);
                this.props.history.push(`/campaign/upload/${data.id}`);
            }).catch((error) => {
                notification.error({
                    message: this.i18n._t("Set publishers failed!"),
                    className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                    description: error ? error.message : "",
                });
            });
        });
    }

    /**
     * @func
     * @desc handle back button
     */
    private handleBack() {
        this.props.history.push(`/campaign/budget/${this.props.match.params.id}`);
    }

    private handleTypeModal() {
        this.setState({typeModal: true});
    }

    private handleChangeList(event, type: List) {
        this.setState({
            listType: type
        });
    }

    /**
     * render component
     * @returns {any}
     */
    public render() {

        if (this.props.match.params.id && !this.state.currentCampaign) {
            return <Spin/>;
        }

        const {getFieldDecorator} = this.props.form;
        return (
            <div dir={CONFIG.DIR} className="campaign-content">
                <Row className={"campaign-title"}>
                <h2><Translate value="Select Publishers"/></h2>
                <p><Translate value="Select Publishers description"/></p>
                </Row>
                <Row type="flex" align="middle">
                    <Form onSubmit={this.handleSubmit.bind(this)} className="full-width">
                        {!this.state.showPublisherTable &&
                        <Row type="flex" className={"mt-4"}>
                            <Col span={24}>
                                <Row type="flex">
                                    <Col span={4}>
                                        <Tooltip/>
                                        <label><Translate value="List type"/></label>
                                    </Col>
                                    <Col span={10}>
                                        <RadioButtonGroup defaultSelected={this.state.listType}
                                                          className="campaign-radio-group publisher-radio" name="pricing"
                                                          onChange={this.handleChangeList.bind(this)}>
                                            <RadioButton className="campaign-radio-button"
                                                         value={List.NEW}
                                                         label={this.i18n._t("Make new list")}
                                            />
                                            <RadioButton className="campaign-radio-button"
                                                         value={List.PREVIOUS}
                                                         label={this.i18n._t("Use previous lists")}
                                            />
                                        </RadioButtonGroup>
                                    </Col>
                                </Row>
                                {this.state.listType === List.PREVIOUS &&
                                <Row type="flex" >
                                    <Col span={4}>
                                    </Col>
                                    <Col span={10} className={"publisher-column"}>
                                        <Row gutter={20} type={"flex"} className="publisher-custom-list" align={"bottom"}>
                                            <Col span={12}>
                                                <FormItem>
                                                    <span className="publisher-list-title"><Translate value={"Your lists:"}/></span>
                                                    {getFieldDecorator("listId", {
                                                        initialValue: this.state.currentCampaign.inventory,
                                                        rules: [{
                                                            required: true,
                                                            message: this.i18n._t("Select inventory")
                                                        }],
                                                    })(
                                                        <RemoteSelect
                                                            keyProps={"id"}
                                                            labelProps={"label"}
                                                            placeHolder={this.i18n._t("Select Inventory").toString()}
                                                            placeHolderEmpty={this.i18n._t("There is no inventory").toString()}
                                                            dataFn={this.controllerApi.inventoryInventoryListGet}/>
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem>
                                                    {getFieldDecorator("listType", {
                                                        initialValue: this.state.currentCampaign.inventory_type ? this.state.currentCampaign : LIST_TYPE.WHITE,
                                                        rules: [{
                                                            required: true,
                                                            message: this.i18n._t("Select inventory")
                                                        }],
                                                    })(
                                                        <Select
                                                            className="select-input full-width"
                                                            dropdownClassName={"select-dropdown"}
                                                        >
                                                            <Option key={LIST_TYPE.WHITE}
                                                                    value={LIST_TYPE.WHITE}>{this.i18n._t("Whitelist")}</Option>
                                                            <Option key={LIST_TYPE.BLACK}
                                                                    value={LIST_TYPE.BLACK}>{this.i18n._t("Blacklist")}</Option>
                                                        </Select>
                                                    )}
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                }
                            </Col>
                        </Row>
                        }
                        {this.state.listType === List.NEW &&
                        <Col span={4}>
                            <label>
                            </label>
                        </Col>
                        }
                        {this.state.listType === List.NEW &&
                        <div>
                            <Row>
                                <Col span={24} className="mt-5">
                                    <DataTable
                                        tableDescription={
                                            <div className="pub-table-title">
                                                <Icon name={"cif-edit"}/><Translate
                                                value={"Create new list and show on your selected websites"}/>
                                                <a onClick={() => (this.handleTypeModal())} className="mx-1"><Icon
                                                    name={"cif-edit"}/>
                                                    <Translate value={"Change inventory type"}/>
                                                </a>
                                            </div>
                                        }
                                        infinite={true}
                                        name="publisherList"
                                        onSelectRow={this.onSelectRow.bind(this)}
                                        definitionFn={this.controllerApi.inventoryPublisherListDefinitionGet}
                                        dataFn={this.controllerApi.inventoryPublisherListGet}/>
                                </Col>
                            </Row>
                            <Row type="flex" align="middle">
                                <Col span={4}>
                                    <label>
                                        <Tooltip/>
                                        <Translate value={"List Name"}/>
                                    </label>
                                </Col>
                                <Col span={12} offset={6}>
                                    <Row type="flex" gutter={16}>
                                        <Col span={14}>
                                            <FormItem className={"error-position"}>
                                                {getFieldDecorator("listName", {
                                                    initialValue: this.i18n._t("%s Publishers", {params: [this.state.currentCampaign.title]}).toString(),
                                                    rules: [{
                                                        required: true,
                                                        message: this.i18n._t("Enter inventory name")
                                                    }, {
                                                        whitespace: true,
                                                        min: 3,
                                                        message: this.i18n._t("Name should contain more than 3 character")
                                                    }
                                                    ],
                                                })(
                                                    <Input
                                                        className={"input-campaign"}
                                                        placeholder={this.i18n._t("exp: List of best iranian websites") as string}
                                                    />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={10}>
                                            <FormItem>
                                                {getFieldDecorator("newListType", {
                                                    initialValue: this.state.currentCampaign.inventory_type ? this.state.currentCampaign : LIST_TYPE.WHITE
                                                })(
                                                    <Select
                                                        className="select-input full-width"
                                                        dropdownClassName={"select-dropdown"}
                                                    >
                                                        <Option key={LIST_TYPE.WHITE}
                                                                value={LIST_TYPE.WHITE}>{this.i18n._t("White list")}</Option>
                                                        <Option key={LIST_TYPE.BLACK}
                                                                value={LIST_TYPE.BLACK}>{this.i18n._t("Blacklist")}</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                        }
                        <StickyFooter backAction={this.handleBack.bind(this)}
                                      nextAction={this.handleSubmit.bind(this)}/>
                    </Form>
                </Row>
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
        setCurrentStep: (step: STEPS) => dispatch(setCurrentStep(step)),
        setCurrentCampaign: (campaign: ControllersCampaignGetResponse) => dispatch(setCurrentCampaign(campaign)),
        setSelectedCampaignId: (id: number | null) => dispatch(setSelectedCampaignId(id)),
        setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
    };
}

interface IOwnProps {
    match?: any;
    history?: any;
}

export default Form.create()(withRouter(SelectPublisherComponent as any));
