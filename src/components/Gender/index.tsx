import * as React from "react";


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
      value: null
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
        <div className={this.state.value === "male" ? "active" : null} onClick={() => {
          this.onClick("male");
        }}>
          Male
        </div>
        <div className={this.state.value === "female" ? "active" : null} onClick={() => {
          this.onClick("female");
        }}>
          Female
        </div>
      </div>
    );
  }
}
