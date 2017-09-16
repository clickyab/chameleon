import * as React from "react";
import {default as AntModal, ModalProps} from "antd/es/modal/Modal";
import "./style.less";

/**
 * Props
 */
interface IProps extends ModalProps {
  children?: JSX.Element
}

/**
 * Modal
 *
 * @desc This component is like ant modal component but have some needed feature
 *
 * @class
 */
export default class Modal extends React.Component<IProps, {}> {
  public render() {
    return (
      <AntModal wrapClassName="vertical-center-modal" {...this.props} className="modal-wrapper">
        {this.props.children}
      </AntModal>
    );
  }
}
