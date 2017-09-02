import {createAction} from "redux-actions";
import * as Actions from "./constants";
import STEPS from "../../../containers/Campaign/steps";


export const setCurrentStep = createAction<STEPS>(Actions.SET_CURRENT_STEP);
export const setSelectedCampaignId = createAction<STEPS>(Actions.SET_SELECT_CAMPAIGN_ID);
