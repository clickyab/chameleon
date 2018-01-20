///<reference path="../../../../../node_modules/@types/react-router/index.d.ts"/>
import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import {ControllersApi, UserResponseLoginOKAccount} from "../../../../api/api";
import {Form, Row, Col} from "antd";
import {setIsLogin, setUser} from "../../../../redux/app/actions/index";
import {Button} from "antd";
import CONFIG from "../../../../constants/config";
import DataTableChartWrapper from "../../../../components/DataTableChartWrapper/index";

import "./style.less";
import Translate from "../../../../components/i18n/Translate";
import Icon from "../../../../components/Icon";
import {setBreadcrumb} from "../../../../redux/app/actions";

const FormItem = Form.Item;

interface IProps extends RouteComponentProps<void> {
  form: any;
  setBreadcrumb: (name: string, title: string, parent: string) => void;
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
      this.props.setBreadcrumb("campaigns", this.i18n._t("Campaigns").toString(), "home");
  }

  public render() {
    return (
      <Row className={"content-container"}>
        <Col>
          <div dir={CONFIG.DIR}>
            <Row className="mb-2">
              <h3><Translate value={"campaigns"}/></h3>
            </Row>
            <DataTableChartWrapper
              name="myCampaign"
              chartDataFn={this.controllerApi.inventoryListGet}
              chartDefinitionFn={this.controllerApi.inventoryListDefinitionGet}
              dataTableDefinitionFn={this.controllerApi.inventoryListDefinitionGet}
              dataTableDataFn={this.controllerApi.inventoryListGet}
              showRangePicker={true}
              dataTableButtons={[{
                  title: "alireza",
                  onClick: (query) => console.log("nothing")
              }]}
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
        setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
    };
}

export default Form.create()(withRouter(List as any));
