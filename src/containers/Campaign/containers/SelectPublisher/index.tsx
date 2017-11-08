import * as React from "react";
import DataTable from "../../../../components/DataTable/index";
import CONFIG from "../../../../constants/config";
import Translate from "../../../../components/i18n/Translate/index";
import {Row, Form, Col, Table, Button, Checkbox, Switch} from "antd";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import Modal from "../../../../components/Modal/index";
import {RootState} from "../../../../redux/reducers/index";
import STEPS from "../../steps";
import {setCurrentStep, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
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
  showPublisherTable: boolean;
  whiteList: boolean;
  selectedWebSites: any[];
  listType: List;
  typeModal: boolean;
  customizeModal: boolean;
}

@connect(mapStateToProps, mapDispatchToProps)
class SelectPublisherComponent extends React.Component <IProps, IState> {

  private i18n = I18n.getInstance();
  private checkedItems = [];
  private columns = [
    {
      title: this.i18n._t("Site ID"),
      dataIndex: "id",
      key: "id",
    },
    {
      title: this.i18n._t("Website name"),
      dataIndex: "name",
      key: "name",
    }, {
      title: "remove",
      key: "action",
      dataIndex: "id",
      render: (text, record) => (
        <span>
             <Button onClick={() => {
               let items = this.state.selectedWebSites;
               const indexOfItem = items.findIndex(r => r.id.toString() === record.id.toString());
               console.log(indexOfItem);
               items.splice(indexOfItem, 1);
               this.setState({
                 selectedWebSites: items,
               });
             }}>
               <Icon name="cross"/>
             </Button>
        </span>
      )
    }
  ];

  /**
   * @constructor
   * @description set initial values
   * @param {IProps} props
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      whiteList: true,
      showPublisherTable: false,
      selectedWebSites: [],
      listType: List.CLICKYAB,
      typeModal: false,
      customizeModal: false,
    };
  }

  /**
   * @func
   * @description handle select publisher list's items
   * @param {string[]} keys
   * @param {any[]} rows
   */
  onSelectRow(keys: string[], rows: any[]) {
    this.checkedItems = rows;
  }

  private activePublisher() {
    this.setState(
      {showPublisherTable: true}
    );
  }

  private openCustomizeModal() {
    this.setState(
      {customizeModal: true}
    );
  }

  /**
   * @func
   * @description merge dataTale selected item with state selectedPublisher
   */
  private addPublisherToList() {
    let columnsRow = [];

    this.checkedItems.forEach((item) => {
      if (this.state.selectedWebSites.filter((i) => (i.id === item.id)).length === 0) {
        columnsRow.push(item);
      }
    });

    columnsRow = columnsRow.concat(this.state.selectedWebSites);
    this.setState({
      selectedWebSites: columnsRow,
    });
  }

  private handleSubmit() {
  }

  /**
   * @func
   * @desc handle back button
   */
  private handleBack() {
    this.props.setCurrentStep(STEPS.TARGETING);
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
    const controllerApi = new ControllersApi();
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
                {console.log(this.state.listType)}
                {this.state.listType === List.USER_CUSTOM &&
                <Row gutter={5} className="publisher-custom-list">
                  <Col span={12}>
                    <SelectField
                      className="select-list-rtl full-width">
                      <MenuItem value={2} primaryText="Every Night"/>
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
                  <div className="pub-table-title">
                    <Icon name={"cif-edit"}/><Translate value={"Create new list and show on your selected websites"}/>
                    <a onClick={() => (this.handleTypeModal())} className="mx-1"><Icon name={"cif-edit"}/><Translate
                      value={"Change inventory type"}/></a>
                    <Button
                      className="add-customize-btn"
                      onClick={() => {
                        this.openCustomizeModal();
                      }}>
                      <Icon name={"cif-gear-outline"} className="custom-icon"/>
                      <Translate value="Customize table"/>
                    </Button>
                  </div>
                  <DataTable
                    name="publisherList"
                    onSelectRow={this.onSelectRow.bind(this)}
                    definitionFn={controllerApi.inventoryListDefinitionGet}
                    dataFn={controllerApi.inventoryListGet}/>
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
                        defaultValue={this.i18n._t("List Name").toString()}
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
               onCancel={() => {
                 this.setState({typeModal: false});
               }}
        >
          <div className="publisher-content">
            <Translate
              value={"If you want to use all of network potential instead of choosing website/app manually please select on of below options"}/>
            <SelectField
              className="select-list-rtl full-width"
              value={List.CLICKYAB}
            >
              <MenuItem value={List.CLICKYAB}
                        primaryText={this.i18n._t("All website of Clickyab network and exchange")}/>
              <MenuItem value={List.EXCHANGE} primaryText={this.i18n._t("Select from my own list")}/>
            </SelectField>
          </div>
        </Modal>
        <Modal title={this.i18n._t("Customize Table").toString()}
               visible={this.state.customizeModal}
               customClass="customize-table-modal modal-rtl"
               okText={this.i18n._t("save") as string}
               cancelText={this.i18n._t("cancel") as string}
               onCancel={() => {
                 this.setState({customizeModal: false});
               }}
        >
          <div>
            <Row>
              <div className="mb-2"><Translate value={"Choose your table column from below options"}/></div>
              <CheckboxGroup className={`${(CONFIG.DIR === "rtl") ? "checkbox-rtl" : ""}`}>
                <Col span={10}>
                  <Checkbox value={"adType"}><Translate value={"Advertisment Type"}/></Checkbox>
                  <Checkbox value={"adSize"}><Translate value={"Advertisment Size"}/></Checkbox>
                </Col>
                <Col span={14}>
                  <Checkbox value={"websiteName"}><Translate value={"Website name"}/></Checkbox>
                  <Checkbox value={"catagory"}><Translate value={"Catagory"}/></Checkbox>
                  <Checkbox value={"dailyImp"}><Translate value={"Daily impression"}/></Checkbox>
                  <Checkbox value={"avgCPM"}><Translate value={"Avg. CPM"}/></Checkbox>
                  <Checkbox value={"exchange"}><Translate value={"Exchange"}/></Checkbox>
                  <Checkbox value={"os"}><Translate value={"Operation System"}/></Checkbox>
                </Col>
              </CheckboxGroup>
            </Row>
            <Row>
              <div className="pub-switch-wrapper">
                <Switch/>
                <Translate value={"only show last 30 days recent websites"}/>
              </div>
            </Row>
          </div>
        </Modal>
      </div>
    );
  }
}


function mapStateToProps(state: RootState, ownProps: IOwnProps) {
  return {
    currentStep: state.campaign.currentStep,
    selectedCampaignId: state.campaign.selectedCampaignId,
    match: ownProps.match,
    history: ownProps.history,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentStep: (step: STEPS) => dispatch(setCurrentStep(step)),
    setSelectedCampaignId: (id: number | null) => dispatch(setSelectedCampaignId(id)),
  };
}

interface IOwnProps {
  match ?: any;
  history?: any;
}

export default Form.create()(withRouter(SelectPublisherComponent as any));
