import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import {setIsLogin, setUser, unsetIsLogin, unsetUser} from "../../../../redux/app/actions/index";
import {UserApi, UserUserPayload} from "../../../../api/api";
import AAA from "../../../../services/AAA/index";
import ServerStore from "../../../../services/ServerStore";
import {notification} from "antd";
import CONFIG from "../../../../constants/config";
import I18n from "../../../../services/i18n";

interface IProps extends RouteComponentProps<void> {
    isLogin?: boolean;
    user?: UserUserPayload;
    setUser?: (user) => void;
    unsetUser?: () => void;
    unsetIsLogin?: () => void;
    setIsLogin?: () => void;
}

@connect(mapStateToProps, mapDispatchToProps)
class Logout extends React.Component<IProps, {}> {

    private i18n = I18n.getInstance();
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
            .then((user) => {
                if (user) {
                    this.props.setUser(user.account);
                    this.props.setIsLogin();

                    ServerStore.getInstance().setItems(user.account.attributes);

                    const aaa = AAA.getInstance();
                    aaa.setToken(user.token);
                    aaa.setUser(user.account);

                    // redirect to dashboard
                    setTimeout(() => {
                        this.props.history.push("/dashboard");
                    }, 500);


                    // show notification
                    notification.success({
                        message: this.i18n._t("You return to your main account."),
                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                        description: "",
                    });
                } else {
                    aaa.unsetToken();
                    this.props.unsetIsLogin();
                    this.props.unsetUser();
                    this.props.history.push("/");
                }
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
        setUser: (user) => dispatch(setUser(user)),
        unsetUser: () => dispatch(unsetUser()),
        setIsLogin: () => dispatch(setIsLogin()),
        unsetIsLogin: () => dispatch(unsetIsLogin()),
    };
}


export default withRouter(Logout as any);
