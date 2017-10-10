import * as React from "react";
import DataTable from "../../../../components/DataTable/index";
import {ControllersApi} from "../../../../api/api";
import {Row, Col, Form} from "antd";
import SelectTag from "../../../../components/SelectTag/index";
import Translate from "../../../../components/i18n/Translate/index";
import Tooltip from "antd/lib/tooltip";
import {RadioButtonGroup, RadioButton, MenuItem, SelectField} from "material-ui";
import I18n from "../../../../services/i18n/index";
import STEPS from "../../steps";
import CONFIG from "../../../../constants/config";
import {RootState} from "../../../../redux/reducers/index";
import {setCurrentStep, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {withRouter} from "react-router";
import CheckBoxList, {ICheckboxItem} from "../../../../components/CheckboxList/index";
import IranMap from "../../../../components/IranMap/index";
import SelectList from "../../../../components/SelectList/index";

const FormItem = Form.Item;

enum INetworkType { "ISP_Cell", "ISP", "Cell" }

interface IProps {
  form: any;
  setCurrentStep: (step: STEPS) => {};
  setSelectedCampaignId: (id: number | null) => {};
  currentStep: STEPS;
  selectedCampaignId: number | null;
  match: any;
  history: any;
}


interface IState {
  checked: boolean;
  showOtherDevices: boolean;
  devices?: string[];
  showOtherBrands: boolean;
  brands?: string[];
  showOtherOS: boolean;
  oss?: string[];
  showOtherBrowser: boolean;
  Browsers?: string[];
  showOtherIAB: boolean;
  IAB?: string[];
  showOtherLocation: boolean;
  location?: string[];
  showOtherNetwork: boolean;
  NetworkType: INetworkType;
  Network?: string[];
  showISP: boolean;
  ISPs?: string[];
  showCellar: boolean;
  cellulars?: string[];
}

const persons2 = {
  "data": [
    {"id": 0, "title": "Leonardo sunches"},
    {"id": 1, "title": "Van Henry"},
    {"id": 2, "title": "April Tucker"},
    {"id": 3, "title": "Ralph Hubbard"},
    {"id": 4, "title": "Omar Alexander"},
    {"id": 5, "title": "Carlos Abbott"},
    {"id": 6, "title": "Miriam Wagner"},
    {"id": 7, "title": "Bradley Wilkerson"},
    {"id": 8, "title": "Virginia Andrews"},
    {"id": 9, "title": "Kelly Snyder"}
  ]
};

const devices: ICheckboxItem[] = [
  {
    value: "desktop",
    title: "desktop",
  },
  {
    value: "mobile",
    title: "mobile",
  },
  {
    value: "tablet",
    title: "tablet"
  },
  {
    value: "other",
    title: "other devices (smart TV, Apple TV)"
  }
];

class TargetingComponent extends React.Component <IProps, IState> {
  private collectionApi = new ControllersApi();
  private i18n = I18n.getInstance();
  private brands = [];
  private OSs = [];
  private ISPs = [];
  private Browsers = [];
  private categories = [];

  constructor(props: IProps) {
    super(props);
    this.state = {
      checked: false,
      showOtherDevices: false,
      showOtherBrands: false,
      showOtherOS: false,
      showOtherBrowser: false,
      showOtherIAB: false,
      showOtherLocation: false,
      showOtherNetwork: false,
      showCellar: false,
      showISP: false,
      NetworkType: INetworkType.ISP_Cell,
    };
  }

  private updateDevices(selectedDevices) {
    console.log(selectedDevices);
    this.setState({
      devices: selectedDevices,
    });
  }

  componentDidMount() {
    // load initial values
    this.collectionApi.assetManufacturersGet({})
      .then((brands) => {
        this.brands = brands;
        this.forceUpdate();
      });
    this.collectionApi.assetOsGet({})
      .then((OSs) => {
        this.OSs = OSs;
        this.forceUpdate();
      });
    this.collectionApi.assetIspGet({})
      .then((ISPs) => {
        this.ISPs = ISPs;
        this.forceUpdate();
      });
    this.collectionApi.assetBrowserGet({})
      .then((Browsers) => {
        this.Browsers = Browsers;
        this.forceUpdate();
      });
    this.collectionApi.assetCategoryGet({})
      .then((Categories) => {
        this.categories = Categories;
        this.forceUpdate();
      });
  }

  public render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div dir={CONFIG.DIR} className="campaign-content">
        <h2><Translate value="Targeting"/></h2>
        <p><Translate value="Targeting description"/></p>
        <Row>
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <Row type="flex">
              <Col span={4}>
                <label>Device Type</label>
              </Col>
              <Col span={15} offset={5}>
                <FormItem>
                  <RadioButtonGroup className="campaign-radio-group" name="days"
                                    onChange={(a, checked) => {
                                      if (checked) {
                                        this.setState({
                                          devices: [],
                                          showOtherDevices: false,
                                        });
                                      } else {
                                        this.setState({
                                          devices: [],
                                          showOtherDevices: true,
                                        });
                                      }
                                    }}>
                    <RadioButton className="campaign-radio-button"
                                 value={true}
                                 label={this.i18n._t("All Devices")}
                    />
                    <RadioButton className="campaign-radio-button"
                                 value={false}
                                 label={this.i18n._t("Select devices type")}
                    />
                  </RadioButtonGroup>
                  {this.state.showOtherDevices &&
                  <CheckBoxList
                    items={devices}
                    value={this.state.devices}
                    onChange={this.updateDevices.bind(this)}
                  />
                  }
                </FormItem>
              </Col>

              <Col span={4}>
                <label>Manufactures Brand</label>
              </Col>
              <Col span={15} offset={5}>
                <FormItem>
                  <RadioButtonGroup
                    className="campaign-radio-group" name="days"
                    onChange={(a, checked) => {
                      if (checked) {
                        this.setState({
                          brands: [],
                          showOtherBrands: false,
                        });
                      } else {
                        this.setState({
                          brands: [],
                          showOtherBrands: true,
                        });
                      }
                    }}>
                    <RadioButton className="campaign-radio-button"
                                 value={true}
                                 label={this.i18n._t("All Brands")}
                    />
                    <RadioButton className="campaign-radio-button"
                                 value={false}
                                 label={this.i18n._t("Select brands")}
                    />
                  </RadioButtonGroup>
                  {this.state.showOtherBrands &&
                    <SelectList data={persons2.data} />
                  }
                </FormItem>
              </Col>

              <Col span={4}>
                <label>Operation systems</label>
              </Col>
              <Col span={15} offset={5}>
                <FormItem>
                  <RadioButtonGroup
                    className="campaign-radio-group" name="days"
                    onChange={(a, checked) => {
                      if (checked) {
                        this.setState({
                          brands: [],
                          showOtherOS: false,
                        });
                      } else {
                        this.setState({
                          brands: [],
                          showOtherOS: true,
                        });
                      }
                    }}>
                    <RadioButton className="campaign-radio-button"
                                 value={true}
                                 label={this.i18n._t("All Operation Systems")}
                    />
                    <RadioButton className="campaign-radio-button"
                                 value={false}
                                 label={this.i18n._t("Select Operation Systems")}
                    />
                  </RadioButtonGroup>
                  {this.state.showOtherOS &&
                  <SelectTag
                    allOption={false}
                    placeholder={this.i18n._t("Select OS").toString()}
                    type={this.i18n._t("Operation system").toString()}
                    data={this.OSs.map(os => ({value: os.id, name: os.name}))}
                  />
                  }
                </FormItem>
              </Col>

              <Col span={4}>
                <label>Browsers</label>
              </Col>
              <Col span={15} offset={5}>
                <FormItem>
                  <RadioButtonGroup
                    className="campaign-radio-group" name="days"
                    onChange={(a, checked) => {
                      if (checked) {
                        this.setState({
                          Browsers: [],
                          showOtherBrowser: false,
                        });
                      } else {
                        this.setState({
                          Browsers: [],
                          showOtherBrowser: true,
                        });
                      }
                    }}>
                    <RadioButton className="campaign-radio-button"
                                 value={true}
                                 label={this.i18n._t("All Browsers")}
                    />
                    <RadioButton className="campaign-radio-button"
                                 value={false}
                                 label={this.i18n._t("Select Browsers")}
                    />
                  </RadioButtonGroup>
                  {this.state.showOtherBrowser &&
                  <SelectTag
                    allOption={false}
                    placeholder={this.i18n._t("Select Browsers").toString()}
                    type={this.i18n._t("Browsers").toString()}
                    data={this.Browsers.map(os => ({value: os.id, name: os.name}))}
                  />
                  }
                </FormItem>
              </Col>

              <Col span={4}>
                <label>IAB Categories</label>
              </Col>
              <Col span={15} offset={5}>
                <FormItem>
                  <RadioButtonGroup
                    className="campaign-radio-group" name="days"
                    onChange={(a, checked) => {
                      if (checked) {
                        this.setState({
                          IAB: [],
                          showOtherIAB: false,
                        });
                      } else {
                        this.setState({
                          IAB: [],
                          showOtherIAB: true,
                        });
                      }
                    }}>
                    <RadioButton className="campaign-radio-button"
                                 value={true}
                                 label={this.i18n._t("All Categories")}
                    />
                    <RadioButton className="campaign-radio-button"
                                 value={false}
                                 label={this.i18n._t("Select Categories")}
                    />
                  </RadioButtonGroup>
                  {this.state.showOtherIAB &&
                  <SelectTag
                    allOption={false}
                    placeholder={this.i18n._t("Select Categories").toString()}
                    type={this.i18n._t("Categories").toString()}
                    data={this.categories.map(c => ({value: c.id, name: c.name}))}
                  />
                  }
                </FormItem>
              </Col>

              <Col span={4}>
                <label>Geo location</label>
              </Col>
              <Col span={15} offset={5}>
                <FormItem>
                  <RadioButtonGroup
                    className="campaign-radio-group" name="days"
                    onChange={(a, value) => {
                      if (value === "foreign") {
                        this.setState({
                          location: ["foreign"],
                          showOtherLocation: false,
                        });
                      } else if (value) {
                        this.setState({
                          location: [],
                          showOtherLocation: false,
                        });
                      } else {
                        this.setState({
                          location: [],
                          showOtherLocation: true,
                        });
                      }
                    }}>
                    <RadioButton className="campaign-radio-button"
                                 value={true}
                                 label={this.i18n._t("All Iran Locations")}
                    />
                    <RadioButton className="campaign-radio-button"
                                 value={false}
                                 label={this.i18n._t("Select From Iran Locations")}
                    />
                    <RadioButton className="campaign-radio-button"
                                 value={"foreign"}
                                 label={this.i18n._t("Outside of Iran")}
                    />
                  </RadioButtonGroup>
                  {this.state.showOtherLocation &&
                  <IranMap/>
                  }
                </FormItem>
              </Col>

              <Col span={4}>
                <label>Internet Network</label>
              </Col>
              <Col span={15} offset={5}>
                <FormItem>
                  <RadioButtonGroup
                    className="campaign-radio-group" name="days"
                    onChange={(a, value) => {
                      if (value) {
                        this.setState({
                          ISPs: [],
                          cellulars: [],
                          showOtherNetwork: false,
                          NetworkType: INetworkType.ISP_Cell,
                          showISP: false,
                          showCellar: false,
                        });
                      } else {
                        this.setState({
                          ISPs: [],
                          cellulars: [],
                          showOtherNetwork: true,
                          NetworkType: INetworkType.ISP_Cell,
                          showISP: true,
                          showCellar: true,
                        });
                      }
                    }}>
                    <RadioButton className="campaign-radio-button"
                                 value={true}
                                 label={this.i18n._t("All Network")}
                    />
                    <RadioButton className="campaign-radio-button"
                                 value={false}
                                 label={this.i18n._t("Select Networks")}
                    />
                  </RadioButtonGroup>
                  {this.state.showOtherNetwork &&
                  <SelectField className={(CONFIG.DIR === "rtl") ? "select-tag-rtl" : "select-tag"}
                               value={this.state.NetworkType}
                               onChange={(event, index, value: INetworkType) => {
                                 this.setState({NetworkType: value});
                               }}
                               hintText={this.i18n._t("Network Type")}>
                    <MenuItem
                      key={-1}
                      className="show"
                      insetChildren={true}
                      value={INetworkType.ISP_Cell}
                      primaryText={this.i18n._t("ISP and Cellular").toString()}
                      onClick={() => {
                        this.setState({
                          showISP: true,
                          showCellar: true,
                        });
                      }}
                    />
                    <MenuItem
                      key={0}
                      className="show"
                      insetChildren={true}
                      value={INetworkType.ISP}
                      primaryText={this.i18n._t("ISP").toString()}
                      onClick={() => {
                        this.setState({
                          showISP: true,
                          showCellar: false,
                        });
                      }}
                    />
                    <MenuItem
                      key={1}
                      className="show"
                      insetChildren={true}
                      value={INetworkType.Cell}
                      primaryText={this.i18n._t("Cellular").toString()}
                      onClick={() => {
                        this.setState({
                          showISP: false,
                          showCellar: true,
                        });
                      }}
                    />
                  </SelectField>
                  }
                  {this.state.showISP && this.state.showOtherNetwork &&
                  <SelectTag
                    allOption={false}
                    placeholder={this.i18n._t("Select ISPs").toString()}
                    type={this.i18n._t("ISP").toString()}
                    data={this.categories.map(c => ({value: c.id, name: c.name}))}
                  />
                  }
                  {this.state.showCellar && this.state.showOtherNetwork &&
                  <SelectTag
                    allOption={false}
                    placeholder={this.i18n._t("Select Cellular").toString()}
                    type={this.i18n._t("Cellular").toString()}
                    data={this.categories.map(c => ({value: c.id, name: c.name}))}
                  />
                  }
                </FormItem>
              </Col>

            </Row>
          </Form>
        </Row>

      </div>
    );
  }

  private handleSubmit() {
    console.log("S");
  }

  private handleChangeDay() {
    console.log("C");
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

export default Form.create()(withRouter(TargetingComponent as any));
