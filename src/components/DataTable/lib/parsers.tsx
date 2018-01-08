/**
 * Data table definition and data parser
 */
import {ColumnProps} from "antd/lib/table/Column";
import {IActionsFn, IColumn, IColumnParserParams, IData, IDefinition} from "./interfaces";
import {Dropdown, Menu, Button} from "antd";
import * as React from "react";
import {TextField} from "material-ui";
import Icon from "../../Icon/index";

interface IFilterItem {
  text: string;
  value: string;
  children: any[];
}

interface IOnSearch {
  f?: (key) => void;
}

export class DataTableDataParser {
  definition: IDefinition;
  data: IData;
  columns: ColumnProps<any>[];
  customColumns: string[];
  searchFn: (column: string, value: string) => void;
  bindTable: any;

  constructor(definition: IDefinition) {
    this.definition = definition;
  }

  bind(value) {
    this.bindTable = value;
  }

  /**
   * Parse columns to Ant column
   * @returns {ColumnProps<any>[]}
   */
  public parseColumns(params: IColumnParserParams): ColumnProps<any>[] {
    if (!this.columns || params.customColumns !== this.customColumns) {
      this.customColumns = params.customColumns;
      this.columns = this.definition.columns
        .filter(c => {
          if (params.customColumns) {
            return params.customColumns.find(f => c.name === f);
          }
          return true;
        })
        .map(c => this.definitionColumnToAntColumn(c, params.customRenderColumns && params.customRenderColumns[c.data] ? params.customRenderColumns[c.data] : null))
        .filter(c => c !== null);
    }

    this.columns.push(this.createActionsColumnsDefinition(params.actionsFn));

    return this.columns;
  }

  /**
   * Parse data and add key property
   * @param data
   * @returns {any[]}
   */
  public parsData(data): any[] {
    let c = Date.now();
    return data.map(r => {
      r["key"] = c + 1;
      c++;
      return r;
    });
  }

  /**
   * Set search callback
   * @param {(column: string, value: string) => void} fn
   */
  public onSearch(fn: (column: string, value: string) => void) {
    this.searchFn = fn;
  }

  /**
   * Map filters to object of ant's filters
   * @param {string[]} filterValues
   * @returns {IFilterItem[]}
   */
  private filtersMapToObjects(filterValues: string[]): IFilterItem[] {
    return Object.keys(filterValues).map(f => ({
      text: filterValues[f],
      value: f,
      children: [],
    }));
  }

  /**
   * Map column to ant's column and set filters and search
   * @param {IColumn} source
   * @returns {ColumnProps<any>}
   */
  private definitionColumnToAntColumn(source: IColumn, customRender?: (value?: string, record?: any, index?: number) => JSX.Element): ColumnProps<any> {
    let searchValue: string = "";
    if (!source.visible) return null;

    let column: ColumnProps<any> = {};
    column.key = source.data;
    column.dataIndex = source.data;
    column.title = source.title;
    column.sorter = source.sortable;

    // TODO: handle all types
    switch (source.type) {
      case "date":
        column.render = ((t) => new Date(t).toDateString());
        break;
    }

    if (customRender) {
      column.render = customRender;
    }

    if (source.searchable && source.data === "name") {

      column.filterDropdown = (
        <div className="custom-filter-dropdown">
          <TextField name="search"
                     onChange={(e) => {
                       searchValue = (e.target as HTMLTextAreaElement).value;
                     }}
                     onKeyPress={(e) => {
                       if (e.key === "Enter") {
                         this.searchFn(source.data, searchValue);
                         column.filterDropdownVisible = false;
                         e.preventDefault();
                       }
                     }}
          />
          <Button type="primary" onClick={() => {
            this.searchFn(source.data, searchValue);
            column.filterDropdownVisible = false;
          }}>Search</Button>
        </div>
      );
      column.filterIcon = (<Icon
        name="cif-magnifier table-icon"
      /> );
    } else if (source.filter) {
      column.filters = this.filtersMapToObjects(source.filter_valid_map);
      column.filterIcon = (<Icon name="cif-filter table-icon"/>);
    }

    return column;

  }

  /**
   * Create action column object
   * @param {IActionsFn} actionsFn
   * @returns {ColumnProps<any>}
   */
  private createActionsColumnsDefinition(actionsFn?: IActionsFn): ColumnProps<any> {

    let column: ColumnProps<any> = {};
    column.key = "actions";
    column.dataIndex = "actions";
    column.title = "";
    column.sorter = false;
    column.render = (value: string, record: any, index: number) => {

      if (!record._actions) {
        return null;
      }

      const menu = (
        <Menu className="data-table-action-dropdown">
          {record._actions.split(",").map((text, i) => (
            <Menu.Item key={i}>
              <a onClick={() => {
                if (!!actionsFn && typeof actionsFn[text.trim()] === "function") {
                  actionsFn[text.trim()](value, record, index);
                }
              }}>{text}</a>
            </Menu.Item>
          ))}
        </Menu>
      );

      return <Dropdown overlay={menu} trigger={["click"]} >
        <a className="ant-dropdown-link dropdown-link" href="#">
          ...
        </a>
      </Dropdown>;
    };


    return column;
  }
}
