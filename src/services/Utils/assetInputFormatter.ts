/**
 * @file asset input formatter
 * @desc Contain functions that convert/Format payloads off assets
 */

interface AssetObjectContent {
    label?: string;
    val?: string;
}

/**
 * @func assetObjGen
 * @desc will generate object of each asset parameter (label and val)
 * */
export const assetObjGen = (label: string, val: string): AssetObjectContent => {
    let object: AssetObjectContent = {};
    if (val === undefined || val === null) {
        return null ;
    } else {
        object.label = label;
        object.val = val;
        return object;
    }
};
/**
 * @func assetPushObjArray
 * @desc will push generated asset's object to array of the asset
 * */
export const assetPushObjArray = (...args: AssetObjectContent[]): AssetObjectContent[] =>  {
    let asset = [];
    let nullCount = 0;
    for (let i = 0 ; i < args.length ; i++) {
        if (args[i] === null || args[i] === undefined) {
            nullCount++;
        } else {
            asset.push(args[i]);
        }
    }
    if (nullCount === args.length) {
        return null ;
    } else {
        return asset;
    }
};
