import * as React from "react";
import I18n from "../../../services/i18n/index";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../../redux/app/actions/index";

interface IProps {
  setBreadcrumb: (name: string, title: string, parent: string) => void;
}

@connect(null, mapDispatchToProps)
export default class Dashboard extends React.Component<IProps> {
  private i18n = I18n.getInstance();

  public componentDidMount() {
    this.props.setBreadcrumb("dashboard", this.i18n._t("Dashboard").toString(), "home");
  }

  public render() {
    return (
      <div>Dashboard</div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
  };
}
