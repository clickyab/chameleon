import * as React from "react";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import Translate from "../../../../components/i18n/Translate/index";
import {UserApi, UserResponseLoginOKAccount} from "../../../../api/api";
import {Form, Card, Row, message, Col, notification , Layout} from "antd";
import {TextField, Checkbox, RaisedButton, FontIcon, Toggle, SelectField} from "material-ui";
import {setUser, setIsLogin} from "../../../../redux/app/actions/index";
import Icon from "../../../../components/Icon/index" ;

const {Sider} = Layout;
const FormItem = Form.Item;


export namespace App {
    export namespace Public {
        export namespace Register {
            export interface Props extends RouteComponentProps<void> {
                form: any;
            }

            export interface State {
                isDisable: boolean;
            }
        }
    }
}


@connect(mapStateToProps, mapDispatchToProps)
export default class PublicProfileContainer extends React.Component<App.Public.Register.Props, App.Public.Register.State> {

    private i18n = I18n.getInstance();

    constructor(props: App.Public.Register.Props) {
        super(props);

        this.state = {
            isDisable: true,
        };
    }

    render() {
        const mailPlaceHolder = this.i18n._t("Email");
        const passwordPlaceHolder = this.i18n._t("Password");
        // const {getFieldDecorator} = this.props.form;
        return (
            <div className="profile-container">
                    <Row gutter={16} type="flex" align="top" justify="center">
                        <Col span={18}>
                            <Row gutter={16} type="flex" align="top" >
                            <Col span={12}>
                                <FormItem>
                                    <TextField
                                        fullWidth={true}
                                        floatingLabelText={this.i18n._t("Name")}
                                        autoFocus={true}
                                    />
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem>
                                    <TextField
                                        fullWidth={true}
                                        floatingLabelText={this.i18n._t("Family")}
                                    />
                                </FormItem>
                            </Col>
                            </Row>
                            <Row  gutter={16} className={ (this.state.isDisable) ? "column-disable" : ""}  type="flex" align="top" >
                                <Col span={12}>
                                    <FormItem>
                                        <TextField
                                            fullWidth={true}
                                            floatingLabelText={this.i18n._t("Email")}
                                            disabled={true}
                                        />
                                    </FormItem>
                                    <p className="enable-des">You can't change your Email. for changing your password <a onClick={() => {
                                        this.setState({
                                            isDisable: !this.state.isDisable,
                                        });
                                    }}> Click here</a></p>
                                </Col>
                                <Col span={12}>
                                    <FormItem>
                                        <TextField
                                            fullWidth={true}
                                            floatingLabelText={this.i18n._t("Password")}
                                            type="password"
                                            disabled={this.state.isDisable}
                                        />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16} type="flex" align="top" >
                                <Col span={12}>
                                    <FormItem>
                                        <TextField
                                            fullWidth={true}
                                            floatingLabelText={this.i18n._t("Mobile")}
                                            autoFocus={true}
                                        />
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem>
                                        <TextField
                                            fullWidth={true}
                                            floatingLabelText={this.i18n._t("Phone")}
                                        />
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Col  className="profile-notice">
                                <h6><Icon name="arrow"/>You Sould know</h6>
                                <ul>
                                    <li>Filling bullet fields are required</li>
                                    <li>You can't change your password to any of your former passwords for security
                                        reasons
                                    </li>
                                    <li>Your defualt avatar set to your Gavatar.com avatar. You can change your default
                                        avatar by clicking on it
                                    </li>
                                </ul>
                            </Col>
                        </Col>
                    </Row>
            </div>
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

