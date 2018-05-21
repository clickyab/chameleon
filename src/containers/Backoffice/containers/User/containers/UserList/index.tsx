import * as React from "react";
import CONFIG from "../../../../../../constants/config";
import I18n from "../../../../../../services/i18n/index";
import "../../style.less";
import DataTable from "../../../../../../components/DataTable";
import {ControllersApi, UserApi, UserResponseLoginOK, UserResponseLoginOKAccount} from "../../../../../../api/api";
import ChangePasswordModal from "./../../../../../../components/ChangePasswordModal";
import {withRouter, RouterProps} from "react-router";
import ServerStore from "../../../../../../services/ServerStore";
import {notification} from "antd";
import AAA from "../../../../../../services/AAA";
import {connect} from "react-redux";
import {RootState} from "../../../../../../redux/reducers";
import {setIsLogin, setUser} from "../../../../../../redux/app/actions";
import {Row} from "antd";
import {Link} from "react-router-dom";

interface IProps extends RouterProps {
    user: UserResponseLoginOKAccount;
    setUser: (user: UserResponseLoginOKAccount) => {};
    setIsLogin: () => {};
}

interface IState {
    showPasswordModal: boolean;
    selectedUserId?: number;
}

@connect(mapStateToProps, mapDispatchToProps)
class UserList extends React.Component<IProps, IState> {
    private i18n = I18n.getInstance();
    userApi = new UserApi();

    constructor(props: IProps) {
        super(props);
        this.state = {
            showPasswordModal: false,
        };
    }

    componentDidMount() {
        // empty
    }

    public render() {
        return (
            <div dir={CONFIG.DIR}>
                <Row className={"content-container"}>
                    <DataTable
                        name={"user-list"}
                        dataFn={this.userApi.userListGet}
                        definitionFn={this.userApi.userListDefinitionGet}
                        customRenderColumns={{
                            "full_name": (value, record) => {
                                console.log(value);
                                return <Link to={`/backoffice/user/edit/${record.id}`}>{value}</Link>;
                            }
                        }}
                        actionsFn={{
                            "edit": (value, record, index) => {
                                this.props.history.push(`/backoffice/user/edit/${record.id}`);
                            },
                            "impersonate": (value, record, index) => {
                                this.userApi.userStartImpersonatePost({
                                    payloadData: {
                                        user_id: record.id
                                    }
                                }).then((data: UserResponseLoginOK) => {
                                    this.props.setUser(data.account);
                                    this.props.setIsLogin();

                                    ServerStore.getInstance().setItems(data.account.attributes);
                                    console.log(ServerStore.getInstance());

                                    const aaa = AAA.getInstance();
                                    aaa.setToken(data.token);

                                    // redirect to dashboard
                                    this.props.history.push("/dashboard");

                                    // show notification
                                    notification.success({
                                        message: this.i18n._t("You Impersonated successfully."),
                                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                                        description: "",
                                    });
                                });
                            },
                            "change_pass": (value, record, index) => {
                                this.setState({
                                    selectedUserId: record.id,
                                    showPasswordModal: true,
                                });
                            }
                        }}
                    />
                    {this.state.showPasswordModal && this.state.selectedUserId &&
                    <ChangePasswordModal
                        userId={this.state.selectedUserId}
                        onOk={() => {
                            this.setState({showPasswordModal: false});
                        }}
                        onCancel={() => {
                            this.setState({showPasswordModal: false});
                        }}
                        visible={this.state.showPasswordModal}/>
                    }
                </Row>
            </div>
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

export default withRouter(UserList);
