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

  constructor(props: IProps) {
    super(props);
    this.state = {
      countries: [],
      provinces: [],
      cities: [],
    };
  }

  /**
   * check initial location is defined or not. After load countries load province and city, step by step
   */
  public componentDidMount() {
    // check has initial location
    console.log(this.props);
    if (!!this.props.countryId) {
      this.loadCountries()
        .then(() => {
          if (this.props.provinceId) {
            this.setProvince(null, -1, this.props.provinceId)
              .then(() => {
                if (this.props.cityId) {
                  this.setCity(null, -1, this.props.cityId);
                }
              });
          }
        });
    } else {
      this.loadCountries();
    }
  }

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
        return this.setCountry(null, 0, !!this.props.countryId ? this.props.countryId : countries[0].id, true);
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
  private setCountry(event, index: number, countryId: number, selectFirstItem?: boolean) {
    console.log(countryId);
    const country = this.state.countries.find((c) => (c.id === countryId));
    return this.api.locationProvincesCountryIdGet({countryId: country.id.toString()})
      .then((provinces) => {
        this.setState({
          provinces,
          province: provinces[0],
          country: country,
        });
        if (selectFirstItem) {
          this.setProvince(event, index, provinces[0].id, true);
        }
        this.handleOnChangeEvent();
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
        if (selectFirstItem) {
          this.setCity(event, index, cities[0].id);
        }
        this.handleOnChangeEvent();
      });
  }

  /**
   * set selected city
   * @param event
   * @param {number} index
   * @param {number} cityId
   */
  private setCity(event, index: number, cityId: number) {
    const city = this.state.cities.find((c) => (c.id === cityId));
    this.setState({
      city,
    });
    this.handleOnChangeEvent();
  }

  /**
   * check the state of selected location is valid and call onChnage callback if it was set.
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
      <Row gutter={16}>
        {/*<Col span={8}>*/}
          {/*<SelectField style={{width: 120}}*/}
                       {/*onChange={this.setCountry.bind(this)}*/}
                       {/*value={this.state.country ? this.state.country.id : null}>*/}
            {/*{this.state.countries.map((country) => {*/}
              {/*return (<MenuItem key={`c_${country.id}`} value={country.id} primaryText={country.name}/>);*/}
            {/*})}*/}
          {/*</SelectField>*/}
        {/*</Col>*/}
        <Col span={12}>
          <SelectField
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
        <Col span={12}>
          <SelectField
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
