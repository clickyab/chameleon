import * as React from "react";
import {Breadcrumb} from "antd";
import {RouteComponentProps, withRouter} from "react-router";
import {Link} from "react-router-dom";
import {BreadcrumbProps} from "antd/es/breadcrumb/Breadcrumb";
import {connect} from "react-redux";
import {RootState} from "../../../../../redux/reducers/index";
import Icon from "../../../../../components/Icon/index";

/**
 * Breadcrumb
 * @desc This breadcrumb use for private layout
 *
 * @class
 *
 */
interface IProps extends RouteComponentProps<BreadcrumbProps> {
  breadcrumb: string;
}

@connect(mapStateToProps)
class PrivateBreadcrumb extends React.Component<IProps> {
  /**
   * @func createBreadCrumb
   * @desc This function read location pathname object and create breadcrumb
   *
   * @type {JSX.Element | null}
   *
   * @return {JSX.Element[]}
   */
  private createBreadCrumb(): JSX.Element[] | null {
    const locationPath: string[] = this.props.location.pathname.split("/");

    // Replace last breadcrumb item with props [maybe use in campaign edit, replace id with name]
    if (this.props.breadcrumb.length > 0) {
      locationPath[locationPath.length - 1] = this.props.breadcrumb;
    }

    return (
      locationPath.map((items): JSX.Element |  null => {
        if (items === "dashboard") {
          return null;
        }
        return (
          <Breadcrumb.Item key={Math.random()}>
            {items}
          </Breadcrumb.Item>
        );
      })
    );
  }

  public render() {
    return (
      <Breadcrumb separator=">" className="breadcrumb">
        <Breadcrumb.Item><Link to="/dashboard"><Icon name="cif-home"/></Link></Breadcrumb.Item>
        {this.createBreadCrumb()}
      </Breadcrumb>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    breadcrumb: state.app.breadcrumb
  };
}


export default withRouter<BreadcrumbProps>(PrivateBreadcrumb);
