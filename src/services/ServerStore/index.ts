import {UserApi} from "../../api/api";

/**
 * @class ServerStore
 * @desc Sync local storage with user store object in server.
 * this class handle local storage and you have to use this class to store data in local storage and server user object at the same time.
 * This class is singleton and you must use getInstance() to get reference object.
 *
 * @example ServerStorage.getInstance().setItem("key", valueObj);
 *
 */
export default class ServerStore {
  /**
   * instance object
   */
  private static instance: ServerStore;

  /**
   * userApi reference
   * @type {UserApi}
   */
  private userApi = new UserApi();

  /**
   * items object
   */
  private items: { [key: string]: any; };

  /**
   * @constructor
   */
  private constructor() {
    this.items = {};
    this.loadFromLocalStorage();
  }

  /**
   * @func getInstance
   * @desc get an instance of class
   * @returns {ServerStore}
   */
  public static getInstance() {
    if (!this.instance) {
      this.instance = new ServerStore();
    }
    return this.instance;
  }

  /**
   * @func setItem
   * @desc set or add new Item to storage
   *
   * @param {string} key
   * @param value
   */
  public setItem(key: string, value: any): void {
    if (!key) {
      throw Error(`"Key is not defined`);
    }
    this.items[key] = value;
    this.syncItems();
  }

  /**
   * @func getItem
   * @desc get item from store
   *
   * @param {string} key
   * @returns {T}
   */
  public getItem<T>(key: string): T {
    if (this.items[key]) {
      return this.items[key];
    }
    return null;
  }

  /**
   * @func removeItem
   * @desc remove an item from store
   *
   * @param {string} key
   */
  public removeItem(key: string): void {
    if (this.items[key]) {
      delete this.items[key];
      localStorage.removeItem(key);
    }
    this.syncItems();
  }

  /**
   * @func flushLocalItems
   * @desc remove all items from store
   * @param {string} key
   * @param {string | object} value
   */
  public flushLocalItems(key: string, value: string | object): void {
    Object.keys(this.items).map(key => {
      localStorage.removeItem(key);
    });
    this.items = {};
  }

  /**
   * @func syncItems
   * @desc sync all items by server
   */
  public syncItems() {
    // empty
    this.userApi.userStorePost({
      payloadData: {data: this.items}
    }).then((data) => {
      console.log(data);
    });
  }

  /**
   * @func setItems
   * @desc set items to localstorage and class item object
   * @param {object} items
   */
  public setItems(items: object = {}): void {
    this.items = items;
    Object.keys(items).map(key => {
      this.setLocalStorage(key, items[key]);
    });
  }

  /**
   * @func setLocalStorage
   * @desc localsotrage.setItem wrapper
   * @param {string} key
   * @param value
   */
  private setLocalStorage(key: string, value: any) {
    if (typeof value === "object") {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  }


  /**
   * @func loadFromLocalStorage
   * @desc read localstorage items and fill class item object
   */
  private loadFromLocalStorage() {
    Object.keys(localStorage).map(key => {
      if (localStorage[key] && localStorage[key].indexOf("{") === 0) {
        try {
          this.items[key] = JSON.stringify(localStorage[key]);
        } catch (e) {
          this.items[key] = localStorage[key];
        }
      } else {
        this.items[key] = localStorage[key];
      }
    });
  }

}
