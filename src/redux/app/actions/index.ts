import {createAction} from "redux-actions";
import * as Actions from "./constants";
import {UserResponseLoginOKAccount} from "../../../api/api";

export const setUser = createAction<UserResponseLoginOKAccount>(Actions.SET_USER);
export const unsetUser = createAction(Actions.UNSET_USER);

export const setIsLogin = createAction(Actions.SET_IS_LOGIN);
export const unsetIsLogin = createAction(Actions.UNSET_IS_LOGIN);
