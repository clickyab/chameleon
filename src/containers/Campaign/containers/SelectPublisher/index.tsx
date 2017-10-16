import * as React from "react";
import DataTable from "../../../../components/DataTable/index";
import {ControllersApi} from "../../../../api/api";
import CONFIG from "../../../../constants/config";
import {Row , Col} from "antd";
import Translate from "../../../../components/i18n/Translate/index";

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
      <div dir={CONFIG.DIR} className="campaign-content">
        <Row className="campaign-title">
          <Col>
            <h2><Translate value="select publisher"/></h2>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={24}>
        <DataTable
          name="publisherList"
          onSelectRow={this.onSelectRow.bind(this)}
          definitionFn={controllerApi.inventoryListDefinitionGet}
          dataFn={controllerApi.inventoryListGet}/>
          </Col>
        </Row>
      </div>
    );
  }
}
