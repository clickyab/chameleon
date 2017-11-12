import * as React from "react";
import {RouteComponentProps, Switch, withRouter} from "react-router";
import {Link} from "react-router-dom";
import {PrivateRoute} from "../../../../components/PrivateRoute/index";
import PublicProfileContainer from "../../containers/Profile/index";
import Avatar from "../../../../components/Avatar/index";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import {UserApi, UserAvatarPayload, UserResponseLoginOKAccount, UserUserPayload} from "../../../../api/api";
import {default as Upload, UPLOAD_MODULES} from "../../../../services/Upload/index";
import {notification} from "antd/lib";
import I18n from "../../../../services/i18n/index";
import {setUser} from "../../../../redux/app/actions/index";
import CONFIG from "../../../../constants/config";
import Translate from "../../../../components/i18n/Translate/index";
import "./style.less";
import classNames = require("classnames");
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;


/**
 * @interface
 * @desc define component props
 */
interface IOwnProps {
  match?: any;
  history?: any;
}

interface IProps extends RouteComponentProps<void> {
  user: UserResponseLoginOKAccount;
  setUser: (user: UserResponseLoginOKAccount) => {};
}

interface IState {
  user: UserResponseLoginOKAccount;
  uploadProgress: number;
}

@connect(mapStateToProps, mapDispatchToProps)
class UserArea extends React.Component<IProps, IState> {

  private i18n = I18n.getInstance();

  constructor(props: IProps) {
    super(props);
    this.state = {
      user: props.user,
      uploadProgress: null,
    };
  }

  componentWillReceiveProps(props: IProps) {
    this.setState({
      user: props.user,
    });
  }

  uploadAvatar(file) {
    const uploader = new Upload(UPLOAD_MODULES.AVATAR, file);
    uploader.upload((state) => {
      // todo:: show progress
      this.setState({
        uploadProgress: state.progress,
      });
    })
      .then((res) => {
        const userApi = new UserApi();
        let userAvatarPayload: UserAvatarPayload = {
          avatar: res.url,
        };

        userApi.userAvatarPut({
          payloadData: userAvatarPayload,
        }).then((data) => {
          notification.success({
            message: this.i18n._t("Upload Avatar"),
            description: this.i18n._t("Your avatar changed successfully.").toString(),
          });
          this.props.setUser(data.account);
          this.setState({
            user: data.account,
            uploadProgress: null,
          });
        });

      })
      .catch((error) => {
        notification.error({
          message: this.i18n._t("Upload Avatar"),
          description: this.i18n._t("Error in change avatar.").toString(),
        });
        this.setState({
          uploadProgress: null,
        });
      });
  }
  render() {
    const {match} = this.props;
    return (
      <div dir={CONFIG.DIR} className="user-area">
        <div className="avatar-wrapper" >
          {this.state.user && <div className="avatar-click" onClick={ () => {document.getElementById("uploadAvatar").click(); console.log("clicked"); } } >
          <Avatar user={this.state.user} className="user-area-avatar avatar-hover" radius={32} progress={0}  />
          </div>}
          <input style={{display: "none"}} id="uploadAvatar" type="file"
                 onChange={(e) => this.uploadAvatar(e.target.files[0])} ref="avatar"
                 accept="image/*"/>
          <h2>{this.state.user.first_name} {this.state.user.last_name}</h2>
        </div>
        <div className="ul-wrapper">
        <ul>
          <li>
            <Link className={ (this.props.history.location.pathname === match.url + "/profile") ? "active" : ""}
                  to={`${match.url}/profile`}>
              <Translate value="Profile"/>
            </Link>
          </li>
          <li>
            <Link className={ (this.props.history.location.pathname === match.url + "/transaction-history") ? "active" : ""}
                  to={`${match.url}/transaction-history`}>
              <Translate value="Transaction History"/>
            </Link>
          </li>
          <li>
            <Link className={ (this.props.history.location.pathname === match.url + "/charge-account") ? "active" : ""}
                  to={`${match.url}/charge-account`}>
              <Translate value="Charge Account"/>
            </Link>
          </li>
          <li>
            <Link className={ (this.props.history.location.pathname === match.url + "/logout") ? "active" : ""}
                  to={`${match.url}/logout`}>
              <Translate value="Logout"/>
            </Link>
          </li>
        </ul>
        </div>
        <Switch>
          <PrivateRoute path={`${match.url}/profile`} component={PublicProfileContainer}/>
          {/*<Redirect to="/dashboard"/>*/}
        </Switch>
      </div>
    )
      ;
  }
}


/**
 * @desc map store's props and component's props to component's props
 * @func
 * @param {RootState} state
 * @param {IOwnProps} ownProps
 * @returns {{currentStep: STEPS; selectedCampaignId: number; match: any; history: any}}
 */
function mapStateToProps(state: RootState, ownProps: IOwnProps) {
  return {
    user: state.app.user,
    match: ownProps.match,
    history: ownProps.history,
  };
}


/**
 * @desc map Redux's actions to component's props
 * @func
 * @param {RootState} state
 * @param {IOwnProps} ownProps
 * @returns {{currentStep: STEPS; selectedCampaignId: number; match: any; history: any}}
 */
function mapDispatchToProps(dispatch) {
  return {
    setUser: (user: UserResponseLoginOKAccount) => dispatch(setUser(user)),
  };
}

// export component and use withRouter to access route properties
export default withRouter<IProps>(UserArea as any);
