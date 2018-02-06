/**
 * @desc store any localStorage change and send it to the API , also used to set localStorage at initial point
 * @type {{object}}
 */
let storageObj: object = {} ;

/**
 * @func localStorageAdd
 * @desc localStorage wrapper that set new item and send change to API
 * @param name  of the item
 * @param value of the item
 */
export function localStorageAdd(name, value) {
    if (value !== null && typeof value === "object") {
        localStorage.setItem(name, JSON.stringify(value));
        storageObj[name] =  JSON.stringify(value);
    }
    else {
        localStorage.setItem(name, value);
        storageObj[name] = value;
    }
    // ToDo send object to API
}
/**
 * @func localStorageRemove
 * @desc localStorage wrapper that remove new item and send change to API
 * @param name  of the item
 */
export function localStorageRemove(name) {
    localStorage.removeItem(name);
    delete storageObj[name] ;
    // ToDo send object to API
}
/**
 * @func initialLocalStorage
 * @desc set localStorage at initial point of application
 */
export function initialLocalStorage() {
    // ToDo get object from API
    for (let key in storageObj) {
        if (!storageObj.hasOwnProperty(key)) continue;
        if (storageObj[key] !== null && typeof storageObj[key] === "object") {
            localStorage.setItem(key, JSON.stringify(storageObj[key]));
        }
        else {
            localStorage.setItem(key, storageObj[key]);
        }
    }
}