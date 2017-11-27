import * as React from "react";
import {Tooltip as AntTooltip} from "antd";
import {TooltipProps} from "antd/es/tooltip";
import "./style.less";
import Icon from "../Icon/index";


/**
 * Props
 */
interface IProps extends TooltipProps {
}


export default class Tooltip extends React.Component<IProps, {}> {
  render() {
    return (
      <div className="tooltip">
        <AntTooltip {...this.props}>
          <Icon name="cif-help-outline" className="tooltip-icon"/>
        </AntTooltip>
      </div>
    );
  }
}
