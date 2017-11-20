///<reference path="../../../../api/api.ts"/>
import * as React from "react";
import {ControllersApi, OrmCampaign} from "../../../../api/api";
import {Col, Form, Row, Select, notification, Spin} from "antd";
import SelectTag from "../../../../components/SelectTag/index";
import Translate from "../../../../components/i18n/Translate/index";
import Tooltip from "../../../../components/Tooltip/index";
import {MenuItem, RadioButton, RadioButtonGroup, RaisedButton, SelectField} from "material-ui";
import I18n from "../../../../services/i18n/index";
import STEPS from "../../steps";
import CONFIG from "../../../../constants/config";
import {RootState} from "../../../../redux/reducers/index";
import {setCurrentCampaign, setCurrentStep, setSelectedCampaignId} from "../../../../redux/campaign/actions/index";
import {withRouter} from "react-router";
import CheckBoxList from "../../../../components/CheckboxList/index";
import IranMap from "../../../../components/IranMap/index";
import SelectList from "../../../../components/SelectList/index";
import "./style.less";
import Icon from "../../../../components/Icon/index";
import {connect} from "react-redux";
import {showWarningOnce} from "tslint/lib/error";
import AreaMap from "../../../../components/AreaMap/index";
import {setBreadcrumb} from "../../../../redux/app/actions/index";
import {DEVICE_TYPES, WEB_TYPES} from "../Type/index" ;

const Option = Select.Option;

const FormItem = Form.Item;

enum INetworkType { "ISP_Cell", "ISP", "Cell" }

enum ILocationType { "GM", "IRAN_MAP", "ALL", "FOREIGN" }


interface IOwnProps {
  match ?: any;
  history?: any;
}

interface IProps {
  setBreadcrumb: (name: string, title: string, parent: string) => void;
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

interface IState {
  currentCampaign: OrmCampaign;
  checked: boolean;
  showOtherDevices: boolean;
  devices: string[];
  showOtherBrands: boolean;
  brands: string[];
  showOtherOS: boolean;
  oss: string[];
  showOtherBrowser: boolean;
  browsers: string[];
  showOtherIAB: boolean;
  iabs: string[];
  showOtherLocation: boolean;
  locations: string[];
  showOtherNetwork: boolean;
  NetworkType: INetworkType;
  locationType: ILocationType;
  showISP: boolean;
  isps: string[];
  showCellar: boolean;
  cellulars: string[];
}

@connect(mapStateToProps, mapDispatchToProps)
class TargetingComponent extends React.Component <IProps, IState> {
  private collectionApi = new ControllersApi();
  private i18n = I18n.getInstance();
  private brands = [];
  private OSs = [];
  private ISPs = [];
  private Cellular = [];
  private browsers = [];
  private categories = [];
  private devices = [];


  constructor(props: IProps) {
    super(props);
    if (!props.currentCampaign.attributes || props.currentCampaign.id !== this.props.match.params.id) {
      this.state = {
        currentCampaign: null,
        devices: [],
        browsers: [],
        brands: [],
        oss: [],
        iabs: [],
        locations: [],
        isps: [],
        cellulars: [],
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
        locationType: ILocationType.ALL,
      };
    } else {
      const attr = props.currentCampaign.attributes;
      this.state = {
        currentCampaign: props.currentCampaign,
        devices: attr.device || [],
        browsers: attr.browser || [],
        brands: attr.manufacturer || [],
        oss: attr.os || [],
        iabs: attr.iab || [],
        locations: attr.region || [],
        isps: attr.isp || [],
        cellulars: attr.cellular || [],
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
        locationType: this.getLocationType(props.currentCampaign.kind as DEVICE_TYPES, attr.region || [])
      };
    }
  }

