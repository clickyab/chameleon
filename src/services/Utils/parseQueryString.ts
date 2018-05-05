/**
 * @file Parse Query String
 * @desc Parse Query String
 */

interface IQueryString {
    [key: string]: string;
}

/**
 * @func assetObjGen
 * @desc will generate object of each asset parameter (label and val)
 * */
export function parseQueryString(queryString: string): IQueryString {
    if (!queryString) {
        return {};
    }
    let query = {};
    queryString.split("?")[1].split("&").forEach(part => {
        let parts = part.split("=");
        if (parts.length === 2) {
            query[parts[0]] = parts[1];
        }
    });
    return query;
}
