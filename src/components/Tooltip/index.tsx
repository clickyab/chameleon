import * as React from "react";
import {Tooltip as AntTooltip, Icon} from "antd";
import {TooltipProps} from "antd/es/tooltip";
import "./style.less";


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
          <Icon type="question-circle-o"/>
        </AntTooltip>
      </div>
    );
  }
}
