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
import {Table, Row, Checkbox, Col, Switch, Button} from "antd";
import {DataTableDataParser} from "./lib/parsers";
import {IColumn, IData, IDefinition} from "./lib/interfaces";
import {PaginationProps} from "antd/lib/pagination";
import "./style.less";
import Icon from "../Icon/index";
import {ReactNode} from "react";
import Modal from "../../components/Modal/index";
import Translate from "../i18n/Translate/index";
import I18n from "../../services/i18n/index";
import CONFIG from "../../constants/config";

const CheckboxGroup = Checkbox.Group;

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
   * @params name - callback function for on selected rows changed
   */
  onSelectRow?: (rows: string[], selectedRows: any[]) => void;

  infinite?: boolean;

  tableDescription?: JSX.Element;
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
  searches?: {};
  loading: boolean;
  selectedRows: object[];
  selectedKeys: string[];
  customizeModal: boolean;
  customField: object;
}

class DataTable extends React.Component<IProps, IState> {
  parser;
  infiniteLoader: boolean = false;
  customFieldTemp: object = {};

  private i18n = I18n.getInstance();

  constructor(props: IProps) {
    super(props);
    const customFieldsObject = localStorage.getItem(`TABLE_CUSTOM_${this.props.name}`);
    let customField = customFieldsObject ? JSON.parse(customFieldsObject) : {};
    this.state = {
      selectedRows: [],
      selectedKeys: [],
      loading: true,
      page: 1,
      filters: {},
      searches: {},
      customizeModal: false,
      customField: customField,
    };
  }

  /**
   * Load data
   */
  componentDidMount() {
    this.loadData();
  }

  private openCustomizeModal() {
    this.setState(
      {customizeModal: true}
    );
  }

  /**
   * Store table definition in local storage
   * @param {IDefinition} definition
   */
  storeDefinition(definition: IDefinition) {
    localStorage.setItem(`TABLE_DEFINITION_${this.props.name}`, JSON.stringify(definition));
  }

  storeCustom(customField) {
    localStorage.setItem(`TABLE_CUSTOM_${this.props.name}`, JSON.stringify(customField));
  }

  /**
   * Try to load definition from local storage
   * @returns {IDefinition}
   */
  restoreDefinition(): IDefinition | null {
    const def = localStorage.getItem(`TABALE_DEFINITION_${this.props.name}`);
    if (def) {
      return JSON.parse(def);
    } else {
      return null;
    }
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

  addScrollListener() {
    if (this.state.page === 1) {
      setTimeout(() => {
        const tableContent = document.querySelector(".ant-table-body");
        tableContent.addEventListener("scroll", (event) => {
          let maxScroll = event.target["scrollHeight"] - event.target["clientHeight"];
          let currentScroll = event.target["scrollTop"];
          if (currentScroll === maxScroll) {
            // load more data
            if (!this.infiniteLoader) {
              this.infiniteLoader = true;
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
  loadData() {

    let config = {
      p: this.state.page,
      loading: true,
    };

    if (this.state.sort) {
      config["sort"] = `${this.state.sort}:${this.state.order}`;
    }

    if (this.state.filters) {
      Object.keys(this.state.filters).map((f) => {
        config[f] = this.state.filters[f].join(",");
      });
    }

    if (this.state.searches) {
      Object.keys(this.state.searches).map((s) => {
        config[s] = this.state.searches[s];
      });
    }

    this.props.dataFn(config).then((data: IData) => {
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
        });
        this.addScrollListener();
        this.infiniteLoader = false;
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
            });
            this.addScrollListener();
            this.infiniteLoader = false;
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
   * Generate table pagination config
   * @returns {PaginationProps}
   */

  itemRender(current, type, originalElement): ReactNode {
    if (type === "prev") {
      return <a><Icon name={"cif-arrow-left"} className="pagination-icon"/></a>;
    } else if (type === "next") {
      return <a><Icon name={"cif-arrow-right"} className="pagination-icon"/></a>;
    }
    return originalElement;
  }

  loadPaginationConfig(): PaginationProps {
    const pagination: PaginationProps = {
      current: this.state.page,
      total: this.state.data.total,
      size: "small",
      showSizeChanger: true,
      itemRender: this.itemRender as any,
      showTotal: (total, range) => {
        return <div>{total}</div>;
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
  onSearch(column: string, value: string) {
    let searches = this.state.searches;
    let data = this.state.data;
    data.page = 1;
    data.data = [];
    if (value) {
      searches[column] = value;
    } else {
      delete searches[column];
    }
    this.setState({
      searches: searches,
      data,
    }, () => {
      this.loadData();
    });
  }

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
    });
  }

  /**
   * create parser object and render table
   * @returns {any}
   */
  public render() {

    if (!this.state.definition || !this.state.data) return null;

    if (!this.parser) {
      this.parser = new DataTableDataParser(this.state.definition);
      this.parser.bind(this);
      this.parser.onSearch(this.onSearch.bind(this));
    }

    return (
      <div className="data-table-wrapper">
        <div className="data-table-description">
          {this.props.tableDescription}
          <Button
            className="add-customize-btn"
            onClick={() => {
              this.openCustomizeModal();
            }}>
            <Icon name={"cif-gear-outline"} className="custom-icon"/>
            <Translate value="Customize table"/>
          </Button>
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
              <div className="mb-2"><Translate value={"Choose your table column from below options"}/></div>
              <CheckboxGroup
                onChange={(e) => {
                  this.setCustomField(e);
                }}
                defaultValue={(this.state.customField) ? Object.keys(this.state.customField).filter(c => this.state.customField[c]) : null}
                className={`${(CONFIG.DIR === "rtl") ? "checkbox-rtl" : ""}`}>
                {this.state.definition.columns.map((key, index) => {
                  if (key.visible) {
                    return (
                      <Col key={index} span={12}>
                        <Checkbox key={index} value={key.name}>{key.title}</Checkbox>
                      </Col>
                    );
                  }
                })
                }
              </CheckboxGroup>
            </Row>
            <Row>
              <div className="pub-switch-wrapper">
                <Switch/>
                <Translate value={"only show last 30 days recent websites"}/>
              </div>
            </Row>
          </div>
        </Modal>
        }
        <Table
          rowKey={(record) => (record[this.state.definition.key])}
          scroll={{y: 440}}
          loading={this.state.loading}
          columns={this.parser.parseColumns(Object.keys(this.state.customField).filter(key => this.state.customField[key]))}
          dataSource={this.parser.parsData(this.state.data.data)}
          rowSelection={this.state.definition.checkable ? this.loadSelectionConfig() : null}
          pagination={this.props.infinite ? false : this.loadPaginationConfig()}
          onChange={this.handleTableChange.bind(this)}
          className="campaign-data-table"
        />
        <div className="table-total-number">
          <Icon name={"cif-target"}/>
          <Translate value={"_{totalResult} result"} params={{totalResult: this.state.data.total}}/>
        </div>
      </div>
    );
  }

}

export default DataTable;
