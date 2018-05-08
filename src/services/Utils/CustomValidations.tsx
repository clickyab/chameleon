/**
 * @file Custom validation
 * @desc Validation functions will be implemented here
 */
import I18n from "../i18n/index";
const i18n = I18n.getInstance();

/**
 * @func validateID
 * @desc National code validation with ant Design Api standard (no need to pass params automatically will be bind)
 */
export const validateID = (rule, value , callback) => {
  if (value.length === 10) {
    if (value === "1111111111" ||
      value === "0000000000" ||
      value === "2222222222" ||
      value === "3333333333" ||
      value === "4444444444" ||
      value === "5555555555" ||
      value === "6666666666" ||
      value === "7777777777" ||
      value === "8888888888" ||
      value === "9999999999") {
      callback("error");
      return false;
    }
    let c = parseInt(value.charAt(9));
    let n = parseInt(value.charAt(0)) * 10 +
      parseInt(value.charAt(1)) * 9 +
      parseInt(value.charAt(2)) * 8 +
      parseInt(value.charAt(3)) * 7 +
      parseInt(value.charAt(4)) * 6 +
      parseInt(value.charAt(5)) * 5 +
      parseInt(value.charAt(6)) * 4 +
      parseInt(value.charAt(7)) * 3 +
      parseInt(value.charAt(8)) * 2;
    let r = n - Math.floor(n / 11) * 11;
    if ((r === 0 && r === c) || (r === 1 && c === 1) || (r > 1 && c === 11 - r)) {
      callback();
      return true;
    }
    else {
      callback("error");
      return false;
    }
  }
  else {
    if (value.length > 0) {
      callback("error");
    }
    else {
      callback();
    }
  }
};

/**
 * @func rangeCheck
 * @desc rangeCheck checks if value in form is greater than minimum(if defined on rule object inside getFielddecarator) and less than maximum.
 * minimum and maximum can be used separately or together
 */
export const rangeCheck = (rule, value , callback) => {
    if (rule.minimum && rule.maximum) {
        if ((value >= rule.minimum && value <= rule.maximum )|| value === "") {
            callback();
            return true;
        }
        callback("error");
        return false;
    }
    if (rule.minimum) {
        if (value >= rule.minimum || value === "") {
            callback();
            return true;
        }
        callback("error");
        return false;
    }
    if (rule.maximum) {
        if (value <= rule.maximum || value === "") {
            callback();
            return true;
        }
        callback("error");
        return false;
    }
    throw new Error("minimum or maximum should be defined for rangeCheck validation");
};

export const isValidDomain = (rule, value , callback) => {
    let domainRegx = /^[a-z0-9\.\-]+$/gi;
    if (domainRegx.test(value)) {
        callback();
    } else {
      if (value.length === 0) {
         callback();
      }else {
          callback("error");
      }
    }
};
