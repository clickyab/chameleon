import * as React from "react";
import {default as AntModal, ModalProps} from "antd/es/modal/Modal";
import "./style.less";

/**
 * Props
 */
interface IProps extends ModalProps {
  children?: JSX.Element ;
}
/**
 * Modal
 *
 * @desc This component is like ant modal component but have some needed feature
 *
 * @class
 */
export default class Modal extends React.Component<IProps, {}> {

  /**
   * @function handleBlur
   *
   * @desc Bluing modal background wrapper
   *
   * @param {boolean} visible Modal visibility
   * @param {string} id class will add to element with this id
   *
   * @return {void}
   */
  private handleBlur(visible: boolean , id = "root"): void {
    if (visible) {
      document.getElementById(id).classList.add("blur") ;
    }
    else {
      document.getElementById(id).classList.remove("blur") ;
    }
  }
  componentWillMount() {
    this.handleBlur(this.props.visible);
  }
  componentWillReceiveProps(nextProps) {
    this.handleBlur(nextProps.visible);
  }
  public render() {
    return (
      <AntModal wrapClassName="vertical-center-modal" {...this.props} className="modal-wrapper">
        {this.props.children}
      </AntModal>
    );
  }
}
