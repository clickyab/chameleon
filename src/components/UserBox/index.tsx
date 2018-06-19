import * as React from "react";
import I18n from "../../services/i18n";
import {connect} from "react-redux";
import {UserResponseLoginOKAccount} from "../../api/api";
import {setUser} from "../../redux/app/actions";
import {RootState} from "../../redux/reducers";
import {Link, NavLink} from "react-router-dom";
import Icon from "../Icon";
import Translate from "../i18n/Translate";
import "./style.less";
import CONFIG from "../../constants/config";
import {currencyFormatter} from "../../services/Utils/CurrencyFormatter";
import AAA from "../../services/AAA";

interface IProps {
    user: UserResponseLoginOKAccount;
}

interface IState {
    user: UserResponseLoginOKAccount;
}

@connect(mapStateToProps, mapDispatchToProps)
class UserBox extends React.Component<IProps, IState> {

    private i18n = I18n.getInstance();

    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
        };
    }

    componentWillReceiveProps(props: IProps) {
        this.setState({
            user: props.user,
        });
    }

    render() {
        return (
            <div className={"userbox-wrapper"}>
                <div className={"userbox-container"}>
                    <div className={`userbox-column balance border-${CONFIG.DIR === "rtl" ? "left" : "right"} `}>
                        <div className={"balance"}>
                            <Translate value={"Your balance"}/>
                            <div className="balance-amount">{currencyFormatter(this.state.user.balance) + " "}<Translate
                                value={"Toman"}/></div>
                        </div>
                    </div>
                    <div className={"userbox-column navigation"}>
                        <div className={"nav-item"}>
                            <Icon name={"cif-gear-setting"}/>
                            <Link to="/user/profile">
                                <Translate value={"Edit profile"}/>
                            </Link>
                        </div>
                        <div className={"nav-item"}>
                            <Icon name={"cif-trans-archive"}/>
                            <Link to="/user/transactions">
                                <Translate value={"Transactions"}/>
                            </Link>
                        </div>
                        <div className={"nav-item"}>
                            <Icon name={"cif-addfund"}/>
                            <Link to="/user/charge">
                                <Translate value={"Charge"}/>
                            </Link>
                        </div>
                        {AAA.getInstance().hasPerm("list_user:self") &&
                        <div className={"nav-item"}>
                            <Icon name={"cif-access-management"}/>
                            <Link to="/backoffice/user/list">
                                <Translate value={"user manage"}/>
                            </Link>
                        </div>
                        }
                        <div className={"nav-item"}><Icon name={"cif-logout-user"}/><Link to="/user/logout"> <Translate
                            value={"logout"}/></Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: RootState) {
    return {
        user: state.app.user,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setUser: (user: UserResponseLoginOKAccount) => dispatch(setUser(user)),
    };
}

export default UserBox;
