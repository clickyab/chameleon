import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import {unsetIsLogin, unsetUser} from "../../../../redux/app/actions/index";
import {UserApi, UserUserPayload} from "../../../../api/api";
import AAA from "../../../../services/AAA/index";

interface IProps extends RouteComponentProps<void> {
  isLogin?: boolean;
  user?: UserUserPayload;
  unsetUser?: () => {};
  unsetIsLogin?: () => {};
}

@connect(mapStateToProps, mapDispatchToProps)
class Logout extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {

    if (!this.props.isLogin) {
      this.props.history.push("/");
      return;
    }

    const userApi = new UserApi();
    const aaa = AAA.getInstance();
    userApi.userLogoutGet({})
      .then(() => {
        aaa.unsetToken();
        this.props.unsetIsLogin();
        this.props.unsetUser();
        this.props.history.push("/");
      });

  }

  render() {
    return null;
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
    unsetUser: () => dispatch(unsetUser()),
    unsetIsLogin: () => dispatch(unsetIsLogin()),
  };
}


export default withRouter(Logout as any);
