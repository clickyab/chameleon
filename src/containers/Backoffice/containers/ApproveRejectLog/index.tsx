import * as React from "react";
import CONFIG from "../../../../constants/config";
import Translate from "../../../../components/i18n/Translate/index";
import DataTable from "../../../../components/DataTable";
import {ControllersApi} from "../../../../api/api";

const ApproveRejectLog = () => {
    const controllersApi = new ControllersApi();
    return  (
        <div dir={CONFIG.DIR} className="whitelabel-billing content-container">
        <div className="page-info-container mb-1">
            <Translate className="page-title" value={"Approve Reject log"}/>
            <Translate className="page-description" value={"You can check, view, approve and reject of your ads."}/>
        </div>
        <DataTable
            headerHide={true}
            ref={ref => this.table = ref}
            dataFn={controllersApi.campaignListGet}
            definitionFn={controllersApi.campaignListDefinitionGet}
            name={"Campaign Log"}
        />
        </div>);
};
export default ApproveRejectLog;
