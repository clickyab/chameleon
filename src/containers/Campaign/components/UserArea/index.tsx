import * as React from "react";
import {Redirect, RouteComponentProps, Switch, withRouter} from "react-router";
import {PrivateRoute} from "../../../../components/PrivateRoute/index";
import PublicProfileContainer from "../../../User/containers/Profile/index";
import ChargeContainer from "../../../User/containers/Charge/index";
import TransactionHistory from "../../../User/containers/TransactionHistory/index";
import Avatar from "../../../../components/Avatar/index";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import {UserApi, UserAvatarPayload, UserResponseLoginOKAccount} from "../../../../api/api";
import {notification, Tabs, Row} from "antd/lib";
import I18n from "../../../../services/i18n/index";
import {setUser} from "../../../../redux/app/actions/index";
import CONFIG from "../../../../constants/config";
import Translate from "../../../../components/i18n/Translate/index";
import "./style.less";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;
import FlowUpload from "../../../../services/Upload/flowUpload";
import {UPLOAD_MODULES} from "../../../Campaign/components/UploadFile";

const TabPane = Tabs.TabPane;

/**
 * @interface
 * @desc define component props
 */
interface IOwnProps {
    match?: any;
    history?: any;
}

enum COMP_TAB_USR {
    PROFILE = "Profile",
    TRANSACTION = "Transaction",
    CHARGE = "Charge",
    LOGOUT = "Logout",
}

interface IProps extends RouteComponentProps<void> {
    user: UserResponseLoginOKAccount;
    setUser: (user: UserResponseLoginOKAccount) => {};
    activeTab: string;
}

interface IState {
    user: UserResponseLoginOKAccount;
    uploadProgress: number;
    activeTab: string;
}

@connect(mapStateToProps, mapDispatchToProps)
class UserArea extends React.Component<IProps, IState> {

    private i18n = I18n.getInstance();

    constructor(props: IProps) {
        super(props);
        this.state = {
            user: props.user,
            uploadProgress: null,
            activeTab: props.activeTab ? props.activeTab : "Profile",
        };
    }

    componentWillReceiveProps(props: IProps) {
        this.setState({
            user: props.user,
        });
        this.handleTabUrl(this.props.history.location.pathname);
    }

    private handleTabUrl(url: string): void {
        let splitUrl = (url.split("/"));
        let tempKey: string;
        switch (splitUrl[splitUrl.length - 1]) {
            case "profile":
                tempKey = "profile";
                break;
            case "transactions":
                tempKey = "transactions";
                break;
            case "charge":
                tempKey = "charge";
                break;
            case "logout":
                tempKey = "logout";
                break;
        }
        this.setState({
            activeTab: tempKey,
        });
    }

    private handleTab(key): void {
        this.setState({
            activeTab: key,
        });
        this.props.history.push("/user/" + key.toString());
    }

    uploadAvatar(file) {
        const uploader = new FlowUpload(UPLOAD_MODULES.USER_AVATAR, file);
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
                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
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
                    message: this.i18n._t("Upload Avatar").toString(),
                    className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
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
                <div className="avatar-wrapper">
                    {this.state.user && <div className="avatar-click" onClick={() => {
                        document.getElementById("uploadAvatar").click();
                        console.log("clicked");
                    }}>
                        <Avatar user={this.state.user} className="user-area-avatar avatar-hover" radius={32}
                                progress={0}/>
                    </div>}
                    <input style={{display: "none"}} id="uploadAvatar" type="file"
                           onChange={(e) => this.uploadAvatar(e.target.files[0])} ref="avatar"
                           accept="image/*"/>
                    <h2>{this.state.user.first_name} {this.state.user.last_name}</h2>
                </div>
                <Switch>
                    <Row type="flex" align="middle">
                        <Tabs activeKey={this.state.activeTab}
                              onChange={this.handleTab.bind(this)}
                              type="editable-card"
                              hideAdd={true}
                              className="tabs-container mt-2 mr-4 ml-4">
                            <TabPane tab={this.i18n._t("Profile")} key="profile" closable={false}>
                                <PrivateRoute path={`${match.url}/profile`} component={PublicProfileContainer}/>
                            </TabPane>
                            <TabPane tab={this.i18n._t("Transaction History")} key="transactions" closable={false}>
                                <PrivateRoute path={`${match.url}/transactions`} component={TransactionHistory}/>
                            </TabPane>
                            <TabPane tab={this.i18n._t("Charge Account")} key="charge" closable={false}>
                                <PrivateRoute path={`${match.url}/charge`} component={ChargeContainer}/>
                            </TabPane>
                        </Tabs>
                        {/*<Redirect to="/dashboard"/>*/}
                    </Row>
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
