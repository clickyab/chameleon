import * as React from "react";
import {Redirect, RouteComponentProps, Switch} from "react-router";
import {PrivateRoute} from "../../../../../../components/PrivateRoute/index";
import TransactionHistory from "../../../../../User/containers/TransactionHistory/index";
import {UserResponseLoginOKAccount} from "../../../../../../api/api";
import {Tabs, Row} from "antd/lib";
import I18n from "../../../../../../services/i18n/index";
import CONFIG from "../../../../../../constants/config";
import Translate from "../../../../../../components/i18n/Translate/index";
import "./style.less";
import WhiteLabelCharge from "./WhiteLabelCharge";
import WhiteLabelDeductible from "./WhiteLabelDeductible";


const TabPane = Tabs.TabPane;

/**
 * @interface
 * @desc define component props
 */
interface IOwnProps {
    match?: any;
    history?: any;
}

enum WHITELABEL_BILL_TAB {
    CHARGE = "charge",
    DEDUCTIBLE = "deductible",
}

interface IProps extends RouteComponentProps<void> {
    user: UserResponseLoginOKAccount;
    setUser: (user: UserResponseLoginOKAccount) => {};
    activeTab: string;
}

interface IState {
    user: UserResponseLoginOKAccount;
    uploadProgress: number;
    activeTab: string;
    showPaymentResult: boolean;
}

class WhitelabelBilling extends React.Component<IProps, IState> {

    private i18n = I18n.getInstance();

    constructor(props: IProps) {
        super(props);
        this.state = {
            user: props.user,
            uploadProgress: null,
            activeTab: props.activeTab ? props.activeTab : WHITELABEL_BILL_TAB.CHARGE,
            showPaymentResult: false,
        };
    }

    componentDidMount() {
        this.handleTabUrl(window.location.href);
    }

    componentWillReceiveProps(props: IProps) {
        this.setState({
            user: props.user,
        });
        this.handleTabUrl(window.location.href);
    }

    private handleTabUrl(url: string): void {
        let splitUrl = url.split("?")[0].split("/");
        let tempKey: string = WHITELABEL_BILL_TAB.CHARGE;
        switch (splitUrl[splitUrl.length - 1]) {
            case WHITELABEL_BILL_TAB.CHARGE:
                tempKey = WHITELABEL_BILL_TAB.CHARGE;
                break;
            case WHITELABEL_BILL_TAB.DEDUCTIBLE:
                tempKey = WHITELABEL_BILL_TAB.DEDUCTIBLE;
                break;
        }
        this.setState({
            activeTab: tempKey,
        });
    }

    private handleTab(key): void {
        let tempKey;
        switch (key) {
            case  WHITELABEL_BILL_TAB.CHARGE:
                tempKey = WHITELABEL_BILL_TAB.CHARGE;
                break;
            case  WHITELABEL_BILL_TAB.DEDUCTIBLE:
                tempKey = WHITELABEL_BILL_TAB.DEDUCTIBLE;
                break;
        }
        this.setState({activeTab: tempKey});
        this.props.history.push(this.props.match.url + "/" +  tempKey);
    }


    render() {
        const {match} = this.props;
        return (
            <div dir={CONFIG.DIR} className="whitelabel-billing">
                <div className="page-info-container">
                <Translate className="page-title" value={"Account charge and deductible"}/>
                <Translate className="page-description" value={"You can charge user account manualy. also if you made mistake during charging and charge user more than intended you can deduct it"}/>
                </div>
                <Switch>
                    <Row type="flex" align="middle">
                        <Tabs activeKey={this.state.activeTab}
                              onChange={this.handleTab.bind(this)}
                              type="editable-card"
                              hideAdd={true}
                              className="tabs-container">
                            <TabPane tab={this.i18n._t("Charge Account")} key="charge" closable={false}>
                                <div>
                                    <PrivateRoute path={`${match.url}/charge`} component={WhiteLabelCharge}/>
                                </div>
                            </TabPane>
                            <TabPane tab={this.i18n._t("Deductible account")} key="deductible" closable={false}>
                                <div>
                                    <PrivateRoute path={`${match.url}/deductible`} component={WhiteLabelDeductible}/>
                                </div>
                            </TabPane>
                        </Tabs>
                    </Row>
                </Switch>
            </div>
        );
    }
}


// export component and use withRouter to access route properties
export default (WhitelabelBilling);
