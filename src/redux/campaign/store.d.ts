import STEPS from "../../containers/Campaign/steps";

declare type CampaignStoreState = {
  currentStep: STEPS;
  selectedCampaignId: number | null;
};
