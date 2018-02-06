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
   render() {
        return(
            <div className="user-action">
                <div className={"user-action-icon-wrapper"}>
                <Icon name={"cif-dashboard"}/>
                <Badge className={"user-action-badge"} count={9} />
                </div>
                <div className="title">
                    {(this.state.user.first_name + " " + this.state.user.last_name)}
                </div>
            </div>
        );
   }
}
export default withRouter<IProps>(UserAction as any);