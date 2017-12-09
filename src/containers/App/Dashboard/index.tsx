import * as React from "react";
import I18n from "../../../services/i18n/index";
import {connect} from "react-redux";
import RangePicker from "../../../components/rangePicker";
import * as moment from "moment";
import {setBreadcrumb} from "../../../redux/app/actions/index";

interface IProps {
  setBreadcrumb: (name: string, title: string, parent: string) => void;
}
interface IState {
  value: any;
}
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
            <RangePicker
                onChange={value => {this.setState({value}) ; console.log(value) ; }}
                value={this.state.value}
                getRange={getRange}
            />
            {console.log(this.state.value)}
      <div>Dashboard</div>
        </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
  };
}
