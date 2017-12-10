export interface IColumn {
  data: string;
  title: string;
  name: string;
  searchable: boolean;
  sortable: boolean;
  filter: boolean;
  type: "curency" | "date" | "time" | "datetime" | "url" | "email" | "campaign" | "action";
  filter_valid_map?: string[];
  visible: boolean;
}

export interface IDefinition {
  hash: string;
  checkable: boolean;
  multiselect: boolean;
  key: string;
  columns: IColumn[];
}


export interface IData {
  data: object[];
  hash: string;
  page: number;
  per_page: number;
  total: number;
}


export interface IColumnParserParams {
  customColumns?: string[];
  customRenderColumns?: { [key: string]: (value?: string, record?: any, index?: number) => JSX.Element };
  actionsFn?: IActionsFn;
}


export interface IActionsFn {
  [key: string]: (value?: string, record?: any, index?: number) => void;
}
