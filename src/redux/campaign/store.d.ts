import STEPS from "../../containers/Campaign/steps";
import {OrmCampaign} from "../../api/api";

declare type CampaignStoreState = {
  currentStep: STEPS;
  selectedCampaignId: number | null;
  currentCampaign: OrmCampaign | null;
};
