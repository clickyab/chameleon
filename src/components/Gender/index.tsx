import * as React from "react";
import Translate from "../i18n/Translate/index";
import "./style.less";
import Icon from "../Icon/index";


interface IProps {
  value?: string;
  onChange?: (gender: string) => void;
}

interface IState {
  value: string | null;
}

export default class Gender extends React.Component <IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      value: (props.value) ? props.value : null
    };

    this.onClick = this.onClick.bind(this);
  }

  private onClick(gender: string) {
    this.setState({
      value: gender,
    });

    if (this.props.onChange) {
      this.props.onChange(gender);
    }
  }
componentWillReceiveProps(nextProps: IProps) {
   this.setState({value: nextProps.value });
}
  render() {
    return (
      <div>
        <Translate className={"gender-title"} value="gender"/>
        <div className="gender">
          <br/>
          <div className={`gender-item ${this.state.value === "female" ? "active" : ""}`} onClick={() => {
            this.onClick("female");
          }}>
            <Icon name={"cif-womenhair-normal"}/>
          </div>
          <div className={`gender-item ${this.state.value === "male" ? "active" : ""}`} onClick={() => {
            this.onClick("male");
          }}>
            <Icon name={"cif-menhair-normal"}/>
          </div>
        </div>
      </div>
    );
  }
}
