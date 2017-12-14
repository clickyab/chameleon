import * as moment from "moment";
moment.locale("en-us");

import Pagination from "rc-pagination/lib/locale/en_US";
import DatePicker from "antd/lib/date-picker/locale/en_US";
import TimePicker from "antd/lib/time-picker/locale/en_US";
import Calendar from "antd/lib/calendar/locale/en_US";
import I18n from "../services/i18n/index";

let i18n = I18n.getInstance();
export default {
    locale: "en-us",
    Pagination,
    DatePicker,
    TimePicker,
    Calendar,
    Table: {
        filterTitle: i18n._t("Filter menu"),
        filterConfirm: i18n._t("OK"),
        filterReset: i18n._t("Reset"),
        emptyText: i18n._t("No data"),
        selectAll: i18n._t("Select current page"),
        selectInvert: i18n._t("Invert current page"),
    },
    Modal: {
        okText: i18n._t("OK"),
        cancelText: i18n._t("Cancel"),
        justOkText: i18n._t("OK"),
    },
    Popconfirm: {
        okText: i18n._t("OK"),
        cancelText: i18n._t("Cancel"),
    },
    Transfer: {
        notFoundContent: i18n._t("Not Found"),
        searchPlaceholder: i18n._t("Search here"),
        itemUnit: i18n._t("item"),
        itemsUnit: i18n._t("items"),
    },
    Select: {
        notFoundContent: i18n._t("Not Found"),
    },
    Upload: {
        uploading: i18n._t("Uploading..."),
        removeFile: i18n._t("Remove file"),
        uploadError: i18n._t("Upload error"),
        previewFile: i18n._t("Preview file"),
    },
};