import {combineReducers, Reducer} from "redux";
import appReducer from "./../app/reducer";
import {AppStoreState} from "./../app/store";
import campaignReducer from "./../campaign/reducer";
import {CampaignStoreState} from "../campaign/store";

export interface RootState {
  app: AppStoreState;
  campaign: CampaignStoreState;
}

export default combineReducers<RootState>({
  app: appReducer,
  campaign: campaignReducer,
});
