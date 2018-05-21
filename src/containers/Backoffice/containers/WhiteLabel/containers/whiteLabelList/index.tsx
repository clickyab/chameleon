import * as React from "react";
import CONFIG from "../../../../../../constants/config";
import I18n from "../../../../../../services/i18n/index";
import "./style.less";
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
class WhiteLabelList extends React.Component<IProps, IState> {
    private i18n = I18n.getInstance();
    userApi = new UserApi();
    controllersApi = new ControllersApi();

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

export default withRouter(WhiteLabelList);
