/**
 * @file Financial Billing page
 * @address backoffice/whitelabel/financial/report
 */
import * as React from "react";
import DataTable from "../../../../../../components/DataTable";
import {ControllersApi} from "../../../../../../api/api";

interface IProps {

}

export default class FinancialBilling extends React.Component<IProps> {
    private controllerApi = new ControllersApi();
    render() {
    return (
        <div className="datatable-tab-alone">
            <DataTable
                dataFn={this.controllerApi.financialBillingGet.bind(this)}
                definitionFn={this.controllerApi.financialBillingDefinitionGet.bind(this)}
                name={"billing data table"}
            />
        </div>
    );
    }
}
