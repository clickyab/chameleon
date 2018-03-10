import {UserResponseLoginOKAccount} from "../../api/api";

export interface IBreadCrumbItem {
  name: string;
  title: string;
  parent: string | null;
}

declare type AppStoreState = {
  user: null | UserResponseLoginOKAccount;
  isLogin: boolean;
  breadcrumb: IBreadCrumbItem[];
  menuCollapse: boolean;
};
