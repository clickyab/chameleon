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
import {Table} from "antd";
import {DataTableDataParser} from "./lib/parsers";
import {IData, IDefinition} from "./lib/interfaces";
import {PaginationProps} from "antd/lib/pagination";
import "./style.less";
import Icon from "../Icon/index";
import {ReactNode} from "react";


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
}

class DataTable extends React.Component<IProps, IState> {
  parser;

  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: true,
      page: 1,
      filters: {},
      searches: {}
    };
  }

  /**
   * Load data
   */
  componentDidMount() {
    this.loadData();
  }

  /**
   * Store table definition in local storage
   * @param {IDefinition} definition
   */
  storeDefinition(definition: IDefinition) {
    localStorage.setItem(`TABALE_DEFINITION_${this.props.name}`, JSON.stringify(definition));
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
      let def = this.restoreDefinition();
      if (def && def.hash === data.hash) {
        this.setState({
          data,
          definition: def,
          loading: false,
        });
      } else {
        this.storeDefinition(null);
        this.loadDefinition()
          .then((def) => {
            this.setState({
              loading: false,
              data,
              definition: def,
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
      onChange: (selectedRowKeys, selectedRows) => {
        if (this.props.onSelectRow) {

          let keys = selectedRowKeys;

          if (this.state.definition.key) {
            keys = selectedRows.map((r) => (r[this.state.definition.key]));
          }

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
    console.log(pagination, filters, sorter);
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
    this.setState(newState, () => this.loadData());
  }

  /**
   * Handle search's submit
   * @param {string} column
   * @param {string} value
   */
  onSearch(column: string, value: string) {
    let searches = this.state.searches;
    if (value) {
      searches[column] = value;
    } else {
      delete searches[column];
    }
    this.setState({
      searches: searches,
    }, () => {
      this.loadData();
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
      <Table
        loading={this.state.loading}
        columns={this.parser.parseColumns()}
        dataSource={this.parser.parsData(this.state.data.data)}
        rowSelection={this.state.definition.checkable ? this.loadSelectionConfig() : null}
        pagination={this.loadPaginationConfig()}
        onChange={this.handleTableChange.bind(this)}
        className="campaign-data-table"
      />
    );
  }

}

export default DataTable;
