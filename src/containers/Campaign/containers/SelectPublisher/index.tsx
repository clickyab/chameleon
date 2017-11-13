import * as React from "react";
import DataTable from "../../../../components/DataTable/index";
import CONFIG from "../../../../constants/config";
import Translate from "../../../../components/i18n/Translate/index";
import {Row, Form, Col, notification, Button, Checkbox, Switch, Spin} from "antd";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import Modal from "../../../../components/Modal/index";
import {RootState} from "../../../../redux/reducers/index";
import STEPS from "../../steps";
import {setCurrentCampaign, setCurrentStep, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {MenuItem, RadioButton, RadioButtonGroup, SelectField, RaisedButton, TextField} from "material-ui";
import I18n from "../../../../services/i18n/index";
import Icon from "../../../../components/Icon/index";
import {ControllersApi, OrmCampaign} from "../../../../api/api";
import Tooltip from "../../../../components/Tooltip/index";
import "./style.less";

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

enum List {CLICKYAB, EXCHANGE, USER_CUSTOM}

/**
 * @interface IProps
 */
interface IProps {
  setCurrentCampaign: (campaign: OrmCampaign) => void;
  currentCampaign: OrmCampaign;
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
  currentCampaign: OrmCampaign;
  showPublisherTable: boolean;
  whiteList: boolean;
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
      whiteList: true,
      showPublisherTable: false,
      selectedWebSites: [],
      listType: List.CLICKYAB,
      typeModal: false,
      listName: "",
    };
  }

  public componentDidMount() {
    this.props.setCurrentStep(STEPS.SELECT_PUBLISHER);
    const collectionApi = new ControllersApi();
    collectionApi.campaignIdGet({
      id: this.props.match.params.id,
    }).then(campaign => {
      let listType: List;
      if (campaign.white_black_id !== 0) {
        listType = List.USER_CUSTOM;
      } else if (!campaign.exchange && campaign.white_black_id === 0) {
        listType = List.CLICKYAB;
      } else {
        listType = List.EXCHANGE;
      }
      this.controllerApi.inventoryPresetsGet({})
        .then(data => {
          this.setState({
            listOFList: data,
            listType,
          });
        });
      this.setState({
        currentCampaign: campaign,
        listID: campaign.white_black_id,
        listName: this.i18n._t("_{campaignName} Publishers", {params: {campaignName: campaign.title}}).toString(),
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
      showPublisherTable: true,
      listType: List.USER_CUSTOM
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
        exchange: true,
        list_id: 0,
        white_typ: this.state.whiteList,
      }
    };

    switch (this.state.listType) {
      case  List.USER_CUSTOM:
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

      case List.EXCHANGE :
        params.payloadData.list_id = 0;
        promise = controllerApi.campaignWbIdPut(params);
        break;

      case List.CLICKYAB :
        params.payloadData.exchange = false;
        params.payloadData.list_id = 0;
        promise = controllerApi.campaignWbIdPut(params);
        break;

      default:
        throw("List type had to selected");
    }

    promise.then((data) => {
      this.props.setSelectedCampaignId(data.id);
      this.props.setCurrentCampaign(data as OrmCampaign);
      this.props.history.push(`/campaign/upload/${data.id}`);
    }).catch((error) => {
      notification.error({
        message: this.i18n._t("Set publishers failed!"),
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

  /**
   * render component
   * @returns {any}
   */
  public render() {

    if (this.props.match.params.id && !this.state.currentCampaign) {
      return <Spin/>;
    }

    const invertorySelect = (
      <span>
        <SelectField className={"select-list-rtl select-publisher full-width"}
                     onChange={(a, b, value) => {
                       this.setState({
                         listType: value,
                       });
                     }}
                     value={this.state.listType}>
                  <MenuItem value={List.CLICKYAB} primaryText={this.i18n._t("All website of Clickyab network")}/>
                  <MenuItem value={List.EXCHANGE}
                            primaryText={this.i18n._t("All website of Clickyab network and exchange")}/>
                  <MenuItem value={List.USER_CUSTOM} primaryText={this.i18n._t("Select from my own list")}/>
                </SelectField>
        {this.state.listType === List.USER_CUSTOM &&
        <Row gutter={5} className="publisher-custom-list">
          <Col span={12}>
            <SelectField
              value={this.state.listID}
              onChange={(e, i, value) => {
                this.setState({
                  listID: value,
                });
              }}
              className="select-list-rtl full-width">
              {this.state.listOFList.map(item =>
                (<MenuItem key={item.id} value={item.id} primaryText={item.label + item.id}/>)
              )}
            </SelectField>
          </Col>
          <Col span={12}>
            <SelectField
              className="select-list-rtl full-width"
              onChange={(a, b, value) => {
                this.setState({
                  whiteList: value,
                });
              }}
              value={this.state.whiteList}>
              <MenuItem value={true} primaryText={this.i18n._t("Whitelist")}/>
              <MenuItem value={false} primaryText={this.i18n._t("Blacklist")}/>
            </SelectField>
          </Col>
        </Row>
        }
      </span>
    );

    return (
      <div dir={CONFIG.DIR} className="campaign-content">
        <h2><Translate value="Select Publishers"/></h2>
        <p><Translate value="Select Publishers description"/></p>
        <Row type="flex" align="middle">
          <Form onSubmit={this.handleSubmit.bind(this)} className="full-width">
            {!this.state.showPublisherTable &&
            <Row type="flex" className={"mt-4"}>
              <Col span={4}>
                <Tooltip/>
                <label><Translate value="Select"/></label>
              </Col>
              <Col span={20} className={"publisher-column"}>
                {invertorySelect}
                <div className="publisher-or-wrapper">
                  <hr className="publisher-line"/>
                  <div className="publisher-or-line"><Translate value={"OR"}/></div>
                </div>
                <RaisedButton
                  onClick={this.activePublisher.bind(this)}
                  label={<Translate value="Add Selected items to final list"/>}
                  primary={true}
                  className="btn-publisher"
                  fullWidth={true}
                  icon={<Icon name="cif-plusregular plus-icon "/>}
                />
              </Col>
            </Row>
            }
            {!this.state.showPublisherTable &&
            <Col span={4}>
              <label>
              </label>
            </Col>
            }
            {this.state.showPublisherTable &&
            <div>
              <Row>
                <Col span={24}>
                  <DataTable
                    tableDescription={
                      <div className="pub-table-title">
                        <Icon name={"cif-edit"}/><Translate
                        value={"Create new list and show on your selected websites"}/>
                        <a onClick={() => (this.handleTypeModal())} className="mx-1"><Icon name={"cif-edit"}/>
                          <Translate value={"Change inventory type"}/>
                        </a>
                      </div>
                    }
                    infinite={true}
                    name="publisherList"
                    onSelectRow={this.onSelectRow.bind(this)}
                    definitionFn={this.controllerApi.inventoryListDefinitionGet}
                    dataFn={this.controllerApi.inventoryListGet}/>
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
                      <TextField
                        fullWidth={true}
                        onChange={(e, value) => {
                          this.setState({listName: value});
                        }}
                        defaultValue={this.state.listName}
                      />
                    </Col>
                    <Col span={12}>
                      <SelectField
                        className="select-list-rtl full-width"
                        onChange={(a, b, value) => {
                          this.setState({
                            whiteList: value,
                          });
                        }}
                        value={this.state.whiteList}>
                        <MenuItem value={true} primaryText={this.i18n._t("Whitelist")}/>
                        <MenuItem value={false} primaryText={this.i18n._t("Blacklist")}/>
                      </SelectField>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            }
            <Row align="middle" className="mt-5">
              <RaisedButton
                onClick={this.handleBack.bind(this)}
                label={<Translate value="Back"/>}
                primary={false}
                className="button-back-step"
                icon={<Icon name={"cif-arrowleft-4"} className={"back-arrow"}/>}
              />
              <RaisedButton
                onClick={this.handleSubmit.bind(this)}
                label={<Translate value="Next Step"/>}
                primary={true}
                className="button-next-step"
                icon={<Icon name="cif-arrow-left" className={"arrow-next-step"}/>}
              />
            </Row>
          </Form>
        </Row>

        <Modal title={this.i18n._t("Change inventory").toString()}
               visible={this.state.typeModal}
               customClass={`inventory-type-modal ${(CONFIG.DIR === "rtl") ? "modal-rtl" : ""}`}
               okText={this.i18n._t("save") as string}
               cancelText={this.i18n._t("cancel") as string}
               onOk={this.handleSubmit.bind(this)}
               onCancel={() => {
                 this.setState({typeModal: false});
               }}
        >
          <div className="publisher-content">
            <Translate
              value={"If you want to use all of network potential instead of choosing website/app manually please select on of below options"}/>
            <div className="mt-2">{invertorySelect}</div>
          </div>
        </Modal>
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
    setCurrentCampaign: (campaign: OrmCampaign) => dispatch(setCurrentCampaign(campaign)),
    setSelectedCampaignId: (id: number | null) => dispatch(setSelectedCampaignId(id)),
  };
}

interface IOwnProps {
  match ?: any;
  history?: any;
}

export default Form.create()(withRouter(SelectPublisherComponent as any));
