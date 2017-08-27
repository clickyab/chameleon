import { combineReducers, Reducer } from "redux";
import appReducer from "./../app/reducer";
import {AppStoreState} from "./../app/store";

export interface RootState {
  app: AppStoreState;
}

export default combineReducers<RootState>({
  app: appReducer
});
