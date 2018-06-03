import * as React from "react";
import CONFIG from "../../../../../../constants/config";
import I18n from "../../../../../../services/i18n/index";
import "./style.less";
import DataTable from "../../../../../../components/DataTable";
import {
    ControllersApi,
    ControllersListCampaignsResponseData, ControllersListInventoryResponseData,
    UserApi,
    UserResponseLoginOKAccount
} from "../../../../../../api/api";
import ChangePasswordModal from "./../../../../../../components/ChangePasswordModal";
import {withRouter, RouterProps} from "react-router";
import {notification} from "antd";
import {connect} from "react-redux";
import {RootState} from "../../../../../../redux/reducers";
import {setIsLogin, setUser} from "../../../../../../redux/app/actions";
import {Link} from "react-router-dom";
import Translate from "../../../../../../components/i18n/Translate";

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
    private controllersApi = new ControllersApi();

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
            <div dir={CONFIG.DIR} className="whitelabel-billing content-container">
                <div className="page-info-container mb-1">
                    <Translate className="page-title" value={"Approve and reject of banner"}/>
                    <Translate className="page-description" value={"You can check, view, approve and reject of your ads."}/>
                </div>
                <DataTable
                    headerHide={true}
                    dataFn={this.controllersApi.campaignStatusListDefinitionGet}
                    definitionFn={this.controllersApi.campaignStatusListDefinitionGet}
                    name={"Approve Reject"}
                  //  customRenderColumns={{
                        // "status": (value: string, row: ControllersListInventoryResponseData, index: number): JSX.Element => {
                        //     let switchValue = (value !== CAMPAIGN_STATUS.PAUSE);
                        //     return <div>
                        //         {value !== CAMPAIGN_STATUS.ARCHIVE &&
                        //         <Switch
                        //             checked={switchValue}
                        //             className={CONFIG.DIR === "rtl" ? "switch-rtl" : "switch"}
                        //             onChange={() => {
                        //                 this.setState({showAlert: true});
                        //                 this.statusRow = row;
                        //                 this.statusIndex = index;
                        //                 this.statusValue = value;
                        //                 this.statusSwitch = switchValue;
                        //             }
                        //             }
                        //         />
                        //         }
                        //         {/* Alert Modal for changing status of campaign*/}
                        //         <Modal visible={this.state.showAlert}
                        //                closable={false}
                        //                customClass="alert-modal"
                        //                onOk={() => {this.changeCampaignStatus(this.statusRow, this.statusIndex, this.statusSwitch);
                        //                    this.setState({showAlert: false}); } }
                        //                onCancel={() => {this.setState({showAlert: false}); }}
                        //         >
                        //             <div className="alert-modal-container">
                        //                 <Icon name={"cif-alert"}/>
                        //                 <Translate
                        //                     className="alert-description"
                        //                     value={`Are you sure that you want to
                        //                                 ${(value !== CAMPAIGN_STATUS.ARCHIVE ? this.statusSwitch ? "deactive" : "active" : "")}
                        //                                 ${(this.statusRow) ?  (this.statusRow as any).title : ""}  ?`}/>
                        //             </div>
                        //         </Modal>
                        //    </div>;
                      //  }
                   // }}
                />
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
