import * as React from "react";
import SelectTag from "../../../../components/SelectTag/index";
import {Col, Row, Form} from "antd";

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

export default class TargetingComponent extends React.Component <IProps, IState> {
  public render() {
    return (
      <div dir="rtl">
        <h1>Targeting</h1>
        <Row type="flex" align="middle">
          <Col>
            <FormItem>
              <SelectTag data={persons.data}
                         type="Operation System"
                         placeholder="Select Os"
                         allOption={true}
              />
            </FormItem>
          </Col>
        </Row>
      </div>
    );
  }
}
