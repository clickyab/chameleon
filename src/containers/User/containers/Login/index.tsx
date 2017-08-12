import * as React from "react";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import Translate from "../../../../components/i18n/Translate/index";
import DateTime from "../../../../components/i18n/DateTime/index";
import {UserApi} from "../../../../api/api";
import {Input, Button} from "antd";
import {Card} from "antd";

interface IProps extends RouteComponentProps<void> {
  setUser: any;
}

interface IState {
  email: string;
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PublicLoginContainer extends React.Component<IProps, IState> {

  private i18n = I18n.getInstance();

  constructor(props: IProps) {
    super(props);

    this.state = {
      email: "test@test.com",
    };
  }

  private submitMail() {
    const api = new UserApi();
    api.userMailCheckPost({
      payloadData: {email: this.state.email},
    }).then((data) => {
      console.log(data);
    }).catch((err) => {
      console.log(err);
    });
  }

  private handleChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  public render() {
    const mailPlaceHolder = this.i18n._t("Enter your Email address.");

    return (
      <Card>
        <Translate value="a _{name} _{name}" html={true} params={{name: "sina"}}/>
        <DateTime value={Date.now()}/>
        <Input placeholder={mailPlaceHolder.toString()} onChange={this.handleChangeEmail.bind(this)}/>
        <Button type="primary" onClick={this.submitMail.bind(this)}>Check</Button>
        <Link to={`./register`}>Register Page</Link>
      </Card>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    /* empty */
  };
}

function mapDispatchToProps(dispatch) {
  return {
    /* empty */
  };
}
