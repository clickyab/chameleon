/**
 * Draw data table base on definition object.
 *
 * @example:
 *
 * <DataTable
 *     name="publisherList"
 *     definitionFn={getDefinitionApiFn} // API call function for definition
 *     dataFn={controllerApi.inventoryListGet} // API call function for data
 *     onSelectRow={selectFn}/> // On select row call back with array of selectedRowKeys and selectedRows arguments
 *
 */
import * as React from "react";
import {ReactNode} from "react";
import {Button, Checkbox, Col, Input, Row, Select, Switch, Table} from "antd";
import {DataTableDataParser} from "./lib/parsers";
import {IActionsFn, IData, IDefinition, ITableBtn} from "./lib/interfaces";
import {PaginationProps} from "antd/lib/pagination";
import "./style.less";
import Icon from "../Icon/index";
import Modal from "../../components/Modal/index";
import Translate from "../i18n/Translate/index";
import I18n from "../../services/i18n/index";
import CONFIG from "../../constants/config";
import * as moment from "moment-jalaali";
import ServerStore from "./../../services/ServerStore";
import {currencyFormatter} from "../../services/Utils/CurrencyFormatter";

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

/**
 * @interface IProps
 */
interface IProps {
    /**
     * @params dataFn - API call to get data
     */
    dataFn: any;

    /**
     * @params definitionFn - API call to get definition
     */
    definitionFn: any;

    /**
     * @params name - name of table for store in local storage
     */
    name: string;

    /**
     * @params onSelectRow - callback function for on selected rows changed
     */
    onSelectRow?: (rows: string[], selectedRows: any[]) => void;

    /**
     * @params infinite - load table's data by infinite scroll
     */
    infinite?: boolean;

    /**
     * @param tableDescription - An element to render in table description's position
     */
    tableDescription?: JSX.Element;

    /**
     * @params customRenderColumns - an object with key of column for cell custom render
     */
    customRenderColumns?: { [key: string]: (value?: string, record?: any, index?: number) => JSX.Element };

    /**
     * @params actionsFn - an object with keys of each action function
     */
    actionsFn?: IActionsFn;


    /**
     * @params ITableBtn - an array with table buttons definitions
     */
    tableButtons?: ITableBtn[];

    /**
     * @params onQueryChange - function that called when load data parameters changed
     */
    onQueryChange?: (query: any) => void;

    dateRange?: {
        from: moment.type,
        to: moment.type,
    };
}


/**
 * @interface IState
 */
interface IState {
    data?: IData;
    columns?: any;
    definition?: IDefinition;
    page: number;
    sort?: string;
    order?: "descend" | "ascend" | null;
    filters?: {};
    searches?: string;
    loading: boolean;
    selectedRows: object[];
    selectedKeys: string[];
    customizeModal: boolean;
    customField: object;
    pageSize: number;
}


export interface IData {
    data: object[];
    hash: string;
    page: number;
    per_page: number;
    total: number;
}

class DataTable extends React.Component<IProps, IState> {
    parser;
    infiniteLoader: boolean = false;
    customFieldTemp: object = {};
    wrapperDOM: HTMLElement;
    range;
    quary;
    serverStore = ServerStore.getInstance();

    private i18n = I18n.getInstance();

    constructor(props: IProps) {
        super(props);
        const customFieldsObject = this.serverStore.getItem(`TABLE_CUSTOM_${this.props.name}`);
        let customField = customFieldsObject ? customFieldsObject : {};
        props.infinite ? this.infiniteLoader = props.infinite : null;
        this.state = {
            selectedRows: [],
            selectedKeys: [],
            loading: true,
            page: 1,
            filters: {},
            searches: "",
            customizeModal: false,
            customField: customField,
            pageSize: 10,
        };

        if (props.dateRange) {
            this.range = props.dateRange;
        }

        this.changeRecordData = this.changeRecordData.bind(this);
    }

    /**
     * Load data
     */
    componentDidMount() {
        this.loadData();
    }

    componentWillReceiveProps(props: IProps) {
        if (!!this.range && (this.range.from !== props.dateRange.from || this.range.to !== props.dateRange.to)) {
            this.range = props.dateRange;
            this.loadData(false);
        }
    }

    /**
     * Open customization modal by set state
     */
    private openCustomizeModal() {
        this.setState(
            {customizeModal: true}
        );
    }

    private selectPageSize(value) {
        this.setState({
            pageSize: parseInt(value)
        });
    }


    /**
     * Store table definition in local storage
     * @param {IDefinition} definition
     */
    storeDefinition(definition: IDefinition) {
        this.serverStore.setItem(`TABLE_DEFINITION_${this.props.name}`, definition);
    }


    /**
     * Store table customization data in local storage
     * @param {any} definition
     */
    storeCustom(customField) {
        this.serverStore.setItem(`TABLE_CUSTOM_${this.props.name}`, customField);
    }

