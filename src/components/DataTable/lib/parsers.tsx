/**
 * Data table definition and data parser
 */
import {ColumnProps} from "antd/lib/table/Column";
import {IColumn, IData, IDefinition} from "./interfaces";
import {Input, Button} from "antd";
import * as React from "react";

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
  searchFn: (column: string, value: string) => void;

  constructor(definition: IDefinition) {
    this.definition = definition;
  }

  /**
   * Parse columns to Ant column
   * @returns {ColumnProps<any>[]}
   */
  public parseColumns(): ColumnProps<any>[] {
    if (!this.columns) {

      this.columns = this.definition.columns
        .map(c => this.definitionColumnToAntColumn(c))
        .filter(c => c !== null);
    }
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
  private definitionColumnToAntColumn(source: IColumn): ColumnProps<any> {
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
        // column.render = ((t) => new Date(t).toDateString());
        break;
    }

    if (source.searchable && source.data === "name") {

      column.filterDropdown = (
        <div className="custom-filter-dropdown">
          <Input
            onChange={(e) => {
              searchValue = e.target.value;
            }}
            onPressEnter={(e) => {
              this.searchFn(source.data, searchValue);
            }}
          />
          <Button type="primary" onClick={() => {
            this.searchFn(source.data, searchValue);
          }}>Search</Button>
        </div>
      );
    } else if (source.filter) {
      column.filters = this.filtersMapToObjects(source.filter_valid_map);
    }


    return column;

  }
}
