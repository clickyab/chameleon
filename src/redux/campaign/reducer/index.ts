import {handleActions} from "redux-actions";
import * as Actions from "../actions/constants";
import {CampaignStoreState} from "../store";
import IAction from "../../IActions";
import STEPS from "../../../containers/Campaign/steps";

const initialState: CampaignStoreState = {
  currentStep: STEPS.TYPE,
  selectedCampaignId: null,
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
}, initialState);
