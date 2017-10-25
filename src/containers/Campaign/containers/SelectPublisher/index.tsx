import * as React from "react";
import DataTable from "../../../../components/DataTable/index";
import {ControllersApi} from "../../../../api/api";
import CONFIG from "../../../../constants/config";
import Translate from "../../../../components/i18n/Translate/index";
import {Row, Form, Col, Table, Button} from "antd";
import {withRouter} from "react-router";
import {RootState} from "../../../../redux/reducers/index";
import STEPS from "../../steps";
import {setCurrentStep, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {MenuItem, RadioButton, RadioButtonGroup, SelectField, RaisedButton, TextField} from "material-ui";
import I18n from "../../../../services/i18n/index";
import Icon from "../../../../components/Icon/index";

const FormItem = Form.Item;

/**
 * @interface IProps
 */
interface IProps {
}

/**
 * @interface IState
 */
interface IState {
  showPublisherTable: boolean;
  whiteList: boolean;
  selectedWebSites: any[];
}

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
    console.log("back");
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
        <Row>
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <Col span={4}>
              <label><Translate value="Select"/></label>
            </Col>
            <Col span={15} offset={5}>
              <FormItem>
                <RadioButtonGroup
                  name="publisher"
                  valueSelected={this.state.showPublisherTable}
                  className="campaign-radio-group"
                  onChange={(a, checked) => {
                    if (checked) {
                      this.setState({
                        showPublisherTable: true,
                      });
                    } else {
                      this.setState({
                        showPublisherTable: false,
                      });
                    }
                  }}>
                  <RadioButton className="campaign-radio-button"
                               value={false}
                               label={this.i18n._t("Select From created lists")}
                  />
                  <RadioButton className="campaign-radio-button"
                               value={true}
                               label={this.i18n._t("Create new list")}
                  />
                </RadioButtonGroup>
              </FormItem>
            </Col>

            {!this.state.showPublisherTable &&
            <Col span={4}>
              <label>
              </label>
            </Col>
            }
            {!this.state.showPublisherTable &&
            <Col span={15} offset={5}>
              <SelectField>
                <MenuItem value={2} primaryText="Every Night"/>
              </SelectField>
              <SelectField
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
            }
            {this.state.showPublisherTable &&
            <div>
              <Row>
                <Col span={24}>
                  <DataTable
                    name="publisherList"
                    onSelectRow={this.onSelectRow.bind(this)}
                    definitionFn={controllerApi.inventoryListDefinitionGet}
                    dataFn={controllerApi.inventoryListGet}/>
                  <RaisedButton
                    onClick={this.addPublisherToList.bind(this)}
                    label={<Translate value="Add Selected items to final list"/>}
                    primary={true}
                    className="btn-add-list"
                    icon={<Icon name="cif-plusregular plus-icon "/>}
                  />
                </Col>
              </Row>
              <Row className={"mt-2"}>
                <Col>
                  <p><Translate value="List of selected publisher"/></p>
                  <Table dataSource={this.state.selectedWebSites} columns={this.columns} className={"campaign-data-table"}/>
                  <Button onClick={() => {
                    this.setState({
                      selectedWebSites: [],
                    });
                  }}>
                    <Icon name="remove"/>
                    <Translate value="Remove all items"/>
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col span={4}>
                  <label>
                    List Name
                  </label>
                </Col>
                <Col span={15} offset={5}>
                  <Row type="flex">
                    <Col>
                      <TextField
                        defaultValue={this.i18n._t("List Name").toString()}
                      />
                      <SelectField
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
            <Row  align="middle">
              <RaisedButton
                onClick={this.handleBack.bind(this)}
                label={<Translate value="Back"/>}
                primary={false}
                className="button-back-step"
                icon={ <Icon name={"cif-arrowleft-4"} className={"back-arrow"} />}
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
