import * as React from "react";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import Translate from "../../../../components/i18n/Translate/index";
import DateTime from "../../../../components/i18n/DateTime/index";

interface IProps extends RouteComponentProps<void> {
  setUser: any;
}

interface IState {
  user: any;
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PublicLoginContainer extends React.Component<IProps, IState> {

  private i18n = I18n.getInstance();
  constructor(props: IProps) {
    super(props);

  }

  public render() {
    return (
      <div>
        <h1>Login Page</h1>
        <Translate value="a _{name} _{name}" html={true} params={{name : "sina"}}/>
        <DateTime value={Date.now()} />
        <Link to={`./register`}>Register Page</Link>
      </div>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    /* empty */
  };
}

function mapDispatchToProps(dispatch) {
  return {
    /* empty */
  };
}
