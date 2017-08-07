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
interface ITranslateProps {
  /**
   * @require
   * @param {string} value - source of translate string
   */
  value: string;

  /**
   * @param {object} params - object of params to replace parameters on original string
   */
  params?: object;

  /**
   * render html object or not
   */
  html ?: boolean;
}

export default class Translate extends React.Component<ITranslateProps, null> {

  public render() {
    const i18n = I18n.getInstance();
    return (
      <span>
        {i18n._t(this.props.value,
          {html : this.props.html || false , params : this.props.params || {}})}
      </span>
    );
  }
}
