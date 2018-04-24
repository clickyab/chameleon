import * as React from "react";
import DataTable from "../../../../components/DataTable/index";
import CONFIG from "../../../../constants/config";
import Translate from "../../../../components/i18n/Translate/index";
import {Row, Form, Col, notification,  Checkbox,  Spin, Input, Select} from "antd";
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

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

enum List {NEW, PREVIOUS}
enum WHITE_LIST {WHITE = "WHITE" , BLACK = "BLACK"}

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
    whiteList: WHITE_LIST ;
    selectedWebSites: any[];
    listType: List;
    typeModal: boolean;
    listName: string;
    listID?: number;
    listOFList?: any[];
}

@connect(mapStateToProps, mapDispatchToProps)
class SelectPublisherComponent extends React.Component <IProps, IState> {

    private i18n = I18n.getInstance();
    private checkedItems = [];
    private controllerApi = new ControllersApi();
    private listName ;

    /**
     * @constructor
     * @description set initial values
     * @param {IProps} props
     */
    constructor(props: IProps) {
        super(props);
        this.state = {
            currentCampaign: props.currentCampaign && props.currentCampaign.id === this.props.match.params.id ? props.currentCampaign : null,
            listOFList: [],
            whiteList: WHITE_LIST.WHITE,
            showPublisherTable: false,
            selectedWebSites: [],
            listType: List.PREVIOUS,
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
            if (campaign.inventory_id !== 0) {
                listType = List.NEW;
            } else if (!campaign.exchange && campaign.inventory_id === 0) {
                listType = List.PREVIOUS;
            } else {
                listType = List.PREVIOUS;
            }
            // TODO:: Un comment after API arrived
            // this.controllerApi.inventoryPresetsGet({})
            //     .then(data => {
            //         this.setState({
            //             listOFList: data,
            //             listType,
            //         });
            //     });
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
        this.checkedItems = keys;
    }

    private activePublisher() {
        this.setState({
            listType: List.PREVIOUS
        });
    }

    private createCustomList(): Promise<number> {
        return new Promise((res, rej) => {
            const controllerApi = new ControllersApi();
            controllerApi.inventoryPresetPost({
                payloadData: {
                    label: this.state.listName,
                    domains: this.checkedItems.map(d => d.toString()),
                    publisher_type: this.state.currentCampaign.kind,
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

    private handleSubmit() {

        const controllerApi = new ControllersApi();
        let promise: Promise<any>;
        let params = {
            id: this.state.currentCampaign.id.toString(),
            payloadData: {
                label:   this.state.listName,
                pub_ids: this.checkedItems.map(d => d.toString()),
            }
        };

        switch (this.state.listType) {
            case  List.PREVIOUS:
                if (this.state.showPublisherTable && !this.state.typeModal) {
                    promise = this.createCustomList()
                        .then(id => {
                            params.payloadData.list_id = id;
                            return controllerApi.campaignWbIdPut(params);
                        });
                } else {
                    params.payloadData.list_id = this.state.listID;
                    promise = controllerApi.campaignWbIdPut(params);
                }
                break;

            case List.NEW :
              //  params.payloadData.list_id = 0;
                promise = controllerApi.inventoryCreatePost(params);
                break;

            default:
                throw("List type had to selected");
        }

        promise.then((data) => {
            this.props.setSelectedCampaignId(data.id);
            this.props.setCurrentCampaign(data as ControllersCampaignGetResponse);
            this.props.history.push(`/campaign/upload/${data.id}`);
        }).catch((error) => {
            notification.error({
                message: this.i18n._t("Set publishers failed!"),
                className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                description: error.message,
            });
        });
    }

    /**
     * @func
     * @desc handle back button
     */
    private handleBack() {
        this.props.history.push(`/campaign/targeting/${this.props.match.params.id}`);
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


        return (
            <div dir={CONFIG.DIR} className="campaign-content">
                <h2><Translate value="Select Publishers"/></h2>
                <p><Translate value="Select Publishers description"/></p>
                <Row type="flex" align="middle">
                    <Form onSubmit={this.handleSubmit.bind(this)} className="full-width">
                        {!this.state.showPublisherTable &&
                        <Row type="flex" className={"mt-4"}>
                            <Col span={12}>
                                <Row type="flex">
                                    <Col span={4}>
                                        <Tooltip/>
                                        <label><Translate value="Select"/></label>
                                    </Col>
                                    <Col span={20}>
                                        <RadioButtonGroup defaultSelected={this.state.listType}
                                                          className="campaign-radio-group" name="pricing"
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
                                <Row type="flex">
                                    <Col span={4}>
                                    </Col>
                                    <Col span={20} className={"publisher-column"}>
                                        <Row gutter={5} className="publisher-custom-list">
                                            <Col span={12}>
                                                <Select
                                                    value={this.state.listID as any}
                                                    onChange={(value: any) => {
                                                        this.setState({
                                                            listID: value,
                                                        });
                                                    }}
                                                    className="select-input full-width">
                                                    {this.state.listOFList.map(item =>
                                                        (<Option key={item.id} value={item.id}
                                                        >{item.label + item.id}</Option>)
                                                    )}
                                                </Select>
                                            </Col>
                                            <Col span={12}>
                                                <Select
                                                    className="select-input full-width"
                                                    dropdownClassName={"select-dropdown"}
                                                    onChange={(value: any) => {
                                                        this.setState({
                                                            whiteList: value,
                                                        });
                                                    }}
                                                    value={this.state.whiteList as string}>
                                                    <Option
                                                        value={WHITE_LIST.WHITE}>{this.i18n._t("Whitelist")}</Option>
                                                    <Option
                                                        value={WHITE_LIST.BLACK}>{this.i18n._t("Blacklist")}</Option>
                                                </Select>
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
                                <Col span={14} offset={6}>
                                    <Row type="flex" gutter={16}>
                                        <Col span={12}>
                                            <Input
                                                className={"input-campaign"}
                                                onChange={(e) => {
                                                     this.listName = e.target.value;
                                                }}
                                                defaultValue={this.i18n._t("%s Publishers", {params: [this.state.currentCampaign.title]}).toString()}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Select
                                                className="select-input full-width"
                                                dropdownClassName={"select-dropdown"}
                                                onChange={(value: any) => {
                                                    this.setState({
                                                        whiteList: value,
                                                    });
                                                }}
                                                value={this.state.whiteList as string}>
                                                <Option value={WHITE_LIST.WHITE}>{this.i18n._t("Whitelist")}</Option>
                                                <Option value={WHITE_LIST.BLACK}>{this.i18n._t("Blacklist")}</Option>
                                            </Select>
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
    match ?: any;
    history?: any;
}

export default Form.create()(withRouter(SelectPublisherComponent as any));
