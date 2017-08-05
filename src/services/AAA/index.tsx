/// <reference path = "./../index.tsx" />
/**
 * @file AAA Service
 * @author Ehsan Hosseini
 * @desc User status manager and handle user token and cookies.
 */

import * as Cookie from 'cookies-js';

namespace Services {
  /**
   * AAA service
   * AAA is a singleton class to manage user status and authorization
   * @class
   */
  export class AAA {
    /**
     * @prop instance
     * @desc An instance of AAA.
     * @private
     * @static
     * @type {Services.AAA}
     * @memberof Services.AAA
     */
    private static instance : Services.AAA;

    /**
     * Declare Cookie name
     * @type {string}
     */
    private CookieName: string = 'USER_TOKEN';


    /**
     * @prop token
     * @desc user token
     * @private
     * @type {string}
     * @memberof Services.AAA
     */
    private token: string | null = null;

    /**
     * @constructor
     */
    private constructor() {
      /* empty */
    }

    /**
     * @func getInstance
     * @desc The class constructor is private. This method creates an instance of AAA once
     * and returns the instance every time you call it
     * @returns {Services.AAA}
     */
    public static getInstance(){
      if (!this.instance){
        this.instance = new Services.AAA();
      }
      return this.instance;
    }

    /**
     * Set session token and cookie
     *
     * @func
     * @memberof Services.AAA
     *
     * @param {string}    token         session token
     * @param {boolean}   remember      set cookie expire time or set session cookie
     * @param {Date}      expireTime    define expire date time (default is 7 day)
     */
    public setToken(token: string, remember: boolean = true, expireTime: Date):void {
      let cookieOptions:any = {};

      // Check for set time for cookie
      if (remember){

        // define expire from argument or default
        const expireTimestamp : Date = expireTime || new Date(Date.now() + (7 * 1000 * 60 * 60 * 24));
        cookieOptions.expires = expireTimestamp;
      }

      // set cookie
      Cookie.set(this.CookieName, token, cookieOptions);

      // set token in class
      this.token = token;
    }

    /**
     * Unset session token and remove token form class and remove cookie
     *
     * @func
     * @memberof Services.AAA
     */
    public unsetToken():void {
      // remove cookie
      Cookie.set(this.CookieName);

      // unset token in class
      this.token = null;
    }

    /**
     *  Get session token
     *  @func
     *
     * @returns {string | null}
     */
    public getToken(): string | null{
      return this.token;
    }
  }
}
