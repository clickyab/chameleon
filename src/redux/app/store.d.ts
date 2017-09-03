import {UserResponseLoginOKAccount} from "../../api/api";

declare type AppStoreState = {
  user: null | UserResponseLoginOKAccount;
  isLogin: boolean;
};
