/**
 * @file Create/edit Campaign wizard
 * @author Ehsan Hosseini
 *
 * @desc render Progressbar of the campaign wizard and define steps routes
 */

import * as React from "react";
import {PrivateRoute} from "../../components/PrivateRoute/index";
import {Row, Col} from "antd";
import ProgressBar from "./components/ProgressBar/index";
import TypeComponent from "./containers/Type/index";
import NamingComponent from "./containers/Naming/index";
import BudgetComponent from "./containers/Budget/index";
import TargetingComponent from "./containers/Targeting/index";
import SelectPublisherComponent from "./containers/SelectPublisher/index";
import UploadComponent from "./containers/Upload/index";
import CheckPublishComponent from "./containers/CheckPublish/index";
import STEPS from "./steps";
import CONFIG from "../../constants/config" ;

import "./style.less";
import {Switch} from "react-router";

/**
 * @interface
 *
 * define props interface
 */
interface IProps {
  match: any;
}

/**
 * @interface
 *
 * define state interface
 */
interface IState {
  stepIndex: STEPS;
}

export default class CampaignContainer extends React.Component <IProps, IState> {
  public render() {
    const {match} = this.props;
    return (
      <div dir={CONFIG.DIR}>
        <Row type="flex" align="middle" justify="center" className="progress-bar-wrapper">
          <Col span={24} className={"progress-container"}>
          <ProgressBar/>
          </Col>
        </Row>
        <Row>
          <Switch>
            <PrivateRoute path={`${match.url}/type/:id?`} component={TypeComponent}/>
            <PrivateRoute path={`${match.url}/naming/:id?`} component={NamingComponent}/>
            <PrivateRoute path={`${match.url}/naming/:id?`} component={NamingComponent}/>
            <PrivateRoute path={`${match.url}/budget/:id`} component={BudgetComponent}/>
            <PrivateRoute path={`${match.url}/targeting/:id`} component={TargetingComponent}/>
            <PrivateRoute path={`${match.url}/select-publisher/:id`} component={SelectPublisherComponent}/>
            <PrivateRoute path={`${match.url}/upload/:id/creative/:creative_id`} component={UploadComponent}/>
            <PrivateRoute path={`${match.url}/upload/:id`} component={UploadComponent}/>
            <PrivateRoute path={`${match.url}/check-publish/:id`} component={CheckPublishComponent}/>
          </Switch>
        </Row>
      </div>
    );
  }
}
