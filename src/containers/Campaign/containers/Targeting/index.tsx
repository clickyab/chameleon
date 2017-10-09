import * as React from "react";
import DataTable from "../../../../components/DataTable/index";
import {ControllersApi} from "../../../../api/api";
import {Row, Col, Form} from "antd";
import SelectTag from "../../../../components/SelectTag/index";

import {Col, Row, Form} from "antd";
import SelectList from "../../../../components/SelectList/index";

const FormItem = Form.Item;

interface IProps {
}

interface IState {
}

const persons = {
  "data": [
    {"value": 0, "name": "Leonardo sunches"},
    {"value": 1, "name": "Van Henry"},
    {"value": 2, "name": "April Tucker"},
    {"value": 3, "name": "Ralph Hubbard"},
    {"value": 4, "name": "Omar Alexander"},
    {"value": 5, "name": "Carlos Abbott"},
    {"value": 6, "name": "Miriam Wagner"},
    {"value": 7, "name": "Bradley Wilkerson"},
    {"value": 8, "name": "Virginia Andrews"},
    {"value": 9, "name": "Kelly Snyder"}
  ]
};

const persons2 = {
  "data": [
    {"id": 0, "title": "Leonardo sunches"},
    {"id": 1, "title": "Van Henry"},
    {"id": 2, "title": "April Tucker"},
    {"id": 3, "title": "Ralph Hubbard"},
    {"id": 4, "title": "Omar Alexander"},
    {"id": 5, "title": "Carlos Abbott"},
    {"id": 6, "title": "Miriam Wagner"},
    {"id": 7, "title": "Bradley Wilkerson"},
    {"id": 8, "title": "Virginia Andrews"},
    {"id": 9, "title": "Kelly Snyder"}
  ]
};

export default class TargetingComponent extends React.Component <IProps, IState> {
  public render() {
    const controllerApi = new ControllersApi();
    return (
      <div dir="rtl">
        <h1>Targeting</h1>
        <Row>
          <Col>
            <DataTable
              name="publisherList"
              definitionFn={controllerApi.inventoryListDefinitionGet}
              dataFn={controllerApi.inventoryListGet}/>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={12}>
            <FormItem>
              <SelectTag data={persons.data}
                         type="Operation System"
                         placeholder="Select Os"
                         allOption={true}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem>
             <SelectList data={persons2.data} />
            </FormItem>
          </Col>
        </Row>
      </div>
    );
  }
}
