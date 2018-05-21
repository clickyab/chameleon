import * as React from "react";
import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";
import {RootState} from "../../../../../../redux/reducers/index";
import I18n from "../../../../../../services/i18n/index";
import Translate from "../../../../../../components/i18n/Translate/index";
import {UserApi, UserResponseLoginOK, UserResponseLoginOKAccount} from "../../../../../../api/api";
import {Form, Row, Col, notification, Input, Button, Select} from "antd";
import {setUser, setBreadcrumb, unsetBreadcrumb} from "../../../../../../redux/app/actions/index";
import Icon from "../../../../../../components/Icon/index" ;
import CONFIG from "../../../../../../constants/config" ;
import "./style.less";
import LocationSelect from "../../../../../../components/LocationSelect/index";
import Gender from "../../../../../../components/Gender/index";
import ChangePassword from "./../../../../../../components/ChangePasswordModal";
import Avatar from "../../../../../../components/Avatar";
import {ACCOUNT_TYPE} from "../AddUser";
import {validateID} from "../../../../../../services/Utils/CustomValidations";
import ServerStore from "../../../../../../services/ServerStore";
import AAA from "../../../../../../services/AAA";
import {setIsLogin} from "../../../../../../redux/app/actions";

const FormItem = Form.Item;
const Option = Select.Option;

export interface IProps extends RouteComponentProps<void> {
    form: any;
    user: UserResponseLoginOKAccount;
    setUser: (user: UserResponseLoginOKAccount) => void;
    setBreadcrumb: (name: string, title: string, parent: string) => void;
    unsetBreadcrumb: (name: string) => void;
    setIsLogin: () => {};
}


export interface IState {
    isDisable: boolean;
    isCorporation: boolean;
    user: UserResponseLoginOKAccount;
    showPasswordModal: boolean;
    buttonDisable: boolean;
    editActive: boolean;
}


@connect(mapStateToProps, mapDispatchToProps)

class BackofficeProfileContainer extends React.Component<IProps, IState> {

    private i18n = I18n.getInstance();
    userApi = new UserApi();

    constructor(props: IProps) {
        super(props);

        this.state = {
            showPasswordModal: false,
            isDisable: true,
            isCorporation: this.props.user && this.props.user.legal_name ? true : false,
            user: this.props.user,
            buttonDisable: true,
            editActive: false,
        };
    }

    componentDidMount() {
        this.props.setBreadcrumb("edit-user-account", this.i18n._t("Edit user account").toString(), "home");
        const api = new UserApi();
        api.userPingGet({})
            .then((res) => {
                this.setState({user: res.account});
            });
    }

    private handleChangeLocation(country, province, city) {
        // TODO:: store country and province
        this.setState({
            user: {
                ...this.state.user,
                city_id: city,
            },
            buttonDisable: false,
        }, () => {
            // console.log(this.state);
        });
    }

    private handleButton() {
        this.setState({buttonDisable: false});
    }

    private handleSubmit(e) {
        if (e) e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                notification.error({
                    message: this.i18n._t("Update profile failed!"),
                    className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                    description: this.i18n._t("Please check all fields and try again!").toString(),
                });
                return;
            }
            const userApi = new UserApi();

