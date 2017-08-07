/**
 * @file Datetime directive
 * @desc convert datetime to locale
 * @example <Datetime value={Date.now()} format={"LLLL"} />
 */
import * as React from "react";
import I18n from "../../../services/i18n/index";

/**
 * props interface
 */
interface IDateProps {
  value: string | number;
  format?: string;
}

export default class DateTime extends React.Component<IDateProps, null> {

  /**
   * render span element with converted datetime
   * @returns {any}
   */
  public render() {
    const i18n = I18n.getInstance();
    return (
      <span>
        {i18n._d(this.props.value, this.props.format)}
      </span>
    );
  }
}
