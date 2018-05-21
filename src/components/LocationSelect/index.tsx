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
import {Row, Col, Select, Form} from "antd";
import I18n from "../../services/i18n/index";
import "./style.less";
import Translate from "../i18n/Translate";

const FormItem = Form.Item;
const Option = Select.Option;

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
    provinceId?: string;

    /**
     * @param {number} cityId initial selected city
     */
    cityId?: number;

    /**
     * @param {function} onChange return selected locations id after each change
     */
    onChange?: (countryId: number, provinceId: string, cityId: number) => {};
    /**
     * @param {boolean} disable fields or not
     */
    disabled?: boolean;
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
    provinceSearch?: string;
}


export default class LocationSelect extends React.Component<IProps, IState> {
    /**
     * create a new locationApi class
     * @type {LocationApi}
     */
    api = new LocationApi();
    private i18n = I18n.getInstance();

    private country_id: number;
    private province_id: string;
    private city_id: number;

    constructor(props: IProps) {
        super(props);
        this.state = {
            countries: [],
            provinces: [],
            cities: [],
            provinceSearch: "",
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
        this.loadCountries()
            .then(() => {
                if (!!this.props.cityId) {
                    this.setProvince(this.props.provinceId)
                        .then(() => {
                            if (this.props.cityId) {
                                this.setCity(this.props.cityId);
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
    //                   this.setCity(null, -`, this.props.cityId);
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
     * @param {number} index
     * @param {number} provinceId
     * @param {boolean} selectFirstItem
     * @returns {Promise<LocationCities>}
     */
    private setProvince(provinceId: string, selectFirstItem?: boolean) {
        const province = this.state.provinces.find((c) => (c.code === provinceId));
        return this.api.locationCitiesProvinceGet({province: province.name})
            .then((cities) => {
                this.setState({
                    province,
                    cities,
                });
                if (cities[0]) {
                    this.setState({city: cities[0]});
                }
            });
    }

    /**
     * set selected city
     * @param event
     * @param {number} index
     * @param {number} cityId
     */
    private setCity(cityId: number) {
        const city = this.state.cities.find((c) => (c.id === cityId));
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
                this.state.province.code,
                this.state.city.id,
            );
        }
    }

    public render() {
        return (
            <Row type="flex" align="bottom" gutter={16}>
                <Col span={12} className="location-select-column">
                    <FormItem>
                        <span className="input-title"><Translate value="Province"/></span>
                        <Select className={"select-input"} dropdownClassName={"select-dropdown"}
                                value={(this.state.province ? this.state.province.code : "").toString()}
                                onChange={(value) => this.setProvince(value as string)}
                                disabled={this.props.disabled}
                                optionFilterProp="children"
                                showSearch
                                filterOption={(input, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {this.state.provinces && this.state.provinces.map((province) => {
                                return (
                                    <Option key={`p_${province.code}`}
                                            value={province.code}>{province.name}</Option>);
                            })}
                        </Select>
                    </FormItem>
                </Col>
                <Col span={12} className="location-select-column">
                    <FormItem>
                        <span className="input-title"><Translate value="City"/></span>
                        <Select className={"select-input"} dropdownClassName={"select-dropdown"}
                                value={(this.state.city ? this.state.city.id : "").toString()}
                                onChange={(value) => this.setCity(parseInt(value as string))}
                                disabled={this.props.disabled}
                                optionFilterProp="children"
                                showSearch
                                filterOption={(input, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {this.state.cities.map((city) => {
                                return (<Option key={`ci_${city.id}`} value={city.id.toString()}>{city.name}</Option>);
                            })}
                        </Select>
                    </FormItem>
                </Col>
            </Row>
        );
    }

}
