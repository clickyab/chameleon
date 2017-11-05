/**
 * @file Select Location input
 * @author Ehsan Hosseini
 * @desc Input select for Country, Province and City.
 */

/**
 * Import dependencies
 */
import * as React from "react";
import {
  LocationApi, LocationCountries, LocationProvinces, LocationCities, LocationCountriesInner,
  LocationProvincesInner, LocationCitiesInner
} from "../../api/api";
import {Row, Col} from "antd";
import {SelectField, MenuItem} from "material-ui";
import I18n from "../../services/i18n/index";
import CONFIG from "../../constants/config";
import "./style.less";

/**
 * define component props
 */
interface IProps {
  /**
   * @param {number} countryId initial selected country
   */
  countryId?: number;

  /**
   * @param {number} provinceId initial selected province
   */
  provinceId?: number;

  /**
   * @param {number} cityId initial selected city
   */
  cityId?: number;

  /**
   * @param {function} onChange return selected locations id after each change
   */
  onChange?: (countryId: number, provinceId: number, cityId: number) => {};
}

interface IState {
  /**
   * @param {LocationCountriesInner} selected country
   */
  country?: LocationCountriesInner;

  /**
   * @param {LocationCountries} list of loaded country
   */
  countries: LocationCountries;

  /**
   * @param {LocationProvincesInner} selected province
   */
  province?: LocationProvincesInner;

  /**
   * @param {LocationProvinces} list of loaded provinces
   */
  provinces: LocationProvinces;

  /**
   * @param {LocationCitiesInner} selected city
   */
  city?: LocationCitiesInner;

  /**
   * @param {LocationCities} list of loaded cities
   */
  cities: LocationCities;
}


export default class LocationSelect extends React.Component<IProps, IState> {
  /**
   * create a new locationApi class
   * @type {LocationApi}
   */
  api = new LocationApi();
  private i18n = I18n.getInstance();

  private country_id: number;
  private province_id: number;
  private city_id: number;

  constructor(props: IProps) {
    super(props);
    this.state = {
      countries: [],
      provinces: [],
      cities: [],
    };
    this.country_id = props.countryId || 1;
    this.province_id = props.provinceId;
    this.city_id = props.cityId;

  }

  /**
   * check initial location is defined or not. After load countries load province and city, step by step
   */
  public componentDidMount() {
    // check has initial location
    console.log(11111111111111, this.props.cityId);
    this.loadCountries()
      .then(() => {
        if (!!this.props.cityId) {
          this.setProvince(null, -1, this.props.provinceId)
            .then(() => {
              console.log(11111111111111, this.props.cityId);
              if (this.props.cityId) {
                this.setCity(null, -1, this.props.cityId);
              }
            });
        }
      });
  }

  // public componentWillReceiveProps(newProps: IProps) {
  //   console.log(newProps);
  //   if (newProps.countryId !== this.country_id &&
  //     newProps.provinceId !== this.province_id &&
  //     newProps.cityId !== this.city_id) {
  //     if (!!newProps.countryId) {
  //       this.loadCountries()
  //         .then(() => {
  //           if (newProps.provinceId) {
  //             this.setProvince(null, -1, this.props.provinceId)
  //               .then(() => {
  //                 if (newProps.cityId) {
  //                   this.setCity(null, -1, this.props.cityId);
  //                 }
  //               });
  //           }
  //         });
  //     }
  //   }
  // }

  /**
   * Load countries and check first item as default.
   *
   * @returns {Promise<LocationCountries>}
   */
  private loadCountries() {
    return this.api.locationCountriesGet()
      .then((countries) => {
        this.setState({
          countries,
        });
        return this.setCountry(null, 0, !!this.props.countryId ? this.props.countryId : countries[0].id);
      });
  }


  /**
   * set selected country and load provinces base on selected country.
   * Call `setProvince` with first item, if `selectedFirstItem` set as true.
   *
   * @param event
   * @param {number} index
   * @param {number} countryId
   * @param {boolean} selectFirstItem
   * @returns {Promise<LocationProvinces>}
   */
  private setCountry(event, index: number, countryId: number) {
    const country = this.state.countries.find((c) => (c.id === countryId));
    return this.api.locationProvincesCountryIdGet({countryId: country.id.toString()})
      .then((provinces) => {
        this.setState({
          provinces,
          province: provinces[0],
          country: country,
        });
      });
  }

  /**
   * set selected province and load provinces base on selected province.
   * Call `setCity` with first item, if `selectedFirstItem` set as true.
   *
   * @param event
   * @param {number} index
   * @param {number} provinceId
   * @param {boolean} selectFirstItem
   * @returns {Promise<LocationCities>}
   */
  private setProvince(event, index: number, provinceId: number, selectFirstItem?: boolean) {
    const province = this.state.provinces.find((c) => (c.id === provinceId));
    return this.api.locationCitiesProvincesIdGet({provincesId: province.id.toString()})
      .then((cities) => {
        this.setState({
          province,
          cities,
        });
      });
  }

  /**
   * set selected city
   * @param event
   * @param {number} index
   * @param {number} cityId
   */
  private setCity(event, index: number, cityId: number) {
    console.log(2222, cityId);
    const city = this.state.cities.find((c) => (c.id === cityId));
    console.log(city);
    this.setState({
      city,
    }, this.handleOnChangeEvent);

  }

  /**
   * check the state of selected location is valid and call onChange callback if it was set.
   */
  private handleOnChangeEvent() {
    if (this.props.onChange && !!this.state.country && !!this.state.province && this.state.city) {
      this.props.onChange(
        this.state.country.id,
        this.state.province.id,
        this.state.city.id,
      );
    }
  }

  public render() {
    return (
      <Row type="flex" align="bottom" gutter={16}>
        {/*<Col span={8}>*/}
        {/*<SelectField style={{width: 120}}*/}
        {/*onChange={this.setCountry.bind(this)}*/}
        {/*value={this.state.country ? this.state.country.id : null}>*/}
        {/*{this.state.countries.map((country) => {*/}
        {/*return (<MenuItem key={`c_${country.id}`} value={country.id} primaryText={country.name}/>);*/}
        {/*})}*/}
        {/*</SelectField>*/}
        {/*</Col>*/}
        <Col span={12} className="location-select-column">
          <SelectField className={(CONFIG.DIR === "rtl") ? "location-select-rtl" : "location-select"}
                       floatingLabelText={this.i18n._t("Province")}
                       fullWidth={true}
                       value={this.state.province ? this.state.province.id : null}
                       onChange={this.setProvince.bind(this)}>
            {this.state.provinces.map((province) => {
              return (
                <MenuItem key={`p_${province.id}`} value={province.id} primaryText={province.name}/>);
            })}
          </SelectField>
        </Col>
        <Col span={12} className="location-select-column">
          <SelectField className={(CONFIG.DIR === "rtl") ? "location-select-rtl" : "location-select"}
                       floatingLabelText={this.i18n._t("City")}
                       fullWidth={true}
                       onChange={this.setCity.bind(this)}
                       value={this.state.city ? this.state.city.id : null}>
            {this.state.cities.map((city) => {
              return (<MenuItem key={`ci_${city.id}`} value={city.id} primaryText={city.name}/>);
            })}
          </SelectField>
        </Col>
      </Row>
    );
  }

}
