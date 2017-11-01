import * as React from "react";
import {Breadcrumb} from "antd";
import {RouteComponentProps, withRouter} from "react-router";
import {Link} from "react-router-dom";
import {BreadcrumbProps} from "antd/es/breadcrumb/Breadcrumb";
import {connect} from "react-redux";
import {RootState} from "../../../../../redux/reducers/index";
import Icon from "../../../../../components/Icon/index";

/**
 * @interface IProps
 *
 *
 */
interface IProps extends RouteComponentProps<BreadcrumbProps> {
  breadcrumb: any[];
}

/**
 * @interface IState
 *
 */
interface IState {
  breadcrumb: any[];
}

@connect(mapStateToProps)
class PrivateBreadcrumb extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      breadcrumb: props.breadcrumb,
    };
  }

  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
      breadcrumb: newProps.breadcrumb,
    });
  }

  /**
   * @func createBreadCrumb
   * @desc This function read location pathname object and create breadcrumb
   *
   * @type {JSX.Element | null}
   *
   * @return {JSX.Element[]}
   */
  private createBreadCrumb(): JSX.Element[] | null {
    return (
      this.state.breadcrumb.map((items): JSX.Element | null => {
        if (items === "dashboard") {
          return null;
        }
        return (
          <Breadcrumb.Item key={Math.random()}>
            {items.title}
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
