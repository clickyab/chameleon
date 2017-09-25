import {handleActions} from "redux-actions";
import * as Actions from "../actions/constants";
import {AppStoreState} from "../store";
import {UserResponseLoginOKAccount} from "../../../api/api";
import IAction from "../../IActions";
import AAA from "../../../services/AAA/index";

const initialState: AppStoreState = {
  isLogin: !!AAA.getInstance().getToken(),
  user: null,
  breadcrumb: "",
  profileProgress: 95
};


export default handleActions<AppStoreState, any>({
  [Actions.SET_USER]: (state, action: IAction<UserResponseLoginOKAccount>) => {
    console.log(action, {
      ...state,
      user: action.payload,
    });
    return {
      ...state,
      user: action.payload,
    };
  },

  [Actions.UNSET_USER]: (state) => {
    return {
      ...state,
      user: null,
    };
  },

  [Actions.SET_IS_LOGIN]: (state) => {
    return {
      ...state,
      isLogin: true,
    };
  },

  [Actions.UNSET_IS_LOGIN]: (state, action) => {
    return {
      ...state,
      isLogin: false,
    };
  },

  [Actions.SET_BREADCRUMB]: (state, action) => {
    return {
      ...state,
      breadcrumb: action.payload
    };
  },
  [Actions.UNSET_BREADCRUMB]: (state) => {
    return {
      ...state,
      breadcrumb: ""
    };
  },
}, initialState);
