import * as React from "react";
import {Breadcrumb, Icon} from "antd";
import {RouteComponentProps, withRouter} from "react-router";
import {Link} from "react-router-dom";
import {BreadcrumbProps} from "antd/es/breadcrumb/Breadcrumb";

/**
 * Breadcrumb
 * @desc This breadcrumb use for private layout
 *
 * @class
 *
 */
class PrivateBreadcrumb extends React.Component<RouteComponentProps<BreadcrumbProps>> {
  /**
   * @func createBreadCrumb
   * @desc This function read location pathname object and create breadcrumb
   *
   * @type {JSX.Element | null}
   *
   * @return {JSX.Element[]}
   */
  private createBreadCrumb(): JSX.Element[] | null {
    // Create array of location path
    const locationPath: string[] = this.props.location.pathname.split("/");

    return (
      locationPath.map((items): JSX.Element | null => {
        if (items === "dashboard") {
          return null;
        }
        return (
          <Breadcrumb.Item>
            {items}
          </Breadcrumb.Item>
        );
      })
    );
  }

  public render() {
    return (
      <Breadcrumb separator=">" className="breadcrumb">
        <Breadcrumb.Item><Link to="/dashboard"><Icon type="home"/></Link></Breadcrumb.Item>
        {this.createBreadCrumb()}
      </Breadcrumb>
    );
  }
}

export default withRouter<BreadcrumbProps>(PrivateBreadcrumb);