            userApi.userUpdateIdPut({
                id: this.props.match.params["id"],
                payloadData: {
                    ...values,
                    city_id: this.state.user.city_id,
                }
            }).then((data) => {
                this.props.setUser(data.account as UserResponseLoginOKAccount);
                notification.success({
                    message: this.i18n._t("Update Profile"),
                    className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                    description: this.i18n._t("The Profile has been updated successfully.").toString(),
                });
            }).catch((error) => {
                if (error.error) {
                    notification.error({
                        message: this.i18n._t("Update Failed").toString(),
                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                        description: this.i18n._t(error.error.text).toString(),
                    });
                } else {

                    let errors: string[] = [];
                    Object.keys(error).map((key: string) => {
                        errors.push(this.i18n._t(error[key].text).toString());
                    });
                    notification.error({
                        message: this.i18n._t("Update Failed").toString(),
                        className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                        description: errors.join("<br>"),
                    });
                }
            });

        });
    }

    private impersonate() {
        this.userApi.userStartImpersonatePost({
            payloadData: {
                user_id: this.props.match.params["id"],
            }
        }).then((data: UserResponseLoginOK) => {
            this.props.setUser(data.account);
            this.props.setIsLogin();

            ServerStore.getInstance().setItems(data.account.attributes);
            console.log(ServerStore.getInstance());

            const aaa = AAA.getInstance();
            aaa.setToken(data.token);

            // redirect to dashboard
            this.props.history.push("/dashboard");

            // show notification
            notification.success({
                message: this.i18n._t("You Impersonated successfully."),
                className: (CONFIG.DIR === "rtl") ? "notif-rtl" : "",
                description: "",
            });
        });
    }

    private changeState(active: boolean) {
        this.userApi.userChangeUserStatusIdPatch({
            id: this.props.match.params["id"],
            payloadData: {
                status: active ? "true" : "false",
            }
        }).then(() => {
            // this.setState({
            //     user : { ...this.state.user.st}
            // })
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const UserInfo = () => {
            return (
                <div className="user-area-information">
                    <Avatar user={this.state.user} radius={45}/>
                    <h6 className="user-name-info">{this.state.user.first_name + " " + this.state.user.last_name}</h6>
                    <span>{this.i18n._t(this.state.user.first_name) + "(" + this.i18n._t(this.state.isCorporation ? "corporation" : "Real") + ")"}</span>
                    <div className="info-wrapper">
                        <div className="border-left">
                            <Icon name={"cif-edit"}/>
                            <span className="span-block">{450000}</span>
                            <span className="span-block"><Translate value={"Toman"}/></span>
                        </div>
                        <div>
                            <Icon name={"cif-edit"}/>
                            <span className="span-block">{5}</span>
                            <span className="span-block"><Translate value={"Open ticket"}/></span>
                        </div>
                    </div>
                    {this.props.user.id.toString() !== this.props.match.params["id"] &&
                    <div>
                        <Button type="primary" onClick={() => this.impersonate.bind(this)}>
                            <span className="button-text">
                                <Translate value={"Login with impersonate mode"}/>
                            </span>
                        </Button>
                        <span className={"mt-4 mb-1"}>
                        <Translate
                            value={"You can suspend user any time with following button in case of rules violation"}/>
                    </span>
                        <Button onClick={() => {
                            this.changeState(true);
                        }} type="danger">
                            <span className="button-text">
                                <Translate value={"Deactivate user account"}/>
                            </span>
                        </Button>
                        <Button onClick={() => {
                            this.changeState(false);
                        }} type="primary">
                            <span className="button-text">
                                <Translate value={"Activate user account"}/>
                            </span>
                        </Button>
                    </div>
                    }
                </div>
            );
        };
        const OtherInfo = () => {
            return (
                <Row gutter={16} type="flex" align="top" className={"advance-info"}>
                    <Col span={24}>
                        <h5><Translate value={"Other user information"}/></h5>
                    </Col>
                    <Col span={12}>
                        <FormItem>
                            <span className="input-title require">
                                <Translate value="Account type"/></span>
                            {getFieldDecorator("account_type", {
                                initialValue: this.props.user.economic_code,
                                rules: [{
                                    required: true,
                                    message: this.i18n._t("Please input your Account type!")
                                }],
                            })(
                                <Select className={"full-width select-input"}
                                        dropdownClassName={"select-dropdown"}
                                        placeholder={this.i18n._t("exp: Advertiser, Support & ...") as string}
                                        disabled={!this.state.editActive}
                                >
                                    <Option value={ACCOUNT_TYPE.ADVERTIZER}><Translate
                                        value={ACCOUNT_TYPE.ADVERTIZER}/></Option>
                                    <Option value={ACCOUNT_TYPE.PUBLISHER}><Translate
                                        value={ACCOUNT_TYPE.PUBLISHER}/></Option>
                                    <Option value={ACCOUNT_TYPE.SUPPORTER}><Translate
                                        value={ACCOUNT_TYPE.SUPPORTER}/></Option>
                                </Select>)}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem>
                            <span className="input-title"><Translate value="Account number"/></span>
                            {getFieldDecorator("account_number", {
                                initialValue: this.state.user.address,
                            })(
                                <Input
                                    className="input-campaign"
                                    onChange={() => this.handleButton()}
                                    disabled={!this.state.editActive}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem>
               <span className="input-title require"><Translate
                   value="User manager"/></span>
                            {getFieldDecorator("account_type", {
                                initialValue: this.props.user.economic_code,
                                rules: [{
                                    required: true,
                                    message: this.i18n._t("Please user manager!")
                                }],
                            })(
                                <Select className={"full-width select-input"}
                                        dropdownClassName={"select-dropdown"}
                                        placeholder={this.i18n._t("exp: Advertiser, Support & ...") as string}
                                        disabled={!this.state.editActive}
                                >
                                    <Option value={ACCOUNT_TYPE.ADVERTIZER}><Translate
                                        value={ACCOUNT_TYPE.ADVERTIZER}/></Option>
                                    <Option value={ACCOUNT_TYPE.PUBLISHER}><Translate
                                        value={ACCOUNT_TYPE.PUBLISHER}/></Option>
                                    <Option value={ACCOUNT_TYPE.SUPPORTER}><Translate
                                        value={ACCOUNT_TYPE.SUPPORTER}/></Option>
                                </Select>)}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem>
                            <span className="input-title"><Translate value="Postal code"/></span>
                            {getFieldDecorator("ssn", {
                                initialValue: this.state.user.ssn,
                                rules: [
                                    {
                                        validator: validateID,
                                        message: this.i18n._t("Invalid national ID")
                                    }
                                ],
                            })(
                                <Input
                                    className="input-campaign"
                                    onChange={() => this.handleButton()}
                                    placeholder={this.i18n._t("Enter user postal code") as string}
                                    disabled={!this.state.editActive}
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            );
        };
        const UserProfile = () => {
            return (
                <div
                    className={`${(CONFIG.DIR === "rtl") ? "profile-container-rtl" : "profile-container"}`}>
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <Row gutter={16} type="flex" align="top" justify="center">
                            <Col span={6}>
                                {UserInfo()}
                            </Col>
                            <Col span={18}>
                                <Col span={24} className={"user-edit-wrapper"}>
                                    <Row gutter={16} type="flex" align="top">
                                        <Col span={24}>
                                            <div className="edit-user-wrapper">
                                                <h2><Translate value={"Edit user account"}/></h2>
                                                {!this.state.editActive &&
                                                <Button onClick={() => {
                                                    this.setState({editActive: true});
                                                }}>
                                                    <Translate value={"Active edit capability"}/>
                                                    <Icon name={"cif-edit"}/>
                                                </Button>
                                                }
                                            </div>
                                            <h6><Translate value={"General user information"}/></h6>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem>
                                                <span className="input-title"><Translate value="Name"/></span>
                                                {getFieldDecorator("first_name", {
                                                    initialValue: this.state.user.first_name,
                                                    rules: [{
                                                        required: true,
                                                        message: this.i18n._t("Please input your Submit Name!")
                                                    }],
                                                })(
                                                    <Input
                                                        className="input-campaign"
                                                        onChange={() => this.handleButton()}
                                                        disabled={!this.state.editActive}
                                                    />)}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem>
                                                <span className="input-title"><Translate value="Last name"/></span>
                                                {getFieldDecorator("last_name", {
                                                    initialValue: this.state.user.last_name,
                                                    rules: [{
                                                        required: true,
                                                        message: this.i18n._t("Please input your last name!")
                                                    }],
                                                })(
                                                    <Input
                                                        className="input-campaign"
                                                        onChange={() => this.handleButton()}
                                                        disabled={!this.state.editActive}
                                                    />)}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}
                                         type="flex"
                                         align="top">
                                        <Col span={12}>
                                            <FormItem>
                                                <span className="input-title"><Translate value="Email"/></span>
                                                {getFieldDecorator("email", {
                                                    initialValue: this.props.user.email,
                                                    rules: [{
                                                        required: true,
                                                        message: this.i18n._t("Please input your Submit Email!")
                                                    }],
                                                })(
                                                    <Input
                                                        className="input-campaign"
                                                        disabled={true}
                                                    />)}
                                            </FormItem>
                                            <p className="enable-des"><Translate
                                                value="You can't change email address after registration"/></p>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem>
                                                <span className="input-title"><Translate value="Password"/></span>
                                                <Input
                                                    placeholder={"********"}
                                                    className={"input-campaign"}
                                                    type="password"
                                                    disabled={this.state.isDisable}
                                                />
                                            </FormItem>
                                            <p className={(this.state.isDisable) ? "enable-des" : "disable-des"}>
                                                <Translate
                                                    value="If you want to change your password"/>
                                                <a onClick={() => {
                                                    this.setState({
                                                        showPasswordModal: true,
                                                    });
                                                    this.handleButton();
                                                }}><Translate value="Click here"/></a>
                                            </p>
                                        </Col>
                                    </Row>

                                    <Row gutter={16} type="flex" align="top">
                                        <Col>
                                            <FormItem>
                                                {getFieldDecorator("gender", {
                                                    initialValue: this.state.user.gender,
                                                    rules: [{
                                                        required: true,
                                                        message: this.i18n._t("Please select your Gender!")
                                                    }],
                                                })(
                                                    <Gender onChange={() => this.handleButton()}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>

                                    <Row gutter={16} type="flex" align="top">
                                        <hr className={"full-width mb-3 line"}/>
                                        <Col span={24} className={"mb-1"}>
                                            <h6><Translate value={"contact info and identity of user"}/></h6>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem>
                                                <span className="input-title"><Translate value="Mobile"/></span>
                                                {getFieldDecorator("cell_phone", {
                                                    initialValue: this.state.user.cellphone,
                                                    rules: [{
                                                        required: true,
                                                        message: this.i18n._t("Please input your mobile number!")
                                                    }],
                                                })(
                                                    <Input
                                                        className="input-campaign"
                                                        onChange={() => this.handleButton()}
                                                        disabled={!this.state.editActive}
                                                    />)}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            {this.state.user &&
                                            <LocationSelect
                                                onChange={this.handleChangeLocation.bind(this)}
                                                countryId={1}
                                                cityId={this.state.user.city_id}
                                                provinceId={this.state.user.province_name}
                                                disabled={!this.state.editActive}
                                            />
                                            }
                                        </Col>
                                    </Row>

                                    <Row gutter={16} type="flex" align="top">
                                        <Col span={12}>
                                            <FormItem>
                                                <span className="input-title"><Translate value="Phone"/></span>
                                                {getFieldDecorator("land_line", {
                                                    initialValue: this.state.user.land_line,
                                                    rules: [{
                                                        required: true,
                                                        message: this.i18n._t("Please input your phone!")
                                                    }],
                                                })(
                                                    <Input
                                                        className="input-campaign"
                                                        onChange={() => this.handleButton()}
                                                        disabled={!this.state.editActive}
                                                    />)}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem>
                                                <span className="input-title"><Translate value="Postal Code"/></span>
                                                {getFieldDecorator("postal_code", {
                                                    initialValue: this.state.user.postal_code,
                                                    rules: [{
                                                        required: true,
                                                        message: this.i18n._t("Please input your postal code!")
                                                    }],
                                                })(
                                                    <Input
                                                        className="input-campaign"
                                                        onChange={() => this.handleButton()}
                                                        disabled={!this.state.editActive}
                                                    />)}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={16} type="flex" align="top">
                                        <Col span={24}>
                                            <FormItem>
                                                <span className="input-title"><Translate value="Address"/></span>
                                                {getFieldDecorator("address", {
                                                    initialValue: this.state.user.address,
                                                })(
                                                    <Input
                                                        className="input-campaign"
                                                        onChange={() => this.handleButton()}
                                                        disabled={!this.state.editActive}
                                                    />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>
                                {OtherInfo()}
                                <Row>
                <span className={"change-to-corporation"}><Translate
                    value={"+ Do you want to change user from real to corporation? click here"}/></span>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                    <ChangePassword
                        userId={this.props.match.params["id"]}
                        onOk={() => {
                            this.setState({showPasswordModal: false});
                        }}
                        onCancel={() => {
                            this.setState({showPasswordModal: false});
                        }}
                        visible={this.state.showPasswordModal}/>
                </div>
            );
        };
        const CoprationProfile = () => {
            return (
                <div className={`${(CONFIG.DIR === "rtl") ? "profile-container-rtl" : "profile-container"}`}>
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <Row gutter={16} type="flex" align="top" justify="center">
                            <Col span={6}>
                                {UserInfo()}
                            </Col>
                            <Col span={18}>
                                <Col span={24} className={"user-edit-wrapper"}>
                                    <Row gutter={16} type="flex" align="top">
                                        <Col span={24}>
                                            <div className="edit-user-wrapper">
                                                <h2><Translate value={"Edit user account"}/></h2>
                                                {!this.state.editActive &&
                                                <Button onClick={() => {
                                                    this.setState({editActive: true});
                                                }}
                                                        className={"btn-active-edit"}>
                                                    <Translate value={"Active edit capability"}/>
                                                    <Icon name={"cif-edit"}/>
                                                </Button>
                                                }
                                            </div>
                                            <h6><Translate value={"General user information"}/></h6>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem>
                                                <span className="input-title require"><Translate
                                                    value="Contact point name"/></span>
                                                {getFieldDecorator("first_name", {
                                                    initialValue: this.state.user.first_name,
                                                    rules: [{
                                                        required: true,
                                                        message: this.i18n._t("Please input your Submit Name!")
                                                    }],
                                                })(
                                                    <Input
                                                        className="input-campaign"
                                                        onChange={() => this.handleButton()}
                                                        disabled={!this.state.editActive}
                                                    />)}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem>
                                                <span className="input-title require"><Translate
                                                    value="contact point last name"/></span>
                                                {getFieldDecorator("last_name", {
                                                    initialValue: this.state.user.last_name,
                                                    rules: [{
                                                        required: true,
                                                        message: this.i18n._t("Please input your last name!")
                                                    }],
                                                })(
                                                    <Input
                                                        className="input-campaign"
                                                        onChange={() => this.handleButton()}
                                                        disabled={!this.state.editActive}
                                                    />)}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}
                                         type="flex"
                                         align="top">
                                        <Col span={12}>
                                            <FormItem>
                                                <span className="input-title"><Translate value="Email"/></span>
                                                {getFieldDecorator("email", {
                                                    initialValue: this.props.user.email,
                                                })(
                                                    <Input
                                                        className="input-campaign"
                                                        disabled={true}
                                                    />)}
                                            </FormItem>
                                            <p className="enable-des"><Translate
                                                value="You can't change email address after registration"/></p>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem>
                                                <span className="input-title"><Translate value="Email"/></span>
                                                <Input
                                                    value={"********"}
                                                    className="input-campaign"
                                                    type="password"
                                                    disabled={this.state.isDisable}
                                                />
                                            </FormItem>
                                            <p className={(this.state.isDisable) ? "enable-des" : "disable-des"}>
                                                <Translate
                                                    value="If you want to change your password"/>
                                                <a onClick={() => {
                                                    this.setState({
                                                        showPasswordModal: true,
                                                    });
                                                    this.handleButton();
                                                }}><Translate value="Click here"/></a>
                                            </p>
                                        </Col>
                                    </Row>

                                    <Row gutter={16} type="flex" align="top">
                                        <hr className={"full-width mb-3 line"}/>
                                        <Col span={24} className={"mb-1"}>
                                            <h6><Translate value={"contact info and identity of user"}/></h6>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem>
                      <span className="input-title require"><Translate
                          value="Mobile of contact point"/></span>
                                                {getFieldDecorator("cell_phone", {
                                                    initialValue: this.state.user.cellphone,
                                                    rules: [{
                                                        required: true,
                                                        message: this.i18n._t("Please input your mobile number!")
                                                    }],
                                                })(
                                                    <Input
                                                        className="input-campaign"
                                                        onChange={() => this.handleButton()}
                                                        disabled={!this.state.editActive}
                                                    />)}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            {this.state.user &&
                                            <LocationSelect
                                                onChange={this.handleChangeLocation.bind(this)}
                                                countryId={1}
                                                cityId={this.state.user.city_id}
                                                provinceId={this.state.user.province_name}
                                                disabled={!this.state.editActive}
                                            />
                                            }
                                        </Col>
                                        <Col span={12}>
                                            <FormItem>
                                                <span className="input-title"><Translate
                                                    value="Corporation phone"/></span>
                                                {getFieldDecorator("land_line", {
                                                    initialValue: this.state.user.land_line,
                                                })(
                                                    <Input
                                                        className="input-campaign"
                                                        onChange={() => this.handleButton()}
                                                        disabled={!this.state.editActive}
                                                    />)}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem>
                                                <span className="input-title"><Translate
                                                    value="Corporation postal Code"/></span>
                                                {getFieldDecorator("postal_code", {
                                                    initialValue: this.state.user.postal_code,
                                                })(
                                                    <Input
                                                        className="input-campaign"
                                                        onChange={() => this.handleButton()}
                                                        disabled={!this.state.editActive}
                                                    />)}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={16} type="flex" align="top">
                                        <Col span={24}>
                                            <FormItem>
                                                <span className="input-title"><Translate
                                                    value="Corporation address"/></span>
                                                {getFieldDecorator("address", {
                                                    initialValue: this.state.user.address,
                                                })(
                                                    <Input
                                                        className="input-campaign"
                                                        onChange={() => this.handleButton()}
                                                        disabled={!this.state.editActive}
                                                    />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <hr className={"full-width mb-3 line"}/>
                                    <Row gutter={16} type="flex" align="top">
                                        <Col span={24} className={"mb-1"}>
                                            <h6><Translate value={"Corporation information"}/></h6>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem>
                                                <span className="input-title require"><Translate
                                                    value="Legal name(Corporation name)"/></span>
                                                {getFieldDecorator("legal_name", {
                                                    initialValue: this.state.user.legal_register,
                                                    rules: [{
                                                        required: true,
                                                        message: this.i18n._t("Please enter corporation name!")
                                                    }],
                                                })(
                                                    <Input
                                                        className="input-campaign"
                                                        onChange={() => this.handleButton()}
                                                        disabled={!this.state.editActive}
                                                    />)}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <Row gutter={16} type="flex" align="top">
                                                <Col span={12}>
                                                    <FormItem>
                                                        <span className="input-title"><Translate value="Economic code"/></span>
                                                        {getFieldDecorator("economic_code", {
                                                            initialValue: this.props.user.economic_code,
                                                        })(
                                                            <Input
                                                                className="input-campaign"
                                                                onChange={() => this.handleButton()}
                                                                disabled={!this.state.editActive}
                                                            />)}
                                                    </FormItem>
                                                </Col>
                                                <Col span={12}>
                                                    <FormItem>
                                                        <span className="input-title"><Translate value="Register Code"/></span>
                                                        {getFieldDecorator("register_code", {
                                                            initialValue: this.state.user.legal_register,
                                                        })(
                                                            <Input
                                                                className="input-campaign"
                                                                onChange={() => this.handleButton()}
                                                                disabled={!this.state.editActive}
                                                            />)}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                                {OtherInfo()}
                            </Col>
                        </Row>
                    </Form>
                    <ChangePassword
                        userId={this.props.match.params["id"]}
                        onOk={() => {
                            this.setState({showPasswordModal: false});
                        }}
                        onCancel={() => {
                            this.setState({showPasswordModal: false});
                        }}
                        visible={this.state.showPasswordModal}/>
                </div>
            );
        };

        return (
            <div dir={CONFIG.DIR} className="backoffice-content">
                {!this.state.isCorporation ? CoprationProfile() : UserProfile()}
                <Row type="flex">
                    <Col span={6}>
                    </Col>
                    <Col span={18}>
                        <Col span={24} className={"user-edit-wrapper"}>
                            <Row gutter={16} type="flex" align="top">
                                <div className="input-btn-wrapper">
                                    <Button onClick={() => {
                                        this.props.history.push("/backoffice/user/list");
                                    }}>
                                        <Translate value={"Cancel"}/>
                                    </Button>
                                    <Button type={"primary"} disabled={this.state.buttonDisable}>
                                        <Translate value={"Save"}/>
                                    </Button>
                                </div>
                            </Row>
                        </Col>
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state: RootState) {
    return {
        user: state.app.user,
        isLogin: state.app.isLogin,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setUser: (user: UserResponseLoginOKAccount) => dispatch(setUser(user)),
        setIsLogin: () => dispatch(setIsLogin()),
        setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
        unsetBreadcrumb: (name: string) => dispatch(unsetBreadcrumb(name)),
    };
}

export default Form.create()(BackofficeProfileContainer);
