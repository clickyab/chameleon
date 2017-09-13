import * as React from "react";
import {Step as MaterialStep} from "material-ui";
/**
 * Step class add className props to material Step component
 *
 * @desc Add className props to material Step component
 * @class
 *
 * @return {JSX} Step component with className props
 *
 */
export default class Step extends React.Component<any> {
  public render() {
    let {className, ...rest} = this.props;
    return (
      <MaterialStep {...rest} className={className} >
        {this.props.children}
      </MaterialStep>
    );
  }
}
