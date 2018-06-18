import I18n from "../../../services/i18n/index";

const i18n = I18n.getInstance();
const MENUS = [
    {
        key: "dashboard",
        className: "",
        icon: "cif-dashboard",
        name: i18n._t("Dashboard"),
        to: "/",
        perms: []
    },
    {
        key: "campaigns",
        className: "",
        icon: "cif-campaign",
        name: i18n._t("Campaigns"),
        to: "/my/campaign/list",
        perms: ["list_campaign:self"]
    },
    {
        key: "explore",
        className: "",
        icon: "cif-inventory",
        name: i18n._t("explore"),
        to: "/explore",
        perms: ["list_publisher:self"]
    },
    {
        key: "reports",
        className: "",
        icon: "cif-analytics",
        name: i18n._t("Reports"),
        to: "/reports",
        perms: []
    },
    {
        key: "user-management",
        className: "",
        icon: "cif-usermanager",
        name: i18n._t("User List"),
        to: "/backoffice/user/list",
        perms: ["list_user:self"]
    },
    {
        key: "approvereject",
        className: "",
        icon: "cif-approvereject",
        name: i18n._t("Check creative"),
        to: "/backoffice/approveReject",
        perms: ["change_creatives_status:superGlobal"]
    },
    {
        key: "whitelabel-list",
        className: "",
        icon: "cif-wlmanager",
        name: i18n._t("Whitelabel list"),
        to: "/backoffice/whitelabel/list",
        perms: ["list_domain:superGlobal"]
    },
    {
        key: "billing",
        className: "",
        icon: "cif-billingsec",
        name: i18n._t("Billing"),
        to: "/backoffice/whitelabel/financial/report/billing",
        perms: ["get_billing:self"]
    },
];

export default MENUS;
