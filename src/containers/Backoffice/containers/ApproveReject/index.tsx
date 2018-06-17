import * as React from "react";
import {
    ControllersApi,
    ControllersListCampaignsResponseData,
    UserResponseLoginOKAccount
} from "../../../../api/api";
import I18n from "../../../../services/i18n/index";
import CONFIG from "../../../../constants/config";
import Translate from "../../../../components/i18n/Translate/index";
import DataTable from "../../../../components/DataTable";
import ApproveRejectModal from "../../../../components/ApproveRejectModal";
import {notification} from "antd";

interface IProps {
    history?: any;
}

interface IState {
    user: UserResponseLoginOKAccount;
    activeCampaign: number;
    showModal: boolean;
}

class ApproveReject extends React.Component<IProps, IState> {

    private i18n = I18n.getInstance();
    private table;
    private controllersApi = new ControllersApi();

    constructor(props: IProps) {
        super(props);
        this.state = {
            user: null,
            activeCampaign: 0,
            showModal: false,
        };
    }

    render() {
        return (
            <div dir={CONFIG.DIR} className="whitelabel-billing content-container">
                <div className="page-info-container mb-1">
                    <Translate className="page-title" value={"Approve and reject of banner"}/>
                    <Translate className="page-description" value={"You can check, view, approve and reject of your ads."}/>
                </div>
                <DataTable
                    headerHide={true}
                    ref={ref => this.table = ref}
                    dataFn={this.controllersApi.campaignStatusListGet}
                    definitionFn={this.controllersApi.campaignStatusListDefinitionGet}
                    name={"Approve Reject"}
                    customRenderColumns={{
                        "title": (value: string, row: ControllersListCampaignsResponseData, index: number): JSX.Element => {
                            return (
                                <a href={"#"}
                                   key={index}
                                   onClick={() => {
                                       this.setState({
                                           activeCampaign: row.id,
                                           showModal: true,
                                       });
                                   }}
                                   >
                                    {row.title}</a>
                            );
                    }
                    }}
                    actionsFn={{
                        "accept_reject": (value, record, index) => {
                            this.setState({
                                activeCampaign: record.id,
                                showModal: true
                            });
                        },
                        "bulk_accept": (value, record, index) => {
                            this.controllersApi.adAcceptCampaignCreativeIdPatch({id: record.id.toString()})
                                .then(respond => {
                                    this.table.removeRecords([record.id]);
                                    notification.success({
                                        message: this.i18n._t("Batch accepted").toString(),
                                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                                        description: "",
                                    });
                                })
                            .catch(error => {
                                notification.error({
                                    message: this.i18n._t("Can't batch accept").toString(),
                                    className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                                    description: this.i18n._t(error.error.text).toString(),
                                });
                            });
                        }
                    }}
                />

                {this.state.showModal &&
                <ApproveRejectModal visible={true} campaignId={this.state.activeCampaign} tableRef ={this.table}
                                    onCancel={() => {this.setState({showModal: false}); }}/>
                }
            </div>
        );
    }
}


export default ApproveReject;
