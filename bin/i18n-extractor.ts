/**
 * @file I18n Text Extractor
 * This is class to extract texts and phrases from ts and tsx files and create json and po file.
 * It's an backward po file compatible. It's mean when find a text that exist in po file, this tool use that
 * translated phrase as value of that text.
 *
 * This tools use some input variable to define important parameters:
 * @param {string} --out : output directory
 * @param {string} --src : directory of source files to check and extract
 * @param {string} --lang : languages that the po file must generate default with cama separate (en-us)
 *
 * Example of usage:
 * node i18n-extractor.js --out=languages --src=./src --lang=fa-ir,en-us
 *
 */
import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import * as json2po from "json2po";
import * as po2json from "po2json";

declare let Promise: any;

class I18nExtractor {

  /**
   * source path and define default value
   * @type {string}
   */
  private SOURCE_PATH = `${process.cwd()}/src/**/*.{tsx,ts}`;

  /**
   * output path and define default value
   * @type {string}
   */
  private OUTPUT_PATH = `${process.cwd()}/dictionary`;

  /**
   * regex for extract FUNCTION and TAG use of translation
   * @type {{FUNCTION: RegExp; TAG: RegExp}}
   */
  private PATTERNS = {
    FUNCTION: /_t\(["](.*?)["]\)?/img,
    TAG: /<Translate[\s\S]*?value=.*["](.*?)["][\s\S]*?>/img,
  };

  /**
   * Main function to run extractor
   * @returns {Promise<void>}
   */
  public async run(): Promise<void> {
    console.log("Start I18n Text Extractor");
    this.setArgs();
    const keys: string[] = await this.findKeys();

    // check and create language output files
    const langsArg = this.getArgumentsValue("lang");
    let langs = ["en-us"];
    if (langsArg) {
      langs = langsArg.split(",");
    }
    langs.forEach((lang) => {
      this.loadDictionary(lang)
        .then(dic => {
          const newDic = this.syncDic(dic, keys);
          this.storeDic(lang, newDic);
          this.generatePoFiles(lang, newDic);
        });
    });
  }

  /**
   * Try to load last dictionary from output path base in language.
   * It try to load po file
   * @param {string} lang
   * @returns {Promise<any>}
   */
  public async loadDictionary(lang: string): Promise<any> {
    const path = this.OUTPUT_PATH + "/" + lang + ".po";
    if (fs.existsSync(path)) {
      const data = po2json.parseFileSync(path);
      try {
        return data;
      } catch (err) {
        throw err;
      }
    } else {
      return {};
    }
  }

  /**
   * Check output path and create path if it does not exist
   * @returns {Promise<any>}
   */
  private async checkOutPath(): Promise<any> {
    return await new Promise(res => {
      const targetDir = this.OUTPUT_PATH;
      targetDir.split("/").reduce((parentDir, childDir) => {
        const curDir = path.resolve(parentDir, childDir);
        console.log(parentDir, childDir, curDir.split("/").length, targetDir.split("/").length);
        if (!fs.existsSync(curDir)) {
          fs.mkdirSync(curDir);
        }
        res(true);
        return curDir;
      }, "");
    });
  }

  /**
   * generate po file base on language and loaded dictionary and extracted texts
   * @param {string} lang
   * @param {Object} json
   * @returns {Promise<any>}
   */
  private async generatePoFiles(lang: string, json: object): Promise<any> {
    await this.checkOutPath();
    const result = json2po(JSON.stringify(json), {Language: lang});
    const path = this.OUTPUT_PATH + "/" + lang + ".pot";
    console.log(path);
    fs.writeFileSync(path, result);
  }

  /**
   * overwrite default params by command line inputs
   */
  private setArgs() {
    if (this.getArgumentsValue("out")) {
      this.OUTPUT_PATH = path.join(this.getArgumentsValue("out"));
    }
    if (this.getArgumentsValue("src")) {
      this.SOURCE_PATH = this.getArgumentsValue("src");
    }
  }

  /**
   * try to pars and return value of each varibale from command line arguments
   * @param {string} name
   * @returns {string}
   */
  private getArgumentsValue(name: string): string | null {
    const args = process.argv;
    let value = null;
    args.forEach((item) => {
      if (item.indexOf(`--${name}=`) > -1) {
        value = item.split("=")[1];
      }
    });
    return value;
  }

  /**
   * sync dictionary with new found texts
   * @param {Object} source
   * @param {string[]} keys
   * @returns {Object}
   */
  private syncDic(source: object, keys: string[]): object {
    let newDic = {};
    keys.forEach((key) => {
      newDic[key] = source[key] || key;
    });
    return newDic;
  }

  /**
   * store dictionary as json file in output path
   * @param {string} lang
   * @param {Object} dic
   * @returns {Promise<any>}
   */
  private async storeDic(lang: string, dic: object): Promise<any> {
    await this.checkOutPath();
    fs.writeFileSync(this.OUTPUT_PATH + `${lang}.json`, JSON.stringify(dic));
  }

  /**
   * try to find and extract text from files
   * @returns {Promise<string[]>}
   */
  private async findKeys(): Promise<string[]> {
    let keys: string[] = [];
    const fileNames: string[] = await this.findFiles(this.SOURCE_PATH);
    let promise = [];
    fileNames.forEach((filename) => {
      promise.push(this.readFile(filename));
    });

    const keysArray = await Promise.all(promise);
    keysArray.forEach((keyArray => {
      keys = keys.concat(keyArray);
    }));

    return keys;
  }

  /**
   * find and return list of ts,tsx files
   * @param {string} pattern
   * @returns {Promise<string[]>}
   */
  private async findFiles(pattern: string): Promise<string[]> {
    return await new Promise((res) => {
      glob(pattern, null, (error, fileNames) => {
        if (error) {
          throw "Error in find files";
        } else {
          res(fileNames);
        }
      });
    });
  }

  /**
   * read file content
   * @param {string} path
   * @returns {Promise<string[]>}
   */
  private async readFile(path: string): Promise<string[]> {
    return await new Promise(res => {
      const fileContent = fs.readFileSync(path).toString();

      let tagKeys: string[] = [];
      let m;
      while (m = this.PATTERNS.TAG.exec(fileContent)) {
        tagKeys.push(m[1]);
      }

      let funcsKeys: string[] = [];

      while (m = this.PATTERNS.FUNCTION.exec(fileContent)) {
        funcsKeys.push(m[1]);
      }

      const allKeys = [...tagKeys, ...funcsKeys];
      res(allKeys);
    });
  }

}

// create an instance of extractor class and run it
const i18nExtractor = new I18nExtractor();
i18nExtractor.run();
