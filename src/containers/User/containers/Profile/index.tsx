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
import CONFIG from "../../../../constants/config" ;

import "./style.less";

export interface IProps extends RouteComponentProps<void> {
    form: any;
}

export interface IState {
    isDisable: boolean;
    isCorporation: boolean;
}

const {Sider} = Layout;
const FormItem = Form.Item;




@connect(mapStateToProps, mapDispatchToProps)

class PublicProfileContainer extends React.Component<IProps, IState> {

    private i18n = I18n.getInstance();


    constructor(props: IProps) {
        super(props);

        this.state = {
            isDisable: true,
            isCorporation: false
        };
    }
    render() {
        const mailPlaceHolder = this.i18n._t("Email");
        const passwordPlaceHolder = this.i18n._t("Password");
        const {getFieldDecorator} = this.props.form;
        return (
            <div className={ ( CONFIG.DIR === "rtl" ) ? "profile-container-rtl" : "profile-container" }  >
                    <Row gutter={16} type="flex" align="top" justify="center">
                        <Col span={18}>
                            {this.state.isCorporation &&
                            <Row gutter={16} type="flex" align="top" >
                                <Col span={8}>
                                    <FormItem>
                                        {getFieldDecorator("Corpration Name", {
                                            rules: [{required: true, message: this.i18n._t("Please input your Submit Corpration Name!")}],
                                        })(
                                        <TextField
                                            fullWidth={true}
                                            floatingLabelText={this.i18n._t("Corpration Name")}
                                        />)}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem>
                                        {getFieldDecorator("Submit number/ID", {
                                            rules: [{required: true, message: this.i18n._t("Please input your Submit number/ID!")}],
                                        })(
                                        <TextField
                                            fullWidth={true}
                                            floatingLabelText={this.i18n._t("Submit number/ID")}
                                        />)}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem>
                                        {getFieldDecorator("Economic code", {
                                            rules: [{required: true, message: this.i18n._t("Please input your Submit Economic code!")}],
                                        })(
                                        <TextField
                                            fullWidth={true}
                                            floatingLabelText={this.i18n._t("Economic code")}
                                        />)}
                                    </FormItem>
                                </Col>
                            </Row>}
                            <Row gutter={16} type="flex" align="top" >
                            <Col span={12}>
                                <FormItem>
                                    {getFieldDecorator("Name", {
                                        rules: [{required: true, message: this.i18n._t("Please input your Submit Name!")}],
                                    })(
                                    <TextField
                                        fullWidth={true}
                                        floatingLabelText={this.i18n._t("Name")}
                                    />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem>
                                    {getFieldDecorator("Last name", {
                                        rules: [{required: true, message: this.i18n._t("Please input your Submit last name!")}],
                                    })(
                                    <TextField
                                        fullWidth={true}
                                        floatingLabelText={this.i18n._t("Last name")}
                                    />)}
                                </FormItem>
                            </Col>
                            </Row>
                            <Row  gutter={16} className={ (this.state.isDisable) ? "column-disable" : "column-enable"}  type="flex" align="top" >
                                <Col span={12}>
                                    <FormItem>
                                        {getFieldDecorator("Email", {
                                            rules: [{required: true, message: this.i18n._t("Please input your Submit Email!")}],
                                        })(
                                        <TextField
                                            fullWidth={true}
                                            floatingLabelText={this.i18n._t("Email")}
                                            disabled={true}
                                        />)}
                                    </FormItem>
                                    <p className={ (this.state.isDisable) ? "enable-des" : "disable-des"}>You can't change your Email. for changing your password <a onClick={() => {
                                        this.setState({
                                            isDisable: !this.state.isDisable,
                                        });
                                    }}> Click here</a></p>
                                </Col>
                                <Col span={12}>
                                    <FormItem>
                                        {getFieldDecorator("password", {
                                            rules: [{required: true, message: this.i18n._t("Please input your Submit password!")}],
                                        })(
                                        <TextField
                                            fullWidth={true}
                                            floatingLabelText={this.i18n._t("Password")}
                                            type="password"
                                            disabled={this.state.isDisable}
                                        />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16} type="flex" align="top" >
                            <Col span={12}>
                                <FormItem>
                                    {getFieldDecorator("Mobile", {
                                        rules: [{required: true, message: this.i18n._t("Please input your Submit mobile!")}],
                                    })(
                                        <TextField
                                            fullWidth={true}
                                            floatingLabelText={this.i18n._t("Mobile")}
                                        />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem>
                                    {getFieldDecorator("phone", {
                                        rules: [{required: true, message: this.i18n._t("Please input your Submit phone!")}],
                                    })(
                                        <TextField
                                            fullWidth={true}
                                            floatingLabelText={this.i18n._t("phone")}
                                        />)}
                                </FormItem>
                            </Col>
                        </Row>
                            <Row gutter={16} type="flex" align="top" >
                                <Col span={12}>
                                    <FormItem>
                                            <TextField
                                                fullWidth={true}
                                                floatingLabelText={this.i18n._t("Post Address")}
                                            />
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem>
                                            <TextField
                                                fullWidth={true}
                                                floatingLabelText={this.i18n._t("Address")}
                                                defaultValue="Defualt address goes here"
                                                disabled={true}
                                            />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16} type="flex"  align="top"  >
                                <Col span={24} >
                                <RaisedButton
                                    type="Enter"
                                    label={<Translate value="Save Changes"/>}
                                    className="btn-save-change"
                                    style={{color: "green"}}
                                />
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

export default Form.create()(PublicProfileContainer);