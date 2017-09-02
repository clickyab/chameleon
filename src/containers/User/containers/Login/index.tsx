import * as React from "react";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {RootState} from "../../../../redux/reducers/index";
import I18n from "../../../../services/i18n/index";
import Translate from "../../../../components/i18n/Translate/index";
import {UserApi, UserResponseLoginOKAccount} from "../../../../api/api";
import {Card, Col, Form, message, notification, Row} from "antd";
import {Checkbox, FontIcon, RaisedButton, TextField, Toggle} from "material-ui";
import {setIsLogin, setUser} from "../../../../redux/app/actions/index";
import AAA from "../../../../services/AAA/index";
import Icon from "../../../../components/Icon/index";

import 'style.less';

const FormItem = Form.Item;

interface IProps extends RouteComponentProps<void> {
    isLogin: boolean;
    user: UserResponseLoginOKAccount;
    setUser: (user: UserResponseLoginOKAccount) => {};
    setIsLogin: () => {};
    form: any;
}

interface IState {
    email: string;
    isCorporation: boolean;
    step: STEPS;
}

enum STEPS { CHECK_MAIL, LOGIN, REGISTER}

@connect(mapStateToProps, mapDispatchToProps)
class PublicLoginForm extends React.Component<IProps, IState> {

    private i18n = I18n.getInstance();

    constructor(props: IProps) {
        super(props);

        this.state = {
            email: "",
            step: STEPS.CHECK_MAIL,
            isCorporation: false,
        };
    }

    public componentDidMount() {
        if (this.props.isLogin) {
            this.props.history.push("/");
        }
    }