  componentDidMount() {
    // load initial values
    this.props.setCurrentStep(STEPS.TARGETING);
    this.props.setBreadcrumb("targeting", this.i18n._t("Targeting").toString(), "campaign");
    this.collectionApi.campaignIdGet({
      id: this.props.match.params.id,
    }).then(campaign => {
      const attr = campaign.attributes || {};

      let networkType: INetworkType;
      let showOtherNetwork: boolean = true;
      attr.isp = attr.isp || [];
      attr.cellular = attr.cellular || [];

      if (attr.isp.length > 0 && attr.cellular.length > 0) {
        networkType = INetworkType.ISP_Cell;
      } else if (attr.isp.length > 0) {
        networkType = INetworkType.ISP;
      } else if (attr.cellular.length > 0) {
        networkType = INetworkType.ISP_Cell;
      } else {
        showOtherNetwork = false;
      }
      this.props.setBreadcrumb("campaignTitle", campaign.title, "targeting");
      this.setState({
        currentCampaign: campaign,
        devices: attr.device || [],
        browsers: attr.browser || [],
        brands: attr.manufacturer || [],
        oss: attr.os || [],
        iabs: attr.iab || [],
        locations: attr.region || [],
        isps: attr.isp || [],
        cellulars: attr.cellular || [],
        checked: false,
        showOtherDevices: attr.device ? attr.device.length > 0 : false,
        showOtherBrands: attr.manufacturer ? attr.manufacturer.length > 0 : false,
        showOtherOS: attr.os ? attr.os.length > 0 : false,
        showOtherBrowser: attr.browser ? attr.browser.length > 0 : false,
        showOtherIAB: attr.iab ? attr.iab.length > 0 : false,
        showOtherNetwork: showOtherNetwork,
        showCellar: attr.cellular.length > 0,
        showISP: attr.isp.length > 0,
        NetworkType: networkType,
        locationType: this.getLocationType(campaign.kind.toUpperCase() as DEVICE_TYPES, attr.region || [])
      });
    });

    this.collectionApi.assetManufacturersGet({})
      .then((brands) => {
        this.brands = brands.map(brand => ({
          id: brand.name,
          title: this.i18n._t(brand.name),
        }));
        this.forceUpdate();
      });
    this.collectionApi.assetOsGet({})
      .then((OSs) => {
        this.OSs = OSs;
        this.forceUpdate();
      });
    this.collectionApi.assetIspKindGet({kind: "isp"})
      .then((ISPs) => {
        this.ISPs = ISPs;
        this.forceUpdate();
      });
    this.collectionApi.assetIspKindGet({kind: "cellular"})
      .then((cellulars) => {
        this.Cellular = cellulars;
        this.forceUpdate();
      });
    this.collectionApi.assetBrowserGet({})
      .then((browsers) => {
        this.browsers = browsers;
        this.forceUpdate();
      });
    this.collectionApi.assetCategoryGet({})
      .then((Categories) => {
        this.categories = Categories;
        this.forceUpdate();
      });
    this.collectionApi.assetPlatformGet({})
      .then((devices) => {
        this.devices = devices.map((platform) => ({value: platform.name, title: this.i18n._t(platform.name)}));
        this.forceUpdate();
      });
  }

  private getLocationType(deviceType: DEVICE_TYPES, locations: string[]): ILocationType {

    if (locations.length === 0) {
      return ILocationType.ALL;
    } else if (locations.length === 1 && locations[0] === "foreign") {
      return ILocationType.FOREIGN;
    } else {
      if (deviceType === DEVICE_TYPES.APPLICATION) {
        return ILocationType.GM;
      } else {
        return ILocationType.IRAN_MAP;
      }
    }

  }

  private updateDevices(selectedDevices) {
    console.log(selectedDevices);
    this.setState({
      devices: selectedDevices,
    });
  }

  private handleBack() {
    this.props.history.push(`/campaign/budget/${this.props.match.params.id}`);
  }

