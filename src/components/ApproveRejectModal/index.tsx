import * as React from "react";
import Modal from "../Modal";
import "./style.less";
import CONFIG from "../../constants/config";
import {ControllersApi, ControllersCampaignGetResponse, ControllersGetCreativeResp} from "../../api/api";
import Translate from "../i18n/Translate";
import {Link} from "react-router-dom";
import I18n from "../../services/i18n";
import Icon from "../Icon";
import {notification} from "antd";

/**
 * Props
 */
interface IProps {
    campaignId:  number;
    visible?: boolean;
    onCancel?: () => void;
}

/**
 * State
 */
interface IState {
    currentCreativeNum: number ;
    campaign: ControllersCampaignGetResponse;
    pendingCreatives: any;
    visible?: boolean;
}
enum STATUS {APPROVE = "approve" ,  REJECT = "reject"}
/**
 * Approve reject Modal
 *
 * @desc This component is like ant modal
 *
 * @class
 */
export default class ApproveRejectModal extends React.Component<IProps, IState> {

    private controllerApi = new ControllersApi();
    private creativeImgArray;
    private i18n = I18n.getInstance();

    constructor(props) {
        super(props);
        this.state = {
            campaign : null,
            pendingCreatives: [],
            currentCreativeNum: 0,
            visible: props.visible ? props.visible : false,
        };
    }


    public componentDidMount() {
        let campaignId: string = this.props.campaignId.toString() ;
        this.getCampaign(campaignId);
        this.getCreatives(campaignId);
    }

    public componentWillReceiveProps(prevProps, nextProps) {

    }
    public getCreatives(campId: string)  {
        this.controllerApi.campaignCreativeIdGet({id: campId})
            .then((respond) => {
                let tempArray = [];
                tempArray = respond.filter((item) => item["creative"].status === "pending");
                console.log("temparrra", tempArray);
                this.setState({pendingCreatives: tempArray});
                console.log("pending", tempArray);
            })
            .catch((error) => {
                if (error.error) {
                    notification.error({
                        message: this.i18n._t("Cant get add list").toString(),
                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                        description: this.i18n._t(error.error.text).toString(),
                    });
                }
            });
    }

    public getCampaign(campId: string) {
        this.controllerApi.campaignGetIdGet({id: campId})
            .then((camp) => {
                this.setState({campaign: camp});
            })
            .catch((error) => {
                if (error.error) {
                    notification.error({
                        message: this.i18n._t("Cant get campaign").toString(),
                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                        description: this.i18n._t(error.error.text).toString(),
                    });
                }
                if (this.props.onCancel) {
                    this.props.onCancel();
                }
        });
    }

    public approveRejectBanner(statusType: STATUS) {
        this.controllerApi.adCampaignCreativeStatusIdPatch({id: this.state.currentCreativeNum.toString(), payloadData: {status: statusType}})
        .then((res) => {
            })
        .catch((error) => {
                if (error.error) {
                    notification.error({
                        message: this.i18n._t("Error").toString(),
                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                        description: this.i18n._t(error.error.text).toString(),
                    });
                }
            });
    }

    public render() {
        return (
            <Modal footer={false} wrapClassName={`vertical-center-modal modal-${CONFIG.DIR}`}
                   {...this.props}
                   customClass={"approve-reject-container"}>
                {this.state.campaign &&
                <div className="creative-check-container">
                    <div className={"creative-check-sidebar"}>
                        <Translate className="check-sidebar-title" value={"campaign  '%s'"}
                                   params={[this.state.campaign.title]}/>
                        <Translate className="sidebar-info-title" value={"campaign Id"}/>
                        <Link className="sidebar-info-link"
                              to={`/my/campaign/details/${this.state.campaign.id}`}
                              target="_blank">{this.state.campaign.id}
                        </Link>
                        <Translate className="sidebar-info-title" value={"campaign kind"}/>
                        <span className="sidebar-info-content">{this.state.campaign.kind}</span>
                        <Translate className="sidebar-info-title" value={"mobile of campaign owner"}/>
                        <span className="sidebar-info-content">{"placeholder"}</span>
                        <Translate className="sidebar-info-title" value={"email of campaign owner"}/>
                        <span className="sidebar-info-content">{"placeholder"}</span>
                    </div>
                    <div className="creative-check-ads">
                        <div className="approve-reject-progress-container">
                            <div className="approve-reject-progress" style={{width: "25%"}}></div>
                        </div>
                        <div className="controller-container">
                            <div className="back-controller">
                                <Icon name={"cif-arrowright-4"}/>
                                <Translate value={"previous"}/>
                            </div>
                            <div className="show-counter">
                                <Translate value={"%s from %s"} params={[this.state.currentCreativeNum + 1 , this.state.pendingCreatives.length]}/>
                            </div>
                            <div className="skip-controller">
                                <Translate value={"Skip"}/>
                                <Icon name={"cif-arrowleft-4"}/>
                            </div>
                        </div>
                        <div className="ad-container square">
                            {console.log("creative" , this.state.pendingCreatives[this.state.currentCreativeNum])}
                            {this.state.pendingCreatives[this.state.currentCreativeNum] && this.state.pendingCreatives[this.state.currentCreativeNum].assets.image.map((item, index) =>
                                <div className={"square-content"}>
                                    <img key={index} src={"http://staging.crab.clickyab.ae/uploads/" + item.val} />
                                </div>
                            )}
                        </div>
                        <div className="approve-reject-btn-container">
                        <div className="approve-reject-btn reject-btn" onClick={() => this.approveRejectBanner(STATUS.REJECT)}>{this.i18n._t("Reject banner")}</div>
                        <div className="approve-reject-btn approve-btn">{this.i18n._t("Approve banner")}</div>
                        </div>
                    </div>
                </div>
                }
            </Modal>
        );
    }
}
