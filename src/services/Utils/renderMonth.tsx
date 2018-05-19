/**
 * @func renderMonth
 * @desc will render appropriate month
 * */
import I18n from "../i18n/index";
const i18n = I18n.getInstance();

export const renderMonth = (date, isGregorian) => {
    let monthName;
    if (!isGregorian) {
        let month = date.jMonth();
        switch (month) {
            case 0:
                monthName = i18n._t("farvardin");
                break;
            case 1:
                monthName = i18n._t("ordibehesht");
                break;
            case 2:
                monthName = i18n._t("khordad");
                break;
            case 3:
                monthName = i18n._t("tir");
                break;
            case 4:
                monthName = i18n._t("mordad");
                break;
            case 5:
                monthName = i18n._t("shahrivar");
                break;
            case 6:
                monthName = i18n._t("mehr");
                break;
            case 7:
                monthName = i18n._t("aban");
                break;
            case 8:
                monthName = i18n._t("azar");
                break;
            case 9:
                monthName = i18n._t("dey");
                break;
            case 10:
                monthName = i18n._t("bahman");
                break;
            case 11:
                monthName = i18n._t("esfand");
                break;
        }
    }
    else {
        let month = date.month();
        switch (month) {
            case 0:
                monthName = i18n._t("january");
                break;
            case 1:
                monthName = i18n._t("february");
                break;
            case 2:
                monthName = i18n._t("march");
                break;
            case 3:
                monthName = i18n._t("april");
                break;
            case 4:
                monthName = i18n._t("may");
                break;
            case 5:
                monthName = i18n._t("june");
                break;
            case 6:
                monthName = i18n._t("july");
                break;
            case 7:
                monthName = i18n._t("august");
                break;
            case 8:
                monthName = i18n._t("september");
                break;
            case 9:
                monthName = i18n._t("october");
                break;
            case 10:
                monthName = i18n._t("november");
                break;
            case 11:
                monthName = i18n._t("december");
                break;
        }
    }
    return monthName;
};
