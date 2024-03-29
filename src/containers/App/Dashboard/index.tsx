import * as React from "react";
import I18n from "../../../services/i18n/index";
import {connect} from "react-redux";
import RangePicker from "../../../components/RangePicker";
import * as moment from "moment";
import {setBreadcrumb} from "../../../redux/app/actions/index";
import RangePickerWrapper from "../../../components/RangePickerWrapper";
import Currency from "../../../components/Currency";
import CurrencySelector from "../../Campaign/components/CurrencySelector";
import UploadFile from "../../Campaign/components/UploadFile";

interface IProps {
    setBreadcrumb: (name: string, title: string, parent: string) => void;
}
interface IState {
  value: any;
}
export enum rangeType { TODAY, CUSTOM }
const enum MODULE {IMAGE = "image" , VIDEO = "video"}
const enum FILE_TYPE {IMG_JPG = "image/jpeg", IMG_PNG = "image/png", IMG_GIF = "image/gif", VID_MP4 = "video/mp4"}
const Range = {
    range: {
        from: moment(),
          to: moment().add("day", 1),
         },
    type: rangeType.CUSTOM
};
@connect(null, mapDispatchToProps)
export default class Dashboard extends React.Component<IProps , IState> {
  constructor(props) {
    super(props);
    this.state = {
      value : moment().toISOString()
    };
  }
  private i18n = I18n.getInstance();

  public componentDidMount() {
    this.props.setBreadcrumb("dashboard", this.i18n._t("Dashboard").toString(), "home");
  }

  public render() {
    let getRange: any ;
    return (
        <div>
         <h1>Dashboard Page</h1>
        </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
  };
}
