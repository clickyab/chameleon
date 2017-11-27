import {createAction} from "redux-actions";
import * as Actions from "./constants";
import STEPS from "../../../containers/Campaign/steps";
import {OrmCampaign} from "../../../api/api";


export const setCurrentStep = createAction<STEPS>(Actions.SET_CURRENT_STEP);
export const setSelectedCampaignId = createAction<STEPS>(Actions.SET_SELECT_CAMPAIGN_ID);
export const setCurrentCampaign = createAction<OrmCampaign>(Actions.SET_CURRENT_CAMPAIGN);
