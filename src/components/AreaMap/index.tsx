import * as React from "react";
import {Col, Row} from "antd";
import {TextField} from "material-ui";
import {Circle, withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps";
import I18n from "../../services/i18n";
import {Theme} from "./mapTheme";
import "./style.less";

const pinPoint = require("./pinpoint.svg");

/**
 * IMap interface - store/set data from/to parent component
 */
interface IMap {
  coordinate: ICoordinate;
  radius: number;
}
/**
 * coordinate interface latitude and longitude
 */
interface ICoordinate {
  lat: string | number;
  lng: string | number;
}

/**
 * State
 */
interface IState {
  value: IMap;
  coordinate: ICoordinate;
  radius: number;
  inputType: string;
}

/**
 * Props
 */
interface IProps {
  value: IMap;
  height?: string;
  width?: string;
  radius?: number;
  fillColor?: string;
  onChange?: (mapInfo: IMap) => (void);
}


export default class AreaMap extends React.Component<IProps, IState> {

  // Translation
  private i18n = I18n.getInstance();

  CustomMap = withScriptjs(withGoogleMap(props =>
    <GoogleMap
      defaultZoom={9}
      defaultCenter={{lat: Number(this.state.coordinate.lat) , lng: Number(this.state.coordinate.lng) }}
      defaultOptions={{styles: Theme}}
    >
      <Circle
        clickable
        editable={false}
        center={{lat: Number(this.state.coordinate.lat) , lng: Number(this.state.coordinate.lng) }}
        radius={this.state.radius}
        options={{
          fillColor: this.props.fillColor ? this.props.fillColor : "#66C395",
          strokeColor: this.props.fillColor ? this.props.fillColor : "#66C395",
        }}
      />
      <Marker draggable={true}
              icon={pinPoint}
              position={{lat: Number(this.state.coordinate.lat) , lng: Number(this.state.coordinate.lng) }}
              onDrag={(e) => this.handleCirclePosition(e.latLng)}
      />
    </GoogleMap>
  ));

  constructor(props) {
    super(props);
    this.state = {
      coordinate: this.props.value.coordinate,
      radius: this.props.value.radius ? this.props.value.radius : 10000,
      inputType: "text",
      value: this.props.value,
    };
  }

  /**
   * @func handleCirclePosition
   *
   * @desc get marker position and set center of radius circle
   *
   * @param {object} position - object from google map
   *
   * @return {void}
   */
  public handleCirclePosition(position) {
    let mapObj = {coordinate: {lat: position.lat() , lng: position.lng()} , radius: this.state.radius };
    this.setState({
      coordinate: {lat: position.lat(), lng: position.lng()},
      value: mapObj,
    });
    if (this.props.onChange) {
      this.props.onChange(mapObj);
    }
  }

  /**
   * @func handleLatInput
   *
   * @desc set input latitude
   *
   * @param {string} latVal come from text-field (value of text-field are string type)
   *
   * @return {void}
   */
  public handleLatInput(latVal) {
    let mapObj = {coordinate: {lat: latVal , lng: this.state.coordinate.lng} , radius: this.state.radius };
    this.setState({
      coordinate: {lat: latVal , lng: this.state.coordinate.lng},
      value: mapObj,
    });
    if (this.props.onChange) {
      this.props.onChange(mapObj);
    }
  }

  /**
   * @func handleLngInput
   *
   * @desc set input longitude
   *
   * @param {string} lngVal come from text-field (value of text-field are string type)
   *
   * @return {void}
   */
  public handleLngInput(lngVal) {
    let mapObj = {coordinate: {lat: this.state.coordinate.lat , lng: lngVal} , radius: this.state.radius };
    this.setState({
      coordinate: {lat: this.state.coordinate.lat , lng: lngVal},
      value: mapObj,
    });
    if (this.props.onChange) {
      this.props.onChange(mapObj);
    }
  }
  public handleRadiusInput(radVal) {
    let mapObj = {coordinate: {lat: this.state.coordinate.lat , lng: this.state.coordinate.lng} , radius: radVal * 1000 };
    this.setState({
      radius: radVal * 1000,
      value: mapObj,
    });

    if (this.props.onChange) {
      this.props.onChange(mapObj);
    }
  }

  /**
   * @func handleTypeText
   *
   * @desc change input type to ether text or numbet
   *
   * @return {void}
   */
  public handleType() {
    if (this.state.inputType === "text") {
      this.setState({
        inputType: "number",
      });
    }
    else {
      this.setState({
        inputType: "text",
      });
    }
  }

  public render() {
    const CustomMap = this.CustomMap;
    return (
      <div>
        <Row type="flex" className="map-form">
          <Col span={8}>
            <TextField value={this.state.coordinate.lat}
                       floatingLabelText={this.i18n._t("Latitude")}
                       className="map-input border-right spin-btn-hide"
                       fullWidth={true}
                       type="number"
                       onChange={(e , val) => {this.handleLatInput(val); }}
            />
          </Col>
          <Col span={8}>
            <TextField value={this.state.coordinate.lng}
                       floatingLabelText={this.i18n._t("Longitude")}
                       className="map-input border-right spin-btn-hide"
                       fullWidth={true}
                       type="number"
                       onChange={(e , val) => this.handleLngInput(val)}/>
          </Col>
          <Col span={8}>
            <TextField value={`${(this.state.radius) / 1000}${this.state.inputType === "text" ? " Km" : ""}` }
                       floatingLabelText={this.i18n._t("Radius")}
                       className="map-input spin-btn-hide radius"
                       type={this.state.inputType}
                       fullWidth={true}
                       onChange={(e , val) => this.handleRadiusInput(val)}
                       onFocus={() => this.handleType()}
                       onBlur={() => this.handleType()}
            />
          </Col>
        </Row>
        <CustomMap
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA9mv6-SxE5f0RwjParQ52uMNUIot-CpK0&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{height: `100%`}}/>}
          containerElement={<div style={{
            height: `${(this.props.height) ? this.props.height : "400px" }`,
            width: `${(this.props.width) ? this.props.width : "auto" }`
          }}/>}
          mapElement={<div style={{height: `100%`}}/>}
        />
      </div>
    );
  }
}

