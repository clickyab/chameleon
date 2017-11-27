import {handleActions} from "redux-actions";
import * as Actions from "../actions/constants";
import {CampaignStoreState} from "../store";
import IAction from "../../IActions";
import STEPS from "../../../containers/Campaign/steps";
import {OrmCampaign} from "../../../api/api";

const initialState: CampaignStoreState = {
  currentStep: STEPS.TYPE,
  selectedCampaignId: null,
  currentCampaign: null,
};


export default handleActions<CampaignStoreState, any>({
  [Actions.SET_CURRENT_STEP]: (state, action: IAction<STEPS>) => {
    return {
      ...state,
      currentStep: action.payload,
    };
  },
  [Actions.SET_SELECT_CAMPAIGN_ID]: (state, action: IAction<number | null>) => {
    return {
      ...state,
      selectedCampaignId: action.payload,
    };
  },
  [Actions.SET_CURRENT_CAMPAIGN]: (state, action: IAction<OrmCampaign | null>) => {
    return {
      ...state,
      currentCampaign: action.payload,
    };
  },
}, initialState);
