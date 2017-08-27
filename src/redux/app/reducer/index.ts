import {handleActions} from "redux-actions";
import * as Actions from "../actions/constants";
import {AppStoreState} from "../store";
import {UserResponseLoginOKAccount} from "../../../api/api";
import IAction from "../../IActions";

const initialState: AppStoreState = {
  isLogin: false,
  user: null,
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
}, initialState);
