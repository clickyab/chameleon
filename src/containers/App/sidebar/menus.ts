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
    }
];

export default MENUS;