    /**
     * Try to load definition from local storage
     * @returns {IDefinition}
     */
    restoreDefinition(): IDefinition | null {
        return this.serverStore.getItem(`TABLE_DEFINITION_${this.props.name}`);
    }

    /**
     * Try to load definition from local storage or API Call
     * @returns {Promise<IDefinition>}
     */
    loadDefinition(): Promise<IDefinition> {
        return new Promise((res, rej) => {
            let def = this.restoreDefinition();
            if (def) {
                this.setState({
                    definition: def,
                });
                res(def);
            } else {
                this.props.definitionFn({})
                    .then((definition: IDefinition) => {
                        this.setState({
                            definition,
                        });
                        this.storeDefinition(definition);
                        res(definition);
                    })
                    .catch((err) => {
                        rej(err);
                    });
            }
        });
    }

    /**
     * Add event to table's parent div for infinite scroll
     */
    addScrollListener() {
        if (this.state.page === 1) {
            setTimeout(() => {
                const tableContent = document.querySelector(".ant-table-body");
                tableContent.addEventListener("scroll", (event) => {
                    let maxScroll = event.target["scrollHeight"] - event.target["clientHeight"];
                    let currentScroll = event.target["scrollTop"];
                    if (currentScroll === maxScroll) {
                        // load more data
                        if (this.props.infinite) {
                            this.setState({
                                page: this.state.page + 1,
                            }, this.loadData);
                        }
                    }
                });
            }, 1000);
        }
    }

    /**
     * Try to load data from API Call and if data's hash response is different with definition's hash, try to load
     * new definition
     */
    loadData(callOnQueryChange: boolean = true) {

        let config = {
            p: this.state.page,
            loading: true,
            data: {data: []}
        };
        this.forceUpdate();

        if (this.range && this.range.from) {
            config["from"] = this.range.from.toISOString();
        }
        if (this.range && this.range.to) {
            config["to"] = this.range.to.toISOString();
        }

        if (this.state.sort) {
            config["sort"] = `${this.state.sort}:${this.state.order}`;
        }

        if (this.state.filters) {
            Object.keys(this.state.filters).map((f) => {
                config[f] = this.state.filters[f].join(",");
            });
        }

        if (this.state.searches && this.state.definition && this.state.definition.searchkey) {
            config[this.state.definition.searchkey] = this.state.searches;
        }

        if (this.props.onQueryChange && callOnQueryChange) {
            this.props.onQueryChange(config);
        }
        this.quary = config;

        this.props.dataFn(config).then((data: IData) => {

            // TODO:: remove me
            // data.data = data.data.map(d => {
            //     d["_actions"] = "edit, archive, copy";
            //     return d;
            // });

            if (this.state.data && this.props.infinite) {
                data.data = [...this.state.data.data, ...data.data];
            }
            let def = this.restoreDefinition();
            if (def && def.hash === data.hash) {

                let customField = this.state.customField;
                def.columns.map((c) => {
                    if (c.visible) {
                        customField[c.name] = (customField[c.name] !== undefined) ? customField[c.name] : true;
                    }
                });
                this.setState({
                    data,
                    definition: def,
                    loading: false,
                }, () => {
                    this.addScrollListener();
                    this.infiniteLoader = false;
                    this.setColumnsWidth();
                });
            } else {
                this.storeDefinition(null);
                this.loadDefinition()
                    .then((def) => {
                        let customField = this.state.customField;
                        def.columns.map((c) => {
                            if (c.visible) {
                                customField[c.name] = (customField[c.name] !== undefined) ? customField[c.name] : true;
                            }
                        });

                        this.setState({
                            data,
                            // customField,
                            loading: false,
                            definition: def,
                        }, () => {
                            this.addScrollListener();
                            this.infiniteLoader = false;
                            this.setColumnsWidth();
                        });

                    });

            }
        });
    }

    /**
     * Generate table's select config
     * @returns {{onChange: ((selectedRowKeys, selectedRows) => any)}}
     */
    loadSelectionConfig() {
        const rowSelection = {
            selectedRowKeys: this.state.selectedKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                if (this.props.onSelectRow) {

                    let keys = selectedRowKeys;

                    if (this.state.definition.key) {
                        keys = selectedRows.map((r) => (r[this.state.definition.key]));
                    }

                    this.setState({
                        selectedRows,
                        selectedKeys: keys
                    });

                    this.props.onSelectRow(keys, selectedRows);
                }
            },
        };

