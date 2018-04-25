/**
 * @func currencyFormatter
 * @desc will format currency(split every 3 digits with ",")
 * */
export const currencyFormatter = (val) => {
    let parts = val.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};
