import * as React from "react";
import Translate from "../i18n/Translate/index";
import "./style.less";


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
      value: props.value || null
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

  render() {
    return (
      <div>
        <Translate value="gender"/>
        <div className="gender">
          <br/>
          <div className={`gender-item ${this.state.value === "female" ? "active" : ""}`} onClick={() => {
            this.onClick("female");
          }}>
            Female
          </div>
          <div className={`gender-item ${this.state.value === "male" ? "active" : ""}`} onClick={() => {
            this.onClick("male");
          }}>
            Male
          </div>
        </div>
      </div>
    );
  }
}
