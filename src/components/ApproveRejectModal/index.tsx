import * as React from "react";
import Modal from "../Modal";
import * as moment from "moment-jalaali";
import "./style.less";
import CONFIG from "../../constants/config";
import {
    ControllersApi,
    ControllersRejectReasons,
    OrmCreativeCampaignResult,
    ControllersChangeStatusResultCreativesStatus
} from "../../api/api";
import Translate from "../i18n/Translate";
import {Link} from "react-router-dom";
import I18n from "../../services/i18n";
import Icon from "../Icon";
import {notification, Radio} from "antd";
import ReactCSSTransitionGroup = require("react-addons-css-transition-group");
const RadioGroup = Radio.Group;
/**
 * Props
 */
interface IProps {
    campaignId:  number;
    visible?: boolean;
    onCancel?: () => void;
    tableRef?: any;
}

/**
 * State
 */
interface IState {
    currentCreativeNum: number ;
    campaign: OrmCreativeCampaignResult;
    pendingCreatives: any;
    showReason: boolean;
    visible?: boolean;
}
enum STATUS {APPROVE = "accepted" ,  REJECT = "rejected"}
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
    private creativeStatus: Array<ControllersChangeStatusResultCreativesStatus> = [];
    private selectedReason: number;
    private reasonRef;
    private rejectReasons: ControllersRejectReasons ;
    private i18n = I18n.getInstance();

    constructor(props) {
        super(props);
        this.state = {
            campaign: null,
            pendingCreatives: [],
            currentCreativeNum: 0,
            showReason: false,
            visible: props.visible ? props.visible : true,
        };
    }


    public componentDidMount() {
        let campaignId: string = this.props.campaignId.toString() ;
        document.addEventListener("mousedown", this.handleClickOutside);
        this.getCreatives(campaignId);
        this.getRejectReasons();
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }
    public handleClickOutside = (event) => {
        if (this.reasonRef && !this.reasonRef.contains(event.target)) {
            this.setState({showReason: false});
        }
    }

    public getRejectReasons() {
        this.controllerApi.adCreativeRejectReasonsGet({})
            .then((respond) => {
               let enableReasons = respond.filter((item) => item.status === "enable");
               this.rejectReasons = enableReasons;
               this.selectedReason = this.rejectReasons[0].id;
            })
        .catch((error) => {
            if (error.error) {
                notification.error({
                    message: this.i18n._t("Cant get Reasons").toString(),
                    className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                    description: this.i18n._t(error.error.text).toString(),
                });
            }
            if (this.props.onCancel) {
                this.props.onCancel();
            }
        });
    }
    public getCreatives(campId: string)  {
        this.controllerApi.campaignCreativeIdGet({id: campId})
            .then((respond) => {
                let tempArray = [];
                tempArray = respond.Creatives.filter((item) => item["creative"].status === "pending");
                this.setState({
                    campaign: respond,
                    pendingCreatives: tempArray
                });
            })
            .catch((error) => {
                if (error.error) {
                    notification.error({
                        message: this.i18n._t("Cant get add list").toString(),
                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                        description: this.i18n._t(error.error.text).toString(),
                    });
                }
                if (this.props.onCancel) {
                    this.props.onCancel();
                }
            });
    }

    private showReasonsRadio() {
        return (
            this.rejectReasons.map((item) => {
                return <Radio key={item.id} value={item.id}>{this.i18n._t(item.reason)}</Radio>;
            })
        );
    }

    public addRejectBanner = () => {
        let creativeRejectObj: ControllersChangeStatusResultCreativesStatus = {};
        creativeRejectObj.creative_id = this.state.pendingCreatives[this.state.currentCreativeNum].creative.id;
        creativeRejectObj.reject_reason_id = this.selectedReason;
        creativeRejectObj.status = STATUS.REJECT;
        this.creativeStatus.push(creativeRejectObj);
        this.setState({showReason: false});
        this.setState({currentCreativeNum: this.state.currentCreativeNum + 1});
    }

    public addAcceptBanner = () => {
        let creativeRejectObj: ControllersChangeStatusResultCreativesStatus = {};
        creativeRejectObj.creative_id = this.state.pendingCreatives[this.state.currentCreativeNum].creative.id;
        creativeRejectObj.reject_reason_id = null;
        creativeRejectObj.status = STATUS.APPROVE;
        this.creativeStatus.push(creativeRejectObj);
        this.setState({currentCreativeNum: this.state.currentCreativeNum + 1});
    }

    public finalizeCheck = () => {
        this.controllerApi.adChangeCreativesStatusIdPut({id: this.props.campaignId.toString(), payloadData: {new_status: this.creativeStatus}})
            .then((respond) => {
                if (this.props.onCancel) {
                    this.props.onCancel();
                }
                if (this.props.tableRef) {
                    if (this.state.pendingCreatives.length - this.creativeStatus.filter((item => item.status === STATUS.REJECT)).length - this.creativeStatus.filter((item => item.status === STATUS.APPROVE)).length !==0) {
                        this.props.tableRef.removeRecords([this.state.currentCreativeNum]);
                    }
                }
            })
            .catch((error) => {
                if (error.error) {
                    notification.error({
                        message: this.i18n._t("Cant finalize creative check").toString(),
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
                   maskClosable={false}
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
                        <span className="sidebar-info-content">{this.state.campaign.campaign_owner_mobile}</span>
                        <Translate className="sidebar-info-title" value={"email of campaign owner"}/>
                        <span className="sidebar-info-content">{this.state.campaign.campaign_owner_email}</span>
                    </div>
                    {this.state.pendingCreatives.length - 1 >= this.state.currentCreativeNum &&
                    <div className="creative-check-ads">
                        <div className="approve-reject-progress-container">
                            <div className="approve-reject-progress"
                                 style={{width: `${(this.state.currentCreativeNum + 1) / this.state.pendingCreatives.length * 100}%`}} />
                        </div>
                        <div className="controller-container">
                            <div className="back-controller">
                                {this.state.currentCreativeNum !== 0 &&
                                <div onClick={() => this.setState({currentCreativeNum: this.state.currentCreativeNum - 1})}>
                                    <Icon name={"cif-arrowright-4"}/>
                                    <Translate value={"previous"}/>
                                </div>
                                }
                            </div>
                            <div className="show-counter">
                                <Translate value={"%s from %s"}
                                           params={[this.state.currentCreativeNum + 1, this.state.pendingCreatives.length]}/>
                            </div>
                            <div className="skip-controller" onClick={() => this.setState({currentCreativeNum: this.state.currentCreativeNum + 1})} >
                                    <Translate value={"Skip"}/>
                                    <Icon name={"cif-arrowleft-4"}/>
                            </div>
                        </div>
                        <div className="ad-container square">
                            {/*TODO: this is protoType and not really great code should be fix after create banner and native approve reject modal design for native done*/}
                            {this.state.pendingCreatives[this.state.currentCreativeNum] &&
                            this.state.pendingCreatives[this.state.currentCreativeNum].assets.v_image.concat(this.state.pendingCreatives[this.state.currentCreativeNum].assets.h_image).map((item, index) =>
                                <div key={index} className={"square-content"} style={{display: "flex"}}>
                                    <img key={index} src={"http://staging.crab.clickyab.ae/uploads/" + item.val}/>
                                </div>
                            )}
                        </div>
                        <div className="approve-reject-btn-container">
                            <div className="approve-reject-btn reject-btn"
                                 onClick={() => this.setState({showReason: true})}>{this.i18n._t("Reject banner")}</div>
                            <div className="approve-reject-btn approve-btn"
                                 onClick={() => this.addAcceptBanner()}>{this.i18n._t("Approve banner")}</div>
                        </div>
                        <ReactCSSTransitionGroup transitionName="reason-animation" transitionEnterTimeout={300}
                                                 transitionLeaveTimeout={300}>
                            {this.state.showReason &&
                            <div>
                                <div className="reject-reasons" ref={(elem) => this.reasonRef = elem}>
                                    <RadioGroup className="radio-reasons"
                                                onChange={(val) => this.selectedReason = (val.target as any).value}
                                                defaultValue={this.rejectReasons[0].id}>
                                        {this.showReasonsRadio()}
                                    </RadioGroup>
                                    <div className="reject-reason-btn"
                                         onClick={() => this.addRejectBanner()}>{this.i18n._t("Reject and go to next ad")}</div>
                                </div>
                            </div>
                            }
                        </ReactCSSTransitionGroup>
                        <div className={`reason-overlay ${this.state.showReason ? "show-reason" : "invisible-reason"}`}>
                        </div>
                    </div>
                    }
                    {this.state.pendingCreatives.length - 1 < this.state.currentCreativeNum &&
                    <div className="creative-check-ads">
                        <div>
                        <div className="back-controller-summary">
                            <div onClick={() => this.setState({currentCreativeNum: this.state.currentCreativeNum - 1})}>
                                <Icon name={"cif-arrowright-4"} />
                                <Translate value={"previous"} />
                            </div>
                        </div>
                            <div className="summary-header">
                                <Icon name={"cif-summary"}/>
                                <Translate value={"previous"} />
                            </div>
                            <div className="summary-detail">
                                <div className="summary-item-info">
                                    <Translate value={"Count accepted creative"}/>
                                </div>
                                <div className="summary-item-value">
                                    {this.creativeStatus.filter((item => item.status === STATUS.APPROVE)).length}
                                </div>
                                <div className="summary-item-info">
                                    <Translate value={"Count rejected creative"}/>
                                </div>
                                <div className="summary-item-value">
                                    {this.creativeStatus.filter((item => item.status === STATUS.REJECT)).length}
                                </div>
                                <div className="summary-item-info">
                                    <Translate value={"Count skipped creative"}/>
                                </div>
                                <div className="summary-item-value">
                                    {this.state.pendingCreatives.length - this.creativeStatus.filter((item => item.status === STATUS.REJECT)).length - this.creativeStatus.filter((item => item.status === STATUS.APPROVE)).length}
                                </div>
                                <div className="summary-item-info">
                                    <Translate value={"Date and Time of approve"}/>
                                </div>
                                <div className="summary-item-value">
                                    {moment().format("jYYYY/jM/jD")}
                                    <Translate className={"hour-summary"} value={"hour"}/>
                                    {moment().format("HH:mm")}
                                </div>
                            </div>
                            <div className="approve-reject-btn-container">
                                <div className="approve-reject-btn final-save-btn full-width"
                                     onClick={() => this.finalizeCheck()}>{this.i18n._t("Save final changes")}</div>
                            </div>
                        </div>
                    </div>
                    }
                </div>
                }
            </Modal>
        );
    }
}
