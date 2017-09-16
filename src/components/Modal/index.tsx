import * as React from "react";
import {default as Modal1, ModalProps} from "antd/es/modal/Modal";
import "./style.less";

interface IProps extends ModalProps {
  children?: JSX.Element
}

export default class Modal extends React.Component<IProps, {}> {
  public render() {
    return (
      <Modal1 wrapClassName="vertical-center-modal" {...this.props} className="modal-wrapper">
        {this.props.children}
      </Modal1>
    )
  }
}
