import * as React from "react";
import "./style.less";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {Badge, notification} from "antd";
import Translate from "../../../components/i18n/Translate/index";
import Icon from "../../../components/Icon/index";
import {UserApi, UserResponseLoginOKAccount} from "../../../api/api";
import CONFIG from "../../../constants/config";
import {RootState} from "../../../redux/reducers";
import UserBox from "../../../components/UserBox";
import Avatar from "../../../components/Avatar";

/**
 * @interface Props
 */
interface IProps {
    user?: UserResponseLoginOKAccount;
    history?: Array<Object>;
}

/**
 * @interface State
 */
interface IState {
    popoverOpen: boolean;
    user: UserResponseLoginOKAccount;
}
/**
 * UserAction(Top bar) placed on Header
 *
 * @desc This component used in Header and let user to access profile and some other useful links
 *
 * @class
 *
 */
function mapStateToProps(state: RootState) {
    return {
        user: state.app.user,
    };
}

@connect(mapStateToProps)
class UserAction extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            popoverOpen: false,
            user: props.user,
        };
    }
componentWillReceiveProps(props: IProps) {
        this.setState({
            user: props.user,
        });
    }
   render() {
        return(
            <div dir={CONFIG.DIR}
                 className="user-action"
                 onMouseEnter={() => {this.setState({popoverOpen: true}); }}
                 onMouseLeave={() => {this.setState({popoverOpen: false}); }}
            >
                <div className={"user-action-icon-wrapper"}>
                    <div className={"user-action-notification"}>
                        <Icon name={"cif-dashboard"} className={"user-action-icon"}/>
                        <Badge className={"user-action-badge"} dot />
                    </div>
                    <Avatar className={"flex"} user={this.props.user} radius={15} disableProgress={true}/>
                </div>
                <div className="title">
                    {(this.state.user.first_name + " " + this.state.user.last_name)}
                </div>
                {this.state.popoverOpen &&
                <div className="user-action-popup">
                    <UserBox user={this.state.user}/>
                </div>
                }
            </div>
        );
   }
}
export default withRouter<IProps>(UserAction as any);