        return rowSelection;
    }

    /**
     * Set cells width base on maximum width of each column
     */

    setColumnsWidth() {
        const dataTable = document.getElementById("data-table-wrapper-id");
        if (!dataTable || !dataTable.getElementsByTagName("table")) {
            return null;
        }
        const tables = (dataTable.getElementsByTagName("table"));
        if (tables.length !== 2) return;
        if (!tables[1].getElementsByTagName("tr")[0] || !tables[1].getElementsByTagName("tr")[0].getElementsByTagName("td")) {
            return null;
        }
        const bodyTRs = tables[1].getElementsByTagName("tr");
        const bodyTDs = tables[1].getElementsByTagName("tr")[0].getElementsByTagName("td");
        for (let td = 0; td < bodyTDs.length; td++) {

            let maxWidth = tables[0].getElementsByTagName("tr")[0].getElementsByTagName("th")[td].getBoundingClientRect().width;
            for (let tr in bodyTRs) {
                try {
                    const innerTdWidth = tables[1].getElementsByTagName("tr")[tr].getElementsByTagName("td")[td].getBoundingClientRect().width;
                    if (innerTdWidth > maxWidth) {
                        maxWidth = innerTdWidth;
                    }
                } catch (err) {
                    // empty
                }
            }

            tables[0].getElementsByTagName("tr")[0].getElementsByTagName("th")[td].width = maxWidth.toString();
            for (let tr in bodyTRs) {
                try {
                    tables[1].getElementsByTagName("tr")[tr].getElementsByTagName("td")[td].width = maxWidth.toString();
                } catch (err) {
                    // empty
                }
            }


        }
    }

    /**
     * Render pagination buttons
     * @param current
     * @param type
     * @param originalElement
     * @returns {React.ReactNode}
     */
    private itemRender(current, type, originalElement): ReactNode {
        if (type === "prev") {
            return <a><Icon name={"cif-arrow-left"} className="pagination-icon"/></a>;
        } else if (type === "next") {
            return <a><Icon name={"cif-arrow-right"} className="pagination-icon"/></a>;
        }
        return originalElement;
    }

    /**
     * generate pagination configuration
     * @returns {PaginationProps}
     */
    private loadPaginationConfig(): PaginationProps {
        const pagination: PaginationProps = {
            current: this.state.page,
            total: this.state.data.total,
            size: "small",
            showSizeChanger: false,
            itemRender: this.itemRender as any,
            pageSize: this.state.pageSize,
            showTotal: (total, range) => {
                return <div className={"pagination-description"}>
                    <Translate value={"Number of record show on page"}/>
                    <Select className={"pagesize-selector"} defaultValue="10" style={{width: 50}}
                            onChange={(value) => this.selectPageSize(value)}>
                        <Option value="10">10</Option>
                        <Option value="20">20</Option>
                        <Option value="30">30</Option>
                        <Option value="50">50</Option>
                    </Select>
                    <Translate value="(Show %s from %s)"
                               params={[this.state.page, Math.ceil(this.state.data.total / this.state.pageSize)]}/>
                </div>;
            },
            onChange: (page, pageSize) => {
                this.setState({
                    page
                }, () => this.loadData());

            }
        };
        return pagination;
    }

    /**
     * Handle table's change and set state for each parameters (filter, search)
     * @param pagination
     * @param filters
     * @param sorter
     */
    handleTableChange(pagination, filters, sorter) {
        let newState = {};
        if (sorter.columnKey !== this.state.sort) {
            newState["sort"] = sorter.columnKey;
        }
        if (sorter.order !== this.state.sort) {
            newState["order"] = sorter.order;
        }
        if (filters) {
            newState["filters"] = filters;
        }

        let data = this.state.data;
        data.page = 1;
        data.data = [];
        newState["data"] = data;
        // console.log(data);
        this.setState(newState, () => this.loadData());
    }

    /**
     * Handle search's submit
     * @param {string} column
     * @param {string} value
     */
    onSearch(value: string) {
        let searches = this.state.searches;
        let data = this.state.data;
        data.page = 1;
        data.data = [];
        if (value) {
            searches = value;
        } else {
            searches = "";
        }
        this.setState({
            searches: searches,
            page: 1,
            data,
        }, () => {
            this.loadData();
        });
    }

    /**
     *
     * @param keys
     */
    public setCustomField(keys) {
        this.customFieldTemp = {};
        this.state.definition.columns.map(field => {
            this.customFieldTemp[field.name] = false;
        });
        keys.map((c) => {
                this.customFieldTemp[c] = true;
            }
        );
    }

    public handleCustomLocal() {
        this.storeCustom(this.customFieldTemp);
        this.setState({
            customField: this.customFieldTemp,
            customizeModal: false,
        }, () => {
            setTimeout(this.setColumnsWidth, 200);
        });
    }

    public changeRecordData(index: number, newRecord: any) {
        this.setState(prevState => {
            prevState.data.data[index] = Object.assign({}, prevState.data.data[index], newRecord, false);
            return prevState;
        });
    }

    public removeRecords(ids: number[]) {
        this.setState(prevState => {
            prevState.data.data = prevState.data.data.filter((r) => {
                return !Array.includes(ids, r[this.state.definition.key || "id"]);
            });
            prevState.selectedKeys = [];
            prevState.selectedRows = [];
            return prevState;
        });
    }

    /**
     * create parser object and render table
     * @returns {any}
     */
    public render() {

        // variable to skip first column of DataTable on customize Modal
        let skipFirst = 0;
        if (!this.state.definition || !this.state.data) return <h4><Translate value={"Loading..."}/></h4>;

        if (!this.parser) {
            this.parser = new DataTableDataParser(this.state.definition);
            this.parser.bind(this);
            this.parser.onSearch(this.onSearch.bind(this));
        }

        return (
            <div id={"data-table-wrapper-id"} className="data-table-wrapper">
                <div className="data-table-header">
                    <div className="data-table-search">
                        {/*{this.props.tableDescription}*/}
                        <Icon name={"cif-magnifier"} fontsize={16} className="custom-icon"/>
                        <Input size="large"
                               onChange={(value) => {
                                   this.onSearch(value.target.value);
                               }}
                               placeholder={this.i18n._t("Search").toString()}/>
                    </div>
                    <div className="data-table-btns">
                        <Button
                            className="add-customize-btn"
                            onClick={() => {
                                this.openCustomizeModal();
                            }}>
                            <Icon name={"cif-gear-outline"} className="custom-icon"/>
                        </Button>
                        {this.props.tableButtons &&
                        this.props.tableButtons.map((button, index) => {
                            return <Button
                                key={index}
                                className="add-customize-btn dynamic-btn"
                                onClick={(query) => {
                                    button.onClick(query);
                                }}>
                                <Icon name={"cif-" + button.icon} fontsize={16} className={button.icon}/>
                            </Button>;
                        })
                        }
                    </div>
                </div>
                {this.state.customizeModal &&
                <Modal title={this.i18n._t("Customize Table").toString()}
                       visible={this.state.customizeModal}
                       customClass="customize-table-modal modal-rtl"
                       okText={this.i18n._t("save") as string}
                       cancelText={this.i18n._t("cancel") as string}
                       onOk={() => this.handleCustomLocal()}
                       onCancel={() => {
                           this.setState({customizeModal: false});
                       }}>
                    <div>
                        <Row>
                            <div className="mb-2"><Translate value={"Choose your table column from below options"}/>
                            </div>
                            <CheckboxGroup
                                onChange={(e) => {
                                    this.setCustomField(e);
                                }}
                                defaultValue={(this.state.customField) ? Object.keys(this.state.customField).filter(c => this.state.customField[c]) : null}
                                className={`${(CONFIG.DIR === "rtl") ? "checkbox-rtl" : ""}`}>
                                {this.state.definition.columns.map((key, index) => {
                                    if (key.visible) {
                                        if (skipFirst === 0) {
                                            skipFirst++;
                                            return null;
                                        }
                                        return (
                                            <Col key={index} span={12}>
                                                <Checkbox className={"checkbox-item-normal"} key={index} value={key.name}>{key.title}</Checkbox>
                                            </Col>
                                        );
                                    }
                                })
                                }
                            </CheckboxGroup>
                        </Row>
                        <Row>
                            {/*<div className="pub-switch-wrapper">*/}
                            {/*<Switch/>*/}
                            {/*<Translate value={"only show last 30 days recent websites"}/>*/}
                            {/*</div>*/}
                        </Row>
                    </div>
                </Modal>
                }
                <Table
                    rowKey={(record) => (record[this.state.definition.key])}
                    scroll={{y: 440}}
                    loading={this.state.loading}
                    columns={this.parser.parseColumns({
                        customColumns: Object.keys(this.state.customField).filter(key => this.state.customField[key]),
                        actionsFn: this.props.actionsFn,
                        customRenderColumns: this.props.customRenderColumns,
                    })}
                    dataSource={this.parser.parsData(this.state.data.data)}
                    rowSelection={this.state.definition.checkable ? this.loadSelectionConfig() : null}
                    pagination={this.props.infinite ? false : this.loadPaginationConfig()}
                    onChange={this.handleTableChange.bind(this)}
                    className="campaign-data-table"
                />
                <div className={"table-total-number"}>
                    {this.props.infinite || this.state.data.total === 0 &&
                    <div>
                        {this.state.data.total !== 0 &&
                        < Translate value={"%s results"} params={[currencyFormatter(this.state.data.total)]}/>
                        }
                        {this.state.data.total === 0 &&
                        < Translate value={"%s result"} params={[currencyFormatter(this.state.data.total)]}/>
                        }
                    </div>
                    }
                </div>
            </div>
        );
    }

}

export default DataTable;
