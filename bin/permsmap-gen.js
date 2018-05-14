const request = require("request");
const fs = require("fs");
const tsfmt = require("typescript-formatter");
const SRC_DIR = "./src/api";
const JSON_URL = "http://staging.crab.clickyab.ae/api/misc/swagger/index.json";
const FILE_PATH = `${SRC_DIR}/permMap.ts`;

function createName(url, method) {
    let words = url.replace(/[{}]/ig, "_").replace(/\//ig, "_").replace(/-/ig, "_");
    words = words.split("_").filter(w => !!w);
    words.push(method);
    words = words.map((w, i) => {
        if (i === 0 ) return w.toString().toLowerCase();
        w = w.substring(0,1).toUpperCase() + w.substring(1).toLowerCase();
        return w;
    });
    return words.join("");
}


request.get(JSON_URL, (err, res, body) => {

    if (err) {
        console.error("Error in get API json!");
        return;
    }

    const obj = JSON.parse(body);
    const permMaps = {};
    const paths = Object.keys(obj.paths);

    paths.forEach(path => {
        const pathObj = obj.paths[path];
        const methods = Object.keys(pathObj);

        methods.forEach(method => {
            permMaps[createName(path, method)] = obj.paths[path][method].security;
        });
    });
    const fileContent = `
        const permMap = ${JSON.stringify(permMaps, null, '\t')};
        export default permMap;
    `;
    fs.writeFileSync(FILE_PATH, fileContent);


    tsfmt
        .processFiles([FILE_PATH], {
            dryRun: true,
            replace: false,
            verify: false,
            tsconfig: true,
            tslint: true,
            editorconfig: true,
            tsfmt: true
        })
        .then(result => {
            fs.writeFileSync(FILE_PATH, result[FILE_PATH].dest);
            console.log("Job done ¯\\_(ツ)_/¯");
        });


});
