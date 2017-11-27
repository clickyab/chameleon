import {handleActions} from "redux-actions";
import * as Actions from "../actions/constants";
import {AppStoreState} from "../store";
import {UserResponseLoginOKAccount} from "../../../api/api";
import IAction from "../../IActions";
import AAA from "../../../services/AAA/index";

const initialState: AppStoreState = {
  isLogin: !!AAA.getInstance().getToken(),
  user: null,
  breadcrumb: [],
};


export default handleActions<AppStoreState, any>({
  [Actions.SET_USER]: (state, action: IAction<UserResponseLoginOKAccount>) => {
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
    if (action.payload.parent === null) {
      return {
        ...state,
        breadcrumb: [action.payload]
      };
    }
    let indexOfParent = state.breadcrumb.findIndex(b => (b.name === action.payload.parent));
    let breadcrumbs = state.breadcrumb;
    breadcrumbs.splice(indexOfParent + 1);
    return {
      ...state,
      breadcrumb: [...breadcrumbs, action.payload],
    };
  },
}, initialState);