    public render() {
        const mailPlaceHolder = this.i18n._t("Email");
        const passwordPlaceHolder = this.i18n._t("Password");
        const {getFieldDecorator} = this.props.form;

        return (
            <Row className="full-screen" type="flex" align="middle" justify="center">
                <div>
                    <Row className="logo-img" align="middle" justify="center"/>
                    {this.state.step === STEPS.CHECK_MAIL &&
                    <Card className="login-box" noHovering>
                        <h5 className="text-center">
                            <Translate value="Enter your email address"/>
                        </h5>
                        <form onSubmit={this.submitMail.bind(this)}>
                            <FormItem className="login-input">
                                {getFieldDecorator("email", {
                                    rules: [{required: true, message: "Please input your username!"}],
                                })(
                                    <TextField
                                        fullWidth={true}
                                        hintText={mailPlaceHolder}
                                        autoFocus={true}
                                    />
                                )}
                            </FormItem>
                            <FormItem>
                                <RaisedButton
                                    type="submit"
                                    label={<Translate value="Next Step"/>}
                                    primary={true}
                                    className="button-full-width button-next-step"
                                    icon={<Icon name="arrow" color="white"/>}
                                />
                            </FormItem>
                        </form>
                    </Card>
                    }
                    {this.state.step === STEPS.LOGIN &&
                    <Card className="login-box" noHovering>
                        <h5 className="text-center">
                            <Translate value="You try to login with this email:"/>
                            <br/>
                            {this.state.email}
                        </h5>
                        <form onSubmit={this.submitLogin.bind(this)}>
                            <FormItem>
                                {getFieldDecorator("password", {
                                    rules: [{required: true, message: "Please input your username!"}],
                                })(
                                    <TextField
                                        fullWidth={true}
                                        type="password"
                                        hintText={passwordPlaceHolder}
                                        autoFocus={true}
                                    />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator("rememberMe")(
                                    <Checkbox label={this.i18n._t("Remember me")}/>
                                )}
                            </FormItem>
                            <FormItem>
                                <RaisedButton
                                    type="submit"
                                    label={<Translate value="Enter"/>}
                                    primary={true}
                                    className="button-full-width"
                                    icon={<Icon name="arrow"/>}
                                />
                            </FormItem>
                        </form>
                    </Card>
                    }
                    {this.state.step === STEPS.REGISTER &&
                    <a onClick={() => {
                        this.setState({
                            step: STEPS.CHECK_MAIL,
                        });
                    }}>
                        <h6 className="back-button">{this.i18n._t("Back")}</h6>
                    </a>
                    }
                    {this.state.step === STEPS.REGISTER &&
                    <Card className="login-box" noHovering>
                        <form onSubmit={this.submitRegister.bind(this)}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <FormItem>
                                        {getFieldDecorator("firstName", {
                                            rules: [{required: true, message: "Please input your first name!"}],
                                        })(
                                            <TextField
                                                fullWidth={true}
                                                floatingLabelText={this.i18n._t("Name")}
                                                autoFocus={true}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem>
                                        {getFieldDecorator("lastName", {
                                            rules: [{required: true, message: "Please input your last name!"}],
                                        })(
                                            <TextField
                                                fullWidth={true}
                                                floatingLabelText={this.i18n._t("Family")}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <FormItem>
                                {getFieldDecorator("email", {
                                    initialValue: this.state.email,
                                    rules: [{required: true, message: "Please input your email!"}],
                                })(
                                    <TextField
                                        fullWidth={true}
                                        floatingLabelText={this.i18n._t("Email")}
                                        disabled={true}
                                    />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator("password", {
                                    rules: [{required: true, message: "Please input your password!"}],
                                })(
                                    <TextField
                                        fullWidth={true}
                                        floatingLabelText={this.i18n._t("Password")}
                                        type="password"
                                    />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator("mobile", {
                                    rules: [{required: true, message: "Please input your phone!"}],
                                })(
                                    <TextField
                                        fullWidth={true}
                                        floatingLabelText={this.i18n._t("Phone Number")}
                                    />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator("corporation", {
                                    initialValue: false,
                                    rules: [{required: true, message: "Please input your phone!"}],
                                })(
                                    <Toggle
                                        label={this.i18n._t("Is Company?").toString()}
                                        defaultToggled={this.state.isCorporation}
                                        onToggle={(e) => {
                                            console.log(e);
                                            this.setState({isCorporation: !this.state.isCorporation});
                                        }}
                                    />
                                )}
                            </FormItem>
                            {this.state.isCorporation &&
                            <FormItem>
                                {getFieldDecorator("companyName", {
                                    rules: [{
                                        required: this.state.isCorporation,
                                        message: "Please input your company name!"
                                    }],
                                })(
                                    <TextField
                                        fullWidth={true}
                                        floatingLabelText={this.i18n._t("Company Name")}
                                    />
                                )}
                            </FormItem>
                            }
                            <FormItem>
                                <RaisedButton
                                    type="submit"
                                    label={<Translate value="Enter"/>}
                                    primary={true}
                                    className="button-full-width"
                                    icon={<Icon name="arrow"/>}
                                />
                            </FormItem>
                        </form>
                    </Card>
                    }
                    {this.state.step !== STEPS.REGISTER && this.state.step !== STEPS.LOGIN &&
                    <Row className="text-center forgot-password">
                        <p>
                            <Translate value="Do you Forgot your password?"/>
                        </p>
                        <h5>
                            <Link to={`./recover-password`}>
                                <Translate value="Recover"/>
                            </Link>
                        </h5>
                    </Row>
                    }
                </div>
            </Row>
        );
    }

    private submitLogin(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                message.error(this.i18n._t("Please fill all fields."));
                return;
            }

            const userApi = new UserApi();
            userApi.userLoginPost({
                payloadData: {
                    email: this.state.email,
                    password: values.password
                }
            })
                .then((data) => {

                    // store account data in store
                    this.props.setUser(data.account);
                    this.props.setIsLogin();

                    const aaa = AAA.getInstance();
                    aaa.setToken(data.token, values.rememberMe);

                    // redirect to dashboard
                    this.props.history.push("/dashboard");

                    // show notification
                    notification.success({
                        message: this.i18n._t("You sign in successfully."),
                        description: "",
                    });
                })
                .catch((error) => {
                    notification.error({
                        message: "Login Failed",
                        description: this.i18n._t(error.error.text).toString(),
                    });
                });
        });
    }

    private submitRegister(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const userApi = new UserApi();
            userApi.userRegisterPost({
                payloadData: {
                    email: this.state.email,
                    first_name: values.firstName,
                    last_name: values.lastName,
                    mobile: values.mobile,
                    password: values.password,
                    company_name: values.companyName,
                    user_type: values.corporation ? "corporation" : "personal",
                }
            }).then((data) => {

                // store sccount data in store
                this.props.setUser(data.account);
                this.props.setIsLogin();

                // redirect to dashboard
                this.props.history.push("/dashboard");

                // show notification
                notification.success({
                    message: "Registration",
                    description: this.i18n._t("Your account created successfully.").toString(),
                });

            }).catch((error) => {
                if (error.error) {
                    notification.error({
                        message: "Registration Failed",
                        description: this.i18n._t(error.error.text).toString(),
                    });
                } else {

                    let errors: string[] = [];
                    Object.keys(error).map((key: string) => {
                        errors.push(this.i18n._t(error[key].text).toString());
                    });
                    notification.error({
                        message: "Registration Failed",
                        description: errors.join("<br>"),
                    });
                }
            });
        });
    }

    private submitMail(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
                this.setState({
                    email: values.email,
                    step: STEPS.CHECK_MAIL,
                });
                if (!err) {
                    const api = new UserApi();
                    api.userMailCheckPost({
                        payloadData: {email: values.email},
                    }).then((data) => {
                        if (data.current_domain) {
                            this.setState({
                                email: values.email,
                                step: STEPS.LOGIN,
                            });
                        } else if (data.domains.length > 0) {
                            message.error(this.i18n._t("You don t'have account in this site!"));
                        } else {
                            this.setState({
                                email: values.email,
                                step: STEPS.REGISTER,
                            });
                        }

                    }).catch((err) => {
                        console.log(err);
                    });
                }
            }
        );
    }
}

function mapStateToProps(state: RootState) {
    return {
        isLogin: state.app.isLogin,
        user: state.app.user,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setUser: (user: UserResponseLoginOKAccount) => dispatch(setUser(user)),
        setIsLogin: () => dispatch(setIsLogin()),
    };
}

export default Form.create()(PublicLoginForm);
