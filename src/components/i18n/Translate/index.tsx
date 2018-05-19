/**
 * @file Datetime directive
 * @desc convert datetime to locale
 * @example <Translate value={"hello <b> %s</b>"} params={["click yab"]} html={true}/>
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
  params?: any[];

  /**
   * render html object or not
   */
  html ?: boolean;
  /**
   * render html object or not
   */
  className ?: string;
}

interface IState {
  params: any[] ;
}
export default class Translate extends React.Component<ITranslateProps, IState> {

  componentWillReceiveProps(nextProps) {
    this.setState({params: nextProps.params});
  }

  constructor(props: ITranslateProps) {
    super(props);
    this.state = {
      params: (props.params) ? props.params : null,
    };
  }
  public render() {
    const i18n = I18n.getInstance();
    return (
      <span className={this.props.className ? this.props.className : ""}>
        {i18n._t(this.props.value,
          {html : this.props.html || false , params : this.state.params || []})}
      </span>
    );
  }
}
