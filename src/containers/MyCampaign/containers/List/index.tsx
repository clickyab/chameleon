///<reference path="../../../../../node_modules/@types/react-router/index.d.ts"/>
import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import {ControllersApi, UserResponseLoginOKAccount} from "../../../../api/api";
import {Form, Row, Col} from "antd";
import {setIsLogin, setUser} from "../../../../redux/app/actions/index";
import CONFIG from "../../../../constants/config";
import DataTableChartWrapper from "../../../../components/DataTableChartWrapper/index";

import "./style.less";

const FormItem = Form.Item;

interface IProps extends RouteComponentProps<void> {
  form: any;
}

interface IState {
}


@connect(mapStateToProps, mapDispatchToProps)
class List extends React.Component<IProps, IState> {

  private i18n = I18n.getInstance();
  private controllerApi = new ControllersApi();

  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    // empty
  }

  public render() {
    return (
      <Row className={"content-container"}>
        <Col>
          <div dir={CONFIG.DIR}>
            <DataTableChartWrapper
              name="myCampaign"
              chartDataFn={this.controllerApi.inventoryListGet}
              chartDefinitionFn={this.controllerApi.inventoryListDefinitionGet}
              dataTableDefinitionFn={this.controllerApi.inventoryListDefinitionGet}
              dataTableDataFn={this.controllerApi.inventoryListGet}
            />
          </div>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    isLogin: state.app.isLogin,
    user: state.app.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUser: (user: UserResponseLoginOKAccount) => dispatch(setUser(user)),
    setIsLogin: () => dispatch(setIsLogin()),
  };
}

export default Form.create()(withRouter(List as any));
