import * as React from "react";
import DataTable from "../../../../components/DataTable/index";
import {ControllersApi} from "../../../../api/api";

interface IProps {
}

interface IState {
}

export default class SelectPublisherComponent extends React.Component <IProps, IState> {


  onSelectRow(keys: string[], rows: any[]) {
    console.log(keys, rows);
  }

  public render() {
    const controllerApi = new ControllersApi();
    return (
      <div dir="rtl">
        <h1>select publisher</h1>
        <DataTable
          name="publisherList"
          onSelectRow={this.onSelectRow.bind(this)}
          definitionFn={controllerApi.inventoryListDefinitionGet}
          dataFn={controllerApi.inventoryListGet}/>
      </div>
    );
  }
}
