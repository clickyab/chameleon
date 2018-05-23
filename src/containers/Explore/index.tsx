/**
 * @class manage Inventories.
 * @desc Show Publishers and My Inventories in the tabs. User can open each inventory in a new tab.
 *
 */

// FIXME:: can not receive ref of ListOfInventories, so I use state and props to pass updated record of inventory to publisher list. it have to fix.

import * as React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {RootState} from "../../redux/reducers/index";
import {Row, Tabs} from "antd";
import I18n from "../../services/i18n/index";
import Translate from "../../components/i18n/Translate/index";
import CONFIG from "../../constants/config";
import {setBreadcrumb} from "../../redux/app/actions/index";
import ListOfPublishers from "./containers/ListOfPublishers";
import ListOfInventories from "./containers/ListOfInventories";
import ListOfPublishersInventory from "./containers/ListOfPublishersInventory";
import "./style.less";


const TabPane = Tabs.TabPane;

enum COMP_TAB {
    PUBLISHER = "All publishers",
    MY_LISTS = "My lists",
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
    activeKey: string;
    updateRecord?: any;
}

@connect(mapStateToProps, mapDispatchToProps)
class Explore extends React.Component <IProps, IState> {
    private i18n = I18n.getInstance();
    private ListOfInventories = ListOfInventories;

    constructor(props: IProps) {
        super(props);
        this.state = {
            tab: COMP_TAB.PUBLISHER,
            openedList: [],
            activeKey: "MyLists", // "AllPublishers",
        };
    }

    public componentDidMount() {
        this.props.setBreadcrumb("explore", this.i18n._t("Explore").toString(), "home");
    }

    private handleTab(key): void {
        this.setState({
            activeKey: key,
        });
    }

    private onEdit(targetKey, action) {
        if (action === "remove") {
            this.remove(targetKey);
        }
    }

    private remove(targetKey) {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.openedList.forEach((list, i) => {
            if (list.id.toString() === targetKey) {
                lastIndex = i - 1;
            }
        });
        const openedList = this.state.openedList.filter(pane => pane.id.toString() !== targetKey);
        if (activeKey !== "AllPublishers" && activeKey !== "MyLists" && lastIndex >= 0 && activeKey === targetKey) {
            activeKey = openedList[lastIndex].id;
        } else if (activeKey !== "AllPublishers" && activeKey === targetKey) {
            activeKey = "MyLists";
        }
        this.setState({openedList, activeKey});
    }

    public render() {
        return (
            <div dir={CONFIG.DIR} className={"content-container"}>
                <Row className="page-title">
                    <h3><Translate value={"Explore"}/></h3>
                </Row>
                <Row type={"flex"} align={"middle"}>
                    <Tabs activeKey={this.state.activeKey}
                          onEdit={this.onEdit.bind(this)}
                          onChange={this.handleTab.bind(this)}
                          type="editable-card"
                          hideAdd={true}
                          className="tabs-container">
                        <TabPane tab={this.i18n._t("All publishers")} key="AllPublishers" closable={false}>
                            <ListOfPublishers/>
                        </TabPane>
                        <TabPane className="tab-contain-datatable" tab={this.i18n._t("My List")} key="MyLists" closable={false}>
                            <ListOfInventories
                                ref={ListOfInventories => {
                                    this.ListOfInventories = ListOfInventories;
                                }}
                                updatedRecord={this.state.updateRecord}
                                onEditListClick={(list) => {
                                    this.setState({
                                        openedList: [...this.state.openedList, list],
                                        activeKey: list.id.toString(),
                                    });
                                }}/>
                        </TabPane>
                        {this.state.openedList.map((list, i) => (
                            <TabPane tab={list.label} key={list.id.toString()} closable={true}>
                                <ListOfPublishersInventory
                                    inventory={list}
                                    onChange={(newRecord) => {
                                        this.setState(prevState => {
                                            prevState.updateRecord = newRecord;
                                            prevState.openedList[i] = newRecord;
                                        });
                                    }}
                                />
                            </TabPane>)
                        )}
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

export default (withRouter(Explore));