  private handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        notification.error({
          message: "Submit failed!",
          description: this.i18n._t("Please check all fields and try again!").toString(),
        });
        return;
      }
    });
    const api = new ControllersApi();
    api.campaignAttributesIdPut({
      id: this.state.currentCampaign.id.toString(),
      payloadData: {
        browser: this.state.browsers,
        manufacturer: this.state.brands,
        iab: this.state.iabs,
        region: this.state.locationType === ILocationType.FOREIGN ? ["foreign"] : this.state.locations,
        cellular: this.state.cellulars,
        isp: this.state.isps,
        device: this.state.devices,
        os: this.state.oss,
      }
    }).then(data => {
      this.props.setCurrentCampaign(data as OrmCampaign);
      this.props.history.push(`/campaign/select-publisher/${data.id}`);
    }).catch((error) => {
      notification.error({
        message: this.i18n._t("Campaign update failed!"),
        description: error.message,
      });
    });
  }

  public render() {

    if (this.props.match.params.id && !this.state.currentCampaign) {
      return <Spin/>;
    }

    const {getFieldDecorator} = this.props.form;
    let attr = this.state.currentCampaign.attributes || {};

    return (
      <Row>
        <Col>
          <div dir={CONFIG.DIR} className="campaign-content">
            <div className="campaign-title">
              <h2><Translate value="Targeting"/></h2>
              <p><Translate value="Targeting description"/></p>
            </div>
            <div className={(CONFIG.DIR === "ltr" ) ? "targeting" : "targeting-rtl"}>
              <Form onSubmit={this.handleSubmit.bind(this)}>
                {/* Devices */}
                <Row type="flex" className="targeting-row">
                  <Col span={5} className="title-target">
                    <Tooltip/>
                    <label>{this.i18n._t("Device Type")}</label>
                  </Col>
                  <Col span={19}>
                    <FormItem>
                      <RadioButtonGroup className="campaign-radio-group" name="devices"
                                        valueSelected={this.state.showOtherDevices}
                                        defaultSelected={this.state.showOtherDevices}
                                        onChange={(a, checked) => {
                                          this.setState({
                                            devices: [],
                                            showOtherDevices: checked ? true : false,
                                          });
                                        }}>
                        <RadioButton className="campaign-radio-button"
                                     value={false}
                                     label={this.i18n._t("All Devices")}
                        />
                        <RadioButton className="campaign-radio-button"
                                     value={true}
                                     label={this.i18n._t("Select devices type")}
                        />
                      </RadioButtonGroup>
                      {this.state.showOtherDevices &&
                      <div className="component-wrapper">
                        <CheckBoxList
                          items={this.devices}
                          value={this.state.devices}
                          onChange={this.updateDevices.bind(this)}
                        />
                      </div>
                      }
                    </FormItem>
                  </Col>
                </Row>

                {/* Manufactures */}
                <Row type="flex" className="targeting-row">
                  <Col span={5} className="title-target">
                    <Tooltip/>
                    <label>{this.i18n._t("Manufactures Brand")}</label>
                  </Col>
                  <Col span={19}>
                    <FormItem>
                      <RadioButtonGroup
                        className="campaign-radio-group" name="brands"
                        defaultSelected={this.state.showOtherBrands}
                        valueSelected={this.state.showOtherBrands}
                        onChange={(a, checked) => {
                          this.setState({
                            brands: [],
                            showOtherBrands: checked ? true : false,
                          });
                        }}>
                        <RadioButton className="campaign-radio-button"
                                     value={false}
                                     label={this.i18n._t("All Brands")}
                        />
                        <RadioButton className="campaign-radio-button"
                                     value={true}
                                     label={this.i18n._t("Select brands")}
                        />
                      </RadioButtonGroup>
                      {this.state.showOtherBrands &&
                      <div className="component-wrapper">
                        <FormItem>
                          {getFieldDecorator("brands", {
                            initialValue: attr.manufacturer,
                            rules: [{required: true, message: this.i18n._t("Please select brands!")}],
                          })(
                            <SelectList
                              data={this.brands}
                              onChange={(brands) => {
                                this.setState({brands});
                              }}/>
                          )}
                        </FormItem>
                      </div>
                      }
                    </FormItem>
                  </Col>
                </Row>

                {/* Operation systems */}
                <Row type="flex" className="targeting-row">
                  <Col span={5} className="title-target">
                    <Tooltip/>
                    <label>{this.i18n._t("Operation systems")}</label>
                  </Col>
                  <Col span={19}>
                    <FormItem>
                      <RadioButtonGroup
                        className="campaign-radio-group" name="os"
                        defaultSelected={this.state.showOtherOS}
                        valueSelected={this.state.showOtherOS}
                        onChange={(a, checked) => {
                          this.setState({
                            oss: [],
                            showOtherOS: checked ? true : false,
                          });
                        }}>
                        <RadioButton className="campaign-radio-button"
                                     value={false}
                                     label={this.i18n._t("All Operation Systems")}
                        />
                        <RadioButton className="campaign-radio-button"
                                     value={true}
                                     label={this.i18n._t("Select Operation Systems")}
                        />
                      </RadioButtonGroup>
                      {this.state.showOtherOS &&
                      <div className="select-tag-component-wrapper">
                        <FormItem>
                          {getFieldDecorator("os", {
                            initialValue: this.state.oss,
                            rules: [{required: true, message: this.i18n._t("Please select operation systems!")}],
                          })(
                            <SelectTag
                              OnChange={(oss: string[]) => (this.setState({oss}))}
                              allOption={false}
                              placeholder={this.i18n._t("Select OS").toString()}
                              type={this.i18n._t("Operation system").toString()}
                              data={this.OSs.map(os => ({value: os.name, name: os.name}))}
                            />)}
                        </FormItem>
                      </div>
                      }
                    </FormItem>
                  </Col>
                </Row>

                {/* Browsers */}
                <Row type="flex" className="targeting-row">
                  <Col span={5} className="title-target">
                    <Tooltip/>
                    <label>{this.i18n._t("Browsers")}</label>
                  </Col>
                  <Col span={19}>
                    <FormItem>
                      <RadioButtonGroup
                        className="campaign-radio-group" name="browsers"
                        defaultSelected={this.state.showOtherBrowser}
                        valueSelected={this.state.showOtherBrowser}
                        onChange={(a, checked) => {
                          this.setState({
                            browsers: [],
                            showOtherBrowser: checked ? true : false,
                          });
                        }}>
                        <RadioButton className="campaign-radio-button"
                                     value={false}
                                     label={this.i18n._t("All Browsers")}
                        />
                        <RadioButton className="campaign-radio-button"
                                     value={true}
                                     label={this.i18n._t("Select Browsers")}
                        />
                      </RadioButtonGroup>
                      {this.state.showOtherBrowser &&
                      <div className="select-tag-component-wrapper">
                        <FormItem>
                          {getFieldDecorator("browsers", {
                            initialValue: attr.browser,
                            rules: [{required: true, message: this.i18n._t("Please select browsers!")}],
                          })(
                            <SelectTag
                              OnChange={(browsers: string[]) => (this.setState({browsers}))}
                              allOption={false}
                              placeholder={this.i18n._t("Select Browsers").toString()}
                              type={this.i18n._t("Browsers").toString()}
                              data={this.browsers.map(b => ({value: b.name, name: b.name}))}
                            />
                          )}
                        </FormItem>

                      </div>
                      }
                    </FormItem>
                  </Col>
                </Row>

                {/* IAB Categorie */}
                <Row type="flex" className="targeting-row">
                  <Col span={5} className="title-target">
                    <Tooltip/>
                    <label>{this.i18n._t("IAB Categories")}</label>
                  </Col>
                  <Col span={19}>
                    <FormItem>
                      <RadioButtonGroup
                        className="campaign-radio-group" name="iab"
                        defaultSelected={this.state.showOtherIAB}
                        valueSelected={this.state.showOtherIAB}
                        onChange={(a, checked) => {
                          this.setState({
                            iabs: [],
                            showOtherIAB: checked ? true : false,
                          });
                        }}>
                        <RadioButton className="campaign-radio-button"
                                     value={false}
                                     label={this.i18n._t("All Categories")}
                        />
                        <RadioButton className="campaign-radio-button"
                                     value={true}
                                     label={this.i18n._t("Select Categories")}
                        />
                      </RadioButtonGroup>
                      {this.state.showOtherIAB &&
                      <div className="select-tag-component-wrapper">
                        <FormItem>
                          {getFieldDecorator("iabs", {
                            initialValue: this.state.iabs,
                            rules: [{required: true, message: this.i18n._t("Please select categories!")}],
                          })(
                            <Select
                              onChange={(value: string[]) => {
                                this.setState({iabs: value});
                              }}
                              mode={"multiple"}
                              showSearch={false}
                              filterOption={(input, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              placeholder="Tags Mode"
                              className="select-tag-ant"
                            >
                              {this.categories.map(cat => (
                                <Option key={cat.name} value={cat.name}>{cat.name}</Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </div>
                      }
                    </FormItem>
                  </Col>
                </Row>

                {/* Location */}
                <Row type="flex" className="targeting-row">
                  <Col span={5} className="title-target">
                    <Tooltip/>
                    <label>{this.i18n._t("Geo location")}</label>
                  </Col>
                  <Col span={19}>
                    <div className="mt-1">
                      <SelectField className={"select-list-rtl select-geolocation"}
                                   onChange={(a, b, value) => {
                                     this.setState({
                                       locationType: value,
                                     });
                                   }}
                                   value={this.state.locationType}>
                        <MenuItem value={ILocationType.ALL} primaryText={this.i18n._t("Select all")}/>
                        {this.state.currentCampaign.kind === DEVICE_TYPES.APPLICATION &&
                        <MenuItem value={ILocationType.GM} primaryText={this.i18n._t("Select via geoloacation")}/>
                        }
                        {this.state.currentCampaign.kind === DEVICE_TYPES.WEB &&
                        <MenuItem value={ILocationType.IRAN_MAP}
                                  primaryText={this.i18n._t("Select specific area in iran")}/>
                        }
                        <MenuItem value={ILocationType.FOREIGN}
                                  primaryText={this.i18n._t("All without Iran")}/>
                      </SelectField>
                    </div>
                    {this.state.locationType === ILocationType.IRAN_MAP &&
                    <div className="component-wrapper">
                      <FormItem>
                        {getFieldDecorator("locations", {
                          initialValue: this.state.locations,
                          rules: [{required: true, message: this.i18n._t("Please select locations!")}],
                        })(
                          <IranMap
                            onChange={(locations) => {
                              console.log(locations);
                              this.setState({locations});
                            }}
                          />
                        )}
                      </FormItem>
                    </div>
                    }
                    {this.state.locationType === ILocationType.GM &&
                    <div className="component-wrapper area-map-wrapper">
                      <FormItem>
                        {getFieldDecorator("regionArea", {
                          initialValue: {coordinate: {lat: -34, lng: 150}, radius: 10000},
                          rules: [{required: true, message: this.i18n._t("Please select locations!")}],
                        })(
                          <AreaMap
                            onChange={(coordinate) => {
                              console.log(coordinate);
                            }}/>
                        )}
                      </FormItem>
                    </div>
                    }
                  </Col>
                </Row>

                {/* Networks */}
                <Row type="flex" className="mt-2" align="top">
                  <Col span={5}>
                    <Tooltip/>
                    <label>{this.i18n._t("Internet Network")}</label>
                  </Col>
                  <Col span={19}>
                    <RadioButtonGroup
                      className="campaign-radio-group" name="network"
                      defaultSelected={this.state.showOtherNetwork}
                      valueSelected={this.state.showOtherNetwork}
                      onChange={(a, value) => {
                        this.setState({
                          isps: [],
                          cellulars: [],
                          showOtherNetwork: value ? true : false,
                          NetworkType: INetworkType.ISP_Cell,
                          showISP: true,
                          showCellar: true,
                        });
                      }}>
                      <RadioButton className="campaign-radio-button"
                                   value={false}
                                   label={this.i18n._t("All Network")}
                      />
                      <RadioButton className="campaign-radio-button"
                                   value={true}
                                   label={this.i18n._t("Select Networks")}
                      />
                    </RadioButtonGroup>
                    {this.state.showOtherNetwork &&
                    <div className="network-select">
                      <label className="network-select-label">
                        <Translate value={"Connection type"}/>
                      </label>
                      <SelectField
                        className={(CONFIG.DIR === "rtl") ? "select-tag-rtl" : "select-tag"}
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
                    </div>
                    }
                    {this.state.showISP && this.state.showOtherNetwork &&
                    <FormItem>
                      {getFieldDecorator("isps", {
                        initialValue: attr.isp,
                        rules: [{required: true, message: this.i18n._t("Please select ISP!")}],
                      })(
                        <SelectTag
                          OnChange={(isps: string[]) => (this.setState({isps}))}
                          allOption={false}
                          placeholder={this.i18n._t("Select ISPs").toString()}
                          type={this.i18n._t("ISP").toString()}
                          data={this.ISPs.map(c => ({value: c.name, name: c.name}))}
                        />
                      )}
                    </FormItem>
                    }
                    {this.state.showCellar && this.state.showOtherNetwork &&
                    <FormItem>
                      {getFieldDecorator("cellular", {
                        initialValue: attr.cellular,
                        rules: [{required: true, message: this.i18n._t("Please select Cellular!")}],
                      })(
                        <SelectTag
                          OnChange={(cellulars: string[]) => (this.setState({cellulars}))}
                          allOption={false}
                          placeholder={this.i18n._t("Select Cellular").toString()}
                          type={this.i18n._t("Cellular").toString()}
                          data={this.Cellular.map(c => ({value: c.name, name: c.name}))}
                        />
                      )}
                    </FormItem>
                    }
                  </Col>
                </Row>

                <Row type="flex" align="middle">
                  <Col span={5}>
                    <RaisedButton
                      onClick={this.handleBack.bind(this)}
                      label={<Translate value="Back"/>}
                      primary={false}
                      className="button-back-step"
                      icon={<Icon name={"cif-arrowleft-4"} className={"back-arrow"}/>}
                    />
                  </Col>
                  <Col>
                    <RaisedButton
                      onClick={this.handleSubmit.bind(this)}
                      label={<Translate value="Next Step"/>}
                      primary={true}
                      className="button-next-step"
                      icon={<Icon name="cif-arrow-left" className={"arrow-next-step"}/>}
                    />
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
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
    setSelectedCampaignId: (id: number | null) => dispatch(setSelectedCampaignId(id)),
    setCurrentCampaign: (campaign: OrmCampaign) => dispatch(setCurrentCampaign(campaign)),
    setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
  };
}


export default Form.create()(withRouter(TargetingComponent as any));
