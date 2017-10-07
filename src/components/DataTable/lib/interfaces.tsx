export interface IColumn {
  data: string;
  title: string;
  name: string;
  searchable: true;
  sortable: true;
  filter: true;
  type: "curency" | "date" | "time" | "datetime" | "url" | "email" | "campaign";
  filter_valid_map: string[];
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
