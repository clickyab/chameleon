import * as React from "react";
import * as Cookies from "cookies-js";
import * as momentLib from "moment";
import "moment/locale/fa";
import * as momentJalaali from "moment-jalaali";
import LOCALES from "./locales";

let fa_IR = require("./../../../dictionary/fa-IR.json");

/**
 * interface of translate function option
 */
interface ITranslateOptions {
  html?: boolean;
  params?: any[];
}

export default class I18n {
  /**
   * instance of i18n
   */
    private static instance: I18n;

  /**
   * locale
   * @type {string}
   */
    private locale = LOCALES.en;

  /**
   * i18n cookie name
   * @type {string}
   */
    private CookieName: string = "LOCALE";

  /**
   * reference of momentJs object
   * @type {moment |
   * ((inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, strict?: boolean) => moment.Moment) |
   * ((inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, language?: string, strict?: boolean)
   * => moment.Moment)}
   */
    private moment = momentLib;

  /**
   * object of source dictionary
   * @type {{a: string; b: string}}
   */
    private source: object = {
      "fa-IR" : fa_IR,
    };

  /**
   * constructor
   * @desc check cookie and initial locale
   *
   * @func
   */
    private constructor() {

      // check cookie for locale
      const locale = LOCALES[Cookies.get(this.CookieName)] ? Cookies.get(this.CookieName) : LOCALES.fa;
      this.setLocale(locale);
      this.locale = locale;
      // fixme:: remove true
      if (locale === LOCALES.fa || true) {
        this.moment = momentJalaali;
        momentJalaali.loadPersian();
      }
      this.moment.locale(locale);
    }

  /**
   * get instance
   * @func
   *
   * @returns {I18n}
   */
    public static getInstance() {
      if (!I18n.instance) {
        I18n.instance = new I18n();
      }
      return I18n.instance;
    }

  /**
   * Public datetime converter
   * @desc convert timestamp or date string to locale date time
   *
   * @param {string | Date | number} date
   * @param {string} format
   * @returns {string}
   * @public
   */
    public _d(date: string | Date | number, format: string = "jYYYY/jMM/jDD"): string {
      const momentObj = momentJalaali(date);
      return momentObj.format(format);
    }

  /**
   * Public translation function
   * @desc replace input string with received string from `source` object and replace all parameters inside new string
   * by received params from `param` property of `translationOptions`
   *
   * @func
   * @param {string} value
   * @param {ITranslateOptions} translationOptions
   * @returns {string}
   * @public
   */
    public _t(value: string, translationOptions ?: ITranslateOptions): string | JSX.Element {

      // try to get new string from source or set value as new string
      let translateStr: string = this.source[this.locale] && this.source[this.locale][value] ? this.source[this.locale][value] : value;

      // if `translationOptions` is not defined, return `translate` string
      if (!translationOptions) {
        return translateStr;
      }

      // replace defined params with values
      translationOptions.params.forEach((item , index) => {
          translateStr = translateStr.replace(
              new RegExp(`%s`),
              item ? item : ""
          );
      });

      if (translationOptions.html) {
        return <span dangerouslySetInnerHTML={{__html : translateStr}} />;
      }else {
        return translateStr;
      }
    }

  /**
   * Set locale
   * @desc set locale to i18n service and store it in cookie
   *
   * @param {string} local
   */
    private setLocale(local: string) {
      if (!LOCALES[local]) {
        throw new Error(`${LOCALES[local]} is not a valid local.`);
      }

      const locale = LOCALES[local];

      this.locale = locale;
      if (locale === LOCALES.fa) {
        this.moment = momentJalaali;
        momentJalaali.loadPersian();
      }
      this.moment.locale(locale);

      const expireTimestamp: Date = new Date(Date.now() + (7 * 1000 * 60 * 60 * 24));
      Cookies.set(this.CookieName, locale, {expires : expireTimestamp});

    }

  /**
   * Set trnslation source object
   * @desc try to get json file of translation dictionary and store it in `source` object
   * @param {string} local
   */
   // TODO:: get file from server
    private setSource(local: string): void {
      if (!LOCALES[local]) {
        throw new Error(`${LOCALES[local]} is not a valid local.`);
      }
      this.source = {};
    }

}
