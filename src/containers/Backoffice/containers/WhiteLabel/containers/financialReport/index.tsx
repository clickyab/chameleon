/**
 * @class manage Inventories.
 * @desc Show Publishers and My Inventories in the tabs. User can open each inventory in a new tab.
 *
 */

// FIXME:: can not receive ref of ListOfInventories, so I use state and props to pass updated record of inventory to publisher list. it have to fix.

import * as React from "react";
import {connect} from "react-redux";
import {RootState} from "../../../../../../redux/reducers/index";
import {Row, Tabs} from "antd";
import I18n from "../../../../../../services/i18n/index";
import Translate from "../../../../../../components/i18n/Translate/index";
import CONFIG from "../../../../../../constants/config";
import {setBreadcrumb} from "../../../../../../redux/app/actions/index";
import whiteLabelAdd from "../whiteLabelAdd";
import {PrivateRoute} from "../../../../../../components/PrivateRoute";
import FinancialBilling from "./financialBilling";
import "./style.less";


const TabPane = Tabs.TabPane;

enum COMP_TAB {
    BILLING = "billing",
    STATICS = "statics",
}

interface IOwnProps {
    match?: any;
    history?: any;
}

interface IProps {
    match?: any;
    history?: any;
    setBreadcrumb: (name: string, title: string, parent: string) => void;
}

interface IState {
    tab: COMP_TAB;
    openedList: any[];
    activeKey: COMP_TAB;
    updateRecord?: any;
}

@connect(mapStateToProps, mapDispatchToProps)
class FinancialReport extends React.Component <IProps, IState> {
    private i18n = I18n.getInstance();

    constructor(props: IProps) {
        super(props);
        this.state = {
            tab: COMP_TAB.BILLING,
            openedList: [],
            activeKey: COMP_TAB.BILLING,
        };
    }

    public componentDidMount() {
        this.props.setBreadcrumb("financialReport", this.i18n._t("FinancialReport").toString(), "home");
        this.handleTabUrl(window.location.href);
    }

    componentWillReceiveProps(props: IProps) {
        this.handleTabUrl(window.location.href);
    }

    private handleTabUrl(url: string): void {
        let splitUrl = url.split("?")[0].split("/");
        let tempKey: COMP_TAB = COMP_TAB.BILLING;
        switch (splitUrl[splitUrl.length - 1]) {
            case COMP_TAB.BILLING:
                tempKey = COMP_TAB.BILLING;
                break;
            case COMP_TAB.STATICS:
                tempKey = COMP_TAB.STATICS;
                break;
        }
        this.setState({
            activeKey: tempKey,
        });
    }

    private handleTab(key): void {
        let tempKey;
        switch (key) {
            case  COMP_TAB.BILLING:
                tempKey = COMP_TAB.BILLING;
                break;
            case  COMP_TAB.STATICS:
                tempKey = COMP_TAB.STATICS;
                break;
        }
        this.setState({activeKey    : tempKey});
        this.props.history.push(this.props.match.url + "/" +  tempKey);
    }


    public render() {
        const {match} = this.props;
        return (
            <div dir={CONFIG.DIR} className={"content-container"}>
                <div className="page-info-container">
                    <Translate className="page-title" value={"Account charge and deductible"}/>
                    <Translate className="page-description" value={"You can charge user account manually. also if you made mistake during charging and charge user more than intended you can deduct it"}/>
                </div>
                <Row type={"flex"} align={"middle"}>
                    <Tabs activeKey={this.state.activeKey}
                          onChange={this.handleTab.bind(this)}
                          type="editable-card"
                          hideAdd={true}
                          className="tabs-container">
                        <TabPane tab={this.i18n._t("Billing")} key={COMP_TAB.BILLING} closable={false}>
                            <PrivateRoute path={`${match.url}/billing`} component={FinancialBilling}/>
                        </TabPane>
                        <TabPane className="tab-contain-datatable" tab={this.i18n._t("Statics of publishers")} key={COMP_TAB.STATICS} closable={false}>
                            <PrivateRoute path={`${match.url}/statics`} component={whiteLabelAdd}/>
                        </TabPane>
                    </Tabs>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state: RootState, ownProps: IOwnProps) {
    return {
        match: ownProps.match,
        history: ownProps.history,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setBreadcrumb: (name: string, title: string, parent: string) => dispatch(setBreadcrumb({name, title, parent})),
    };
}

export default (FinancialReport);
