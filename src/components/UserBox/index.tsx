import * as React from "react";
import I18n from "../../services/i18n";
import {connect} from "react-redux";
import {UserResponseLoginOKAccount} from "../../api/api";
import {setUser} from "../../redux/app/actions";
import {RootState} from "../../redux/reducers";
import {NavLink} from "react-router-dom";
import Icon from "../Icon";
import Translate from "../i18n/Translate";
import "./style.less";
import CONFIG from "../../constants/config";
import {currencyFormatter} from "../../services/Utils/CurrencyFormatter";

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
                        <div>
                            <Translate value={"Your balance"}/>
                            <div className="balance-amount">{currencyFormatter(this.state.user.balance) + " "}<Translate value={"Toman"}/></div>
                        </div>
                    </div>
                    <div className={"userbox-column navigation"}>
                        <div className={"nav-item"}><Icon name={"cif-gear-setting"}/><NavLink activeClassName="active" to="/user/profile"><Translate value={"Edit profile"}/></NavLink></div>
                        <div className={"nav-item"}><Icon name={"cif-trans-archive"}/><NavLink activeClassName="active" to="/transaction-history"><Translate value={"Transactions"}/></NavLink></div>
                        <div className={"nav-item"}><Icon name={"cif-addfund"}/><NavLink activeClassName="active" to="/user/charge"><Translate value={"Charge"}/></NavLink></div>
                        <div className={"nav-item"}><Icon name={"cif-access-management"}/><NavLink activeClassName="active" to="/managment"><Translate value={"user manage"}/></NavLink></div>
                        <div className={"nav-item"}><Icon name={"cif-logout-user"}/><NavLink activeClassName="active" to="/user/logout"> <Translate value={"logout"}/></NavLink>
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
