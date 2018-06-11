
const permMap = {
    "adCampaignCreativeStatusIdPatch": {
        "protected": true,
        "resource": "change_creative_status:superGlobal"
    },
    "adCampaignIdGet": {
        "protected": true,
        "resource": "campaign_creative:self"
    },
    "adCampaignIdDefinitionGet": {
        "protected": true,
        "resource": "campaign_creative:self"
    },
    "adChangeCreativesStatusIdPut": {
        "protected": true,
        "resource": "change_creatives_status:superGlobal"
    },
    "adCreativeRejectReasonsGet": {
        "protected": true,
        "resource": "get_creative_reject_reason:self"
    },
    "adCreativeIdGet": {
        "protected": true,
        "resource": "get_creative:self"
    },
    "adNativePost": {
        "protected": true,
        "resource": "create_creative:self"
    },
    "adNativeIdPut": {
        "protected": true,
        "resource": "edit_creative:self"
    },
    "assetBrowserGet": {
        "protected": true,
        "resource": ""
    },
    "assetCategoryGet": {
        "protected": true,
        "resource": ""
    },
    "assetIspKindGet": {
        "protected": true,
        "resource": ""
    },
    "assetManufacturersGet": {
        "protected": true,
        "resource": ""
    },
    "assetOsGet": {
        "protected": true,
        "resource": ""
    },
    "assetOsKindGet": {
        "protected": true,
        "resource": ""
    },
    "assetPlatformGet": {
        "protected": true,
        "resource": ""
    },
    "assetPlatformKindGet": {
        "protected": true,
        "resource": ""
    },
    "campaignArchiveIdPatch": {
        "protected": true,
        "resource": "archive_campaign:self"
    },
    "campaignAttributesIdPut": {
        "protected": true,
        "resource": "edit_attributes:self"
    },
    "campaignBaseIdPut": {
        "protected": true,
        "resource": "edit_campaign:self"
    },
    "campaignBudgetIdPut": {
        "protected": true,
        "resource": "edit_budget:self"
    },
    "campaignCopyIdPatch": {
        "protected": true,
        "resource": "copy_campaign:self"
    },
    "campaignCreatePost": {
        "protected": true,
        "resource": "create_campaign:self"
    },
    "campaignCreativeIdGet": {
        "protected": true,
        "resource": "get_creative:self"
    },
    "campaignDailyIdGet": {
        "protected": true,
        "resource": "daily_campaign:self"
    },
    "campaignDailyIdDefinitionGet": {
        "protected": true,
        "resource": "daily_campaign:self"
    },
    "campaignFinalizeIdPut": {
        "protected": true,
        "resource": "edit_campaign:self"
    },
    "campaignGetIdGet": {
        "protected": true,
        "resource": "get_campaign:self"
    },
    "campaignGraphAllGet": {
        "protected": true,
        "resource": "graph_campaign:self"
    },
    "campaignGraphDailyIdGet": {
        "protected": true,
        "resource": "graph_daily_campaign:self"
    },
    "campaignInventoryIdPut": {
        "protected": true,
        "resource": "edit_campaign:self"
    },
    "campaignListGet": {
        "protected": true,
        "resource": "list_campaign:self"
    },
    "campaignListDefinitionGet": {
        "protected": true,
        "resource": "list_campaign:self"
    },
    "campaignLogIdGet": {
        "protected": true,
        "resource": "log_campaign:self"
    },
    "campaignLogIdDefinitionGet": {
        "protected": true,
        "resource": "log_campaign:self"
    },
    "campaignProgressIdGet": {
        "protected": true,
        "resource": "get_campaign:self"
    },
    "campaignPublisherDetailsIdGet": {
        "protected": true,
        "resource": "campaign_publisher:self"
    },
    "campaignPublisherDetailsIdDefinitionGet": {
        "protected": true,
        "resource": "campaign_publisher:self"
    },
    "campaignStatusListGet": {
        "protected": true,
        "resource": "list_campaign:superGlobal"
    },
    "campaignStatusListDefinitionGet": {
        "protected": true,
        "resource": "list_campaign:superGlobal"
    },
    "campaignStatusIdPatch": {
        "protected": true,
        "resource": "change_campaign_status:self"
    },
    "domainChangeDomainStatusIdPut": {
        "protected": true,
        "resource": "change_domain_status:superGlobal"
    },
    "domainConfigNameGet": {
        "protected": false,
        "resource": ""
    },
    "domainCreatePost": {
        "protected": true,
        "resource": "create_domain:superGlobal"
    },
    "domainEditIdPut": {
        "protected": true,
        "resource": "edit_domain:superGlobal"
    },
    "domainGetIdGet": {
        "protected": true,
        "resource": "get_detail_domain:global"
    },
    "domainListGet": {
        "protected": true,
        "resource": "list_domain:superGlobal"
    },
    "domainListDefinitionGet": {
        "protected": true,
        "resource": "list_domain:superGlobal"
    },
    "financialGet": {
        "protected": true,
        "resource": "list_billing:self"
    },
    "financialAddPost": {
        "protected": true,
        "resource": "create_bank_snap:self"
    },
    "financialBillingGet": {
        "protected": true,
        "resource": "get_billing:self"
    },
    "financialBillingDefinitionGet": {
        "protected": true,
        "resource": "get_billing:self"
    },
    "financialChargeWhitelabelIdPost": {
        "protected": true,
        "resource": "charge_owner:superGlobal"
    },
    "financialGatewaysGet": {
        "protected": true,
        "resource": ""
    },
    "financialGatewaysPost": {
        "protected": true,
        "resource": "add_gateway:superGlobal"
    },
    "financialGatewaysIdGet": {
        "protected": true,
        "resource": ""
    },
    "financialGatewaysIdPatch": {
        "protected": true,
        "resource": "set_default_gateway:superGlobal"
    },
    "financialGatewaysIdPut": {
        "protected": true,
        "resource": "edit_gateway:superGlobal"
    },
    "financialGraphSpendGet": {
        "protected": true,
        "resource": "get_billing:self"
    },
    "financialManualChangeCashPut": {
        "protected": true,
        "resource": "manual_change_cash:global"
    },
    "financialPaymentInitPost": {
        "protected": true,
        "resource": "make_online_payment:self"
    },
    "financialPaymentReturnBankHashPost": {
        "protected": false,
        "resource": ""
    },
    "financialPaymentIdGet": {
        "protected": true,
        "resource": "get_online_transaction:self"
    },
    "inventoryAddpubIdPatch": {
        "protected": true,
        "resource": "edit_inventory:self"
    },
    "inventoryBasePublishersStatisticsGet": {
        "protected": true,
        "resource": "publisher_base_statistics:self"
    },
    "inventoryBasePublishersStatisticsDefinitionGet": {
        "protected": true,
        "resource": "publisher_base_statistics:self"
    },
    "inventoryCreatePost": {
        "protected": true,
        "resource": "create_inventory:self"
    },
    "inventoryDuplicatePost": {
        "protected": true,
        "resource": "duplicate_inventory:self"
    },
    "inventoryInventoryListGet": {
        "protected": true,
        "resource": "list_inventory:self"
    },
    "inventoryInventoryListDefinitionGet": {
        "protected": true,
        "resource": "list_inventory:self"
    },
    "inventoryInventoryIdPatch": {
        "protected": true,
        "resource": "edit_inventory:self"
    },
    "inventoryPublisherListGet": {
        "protected": true,
        "resource": "list_publisher:self"
    },
    "inventoryPublisherListDefinitionGet": {
        "protected": true,
        "resource": "list_publisher:self"
    },
    "inventoryPublisherListSingleIdGet": {
        "protected": true,
        "resource": "list_inventory:self"
    },
    "inventoryPublisherListSingleIdDefinitionGet": {
        "protected": true,
        "resource": "list_inventory:self"
    },
    "inventoryRemovepubIdPatch": {
        "protected": true,
        "resource": "edit_inventory:self"
    },
    "inventoryIdPut": {
        "protected": true,
        "resource": "edit_inventory:self"
    },
    "locationCitiesProvinceGet": {
        "protected": false,
        "resource": ""
    },
    "locationCountriesGet": {
        "protected": false,
        "resource": ""
    },
    "locationProvincesCountryIdGet": {
        "protected": false,
        "resource": ""
    },
    "uploadModuleModulePost": {
        "protected": true,
        "resource": ""
    },
    "uploadVideoIdGet": {
        "protected": true,
        "resource": ""
    },
    "userAdminPasswordChangeIdPatch": {
        "protected": true,
        "resource": "edit_user:global"
    },
    "userAvatarPut": {
        "protected": true,
        "resource": ""
    },
    "userChangeUserStatusIdPatch": {
        "protected": true,
        "resource": "change_user_status:global"
    },
    "userEmailVerifyPost": {
        "protected": false,
        "resource": ""
    },
    "userEmailVerifyResendPost": {
        "protected": false,
        "resource": ""
    },
    "userEmailVerifyTokenGet": {
        "protected": false,
        "resource": ""
    },
    "userGetIdGet": {
        "protected": true,
        "resource": "get_detail_user:global"
    },
    "userListGet": {
        "protected": true,
        "resource": "list_user:self"
    },
    "userListDefinitionGet": {
        "protected": true,
        "resource": "list_user:self"
    },
    "userLoginPost": {
        "protected": false,
        "resource": ""
    },
    "userLogoutGet": {
        "protected": true,
        "resource": ""
    },
    "userLogoutCloseotherGet": {
        "protected": true,
        "resource": ""
    },
    "userMailCheckPost": {
        "protected": false,
        "resource": ""
    },
    "userPasswordChangePut": {
        "protected": true,
        "resource": ""
    },
    "userPasswordChangeTokenPut": {
        "protected": false,
        "resource": ""
    },
    "userPasswordForgetPost": {
        "protected": false,
        "resource": ""
    },
    "userPasswordVerifyPost": {
        "protected": false,
        "resource": ""
    },
    "userPasswordVerifyTokenGet": {
        "protected": false,
        "resource": ""
    },
    "userPingGet": {
        "protected": true,
        "resource": ""
    },
    "userRegisterPost": {
        "protected": false,
        "resource": ""
    },
    "userSearchAdvertiserMailPost": {
        "protected": true,
        "resource": ""
    },
    "userSearchManagersMailPost": {
        "protected": true,
        "resource": ""
    },
    "userSearchUserMailPost": {
        "protected": true,
        "resource": ""
    },
    "userStartImpersonatePost": {
        "protected": true,
        "resource": "impersonate_user:self"
    },
    "userStorePost": {
        "protected": true,
        "resource": ""
    },
    "userUpdatePut": {
        "protected": true,
        "resource": ""
    },
    "userUpdateIdPut": {
        "protected": true,
        "resource": "edit_user:global"
    },
    "userWhitelabelAddPost": {
        "protected": true,
        "resource": "add_to_whitelabel_user:global"
    },
    "userWhitelabelRolesGet": {
        "protected": true,
        "resource": "get_assign_admin_roles:global"
    }
};
export default permMap;
