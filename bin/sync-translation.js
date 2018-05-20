const fs = require("fs");
const path = require("path");
const ZanataClient = require('zanata-js').ZanataClient;

const options = {
  url: "http://zanata.clickyab.ae:80/zanata/",
  username: "admin",
  "api-key": "1a214aa61ccc7f23c2e9c7062f21b031",
  'project-version': "1",
  project: "chameleon",
  verbose: true,

};

class translationApi {
  constructor() {
    // empty
    this.resource = path.join(process.cwd(), this.getArgumentsValue("resource") || "./dictionary");
    this.out = path.join(process.cwd(), this.getArgumentsValue("out") || "./out");
    this.tmp = path.join(process.cwd(), this.getArgumentsValue("tmp") || "./.tmp");

  }

  pushPoFile() {
    let project = new ZanataClient.Project(options);
    return project
      .on('data', (d) => {
        console.log(d);
      })
      .on('fail', (r) => {
        console.log(r);
      })
      .on("end_push", (data) => {
        console.log(`Translation file pushed.`);
      })
      .pushSources("chameleon", "1", {potdir: this.resource})
  }

  pullTranslationFile(lang) {
    return new Promise((res, rej) => {
      this.checkPath(this.tmp + "/po/" + lang)
        .then(() => {
          return this.checkPath(this.tmp + "/pot");
        }).then(() => {
        let project = new ZanataClient.Project(options);
        return project
          .pullTranslations("chameleon", "1", lang, {potdir: this.tmp + "/pot", podir: this.tmp + "/po/" + lang})
          .on('fail', (e) => {
            rej();
            console.error(e)
          })
          .on('data', (d) => {
            console.log(d);
          })
          .on('end', (r) => {
            console.log(r);
          })
          .on("end_pull", (data) => {
            console.log(`Translation file pulled for ${lang}`);
            res();
          });
      });
    });
  }

  transformFileToI18nJson(lang) {

    const source = fs.readFileSync(`${this.tmp}/pot/etag-cache.json`);
    const sourceJson = JSON.parse(source.toString());

    const target = fs.readFileSync(`${this.tmp}/po/${lang}/etag-cache.json`);
    const targetJson = JSON.parse(target.toString());

    const newJsonObject = {};
    targetJson[`en-US-1-${lang}`].payload.textFlowTargets.forEach(phrase => {
      const res = sourceJson["en-US-1-en"].payload.textFlows.find(r => r.id === phrase.resId);
      if (res.content) newJsonObject[res.content] = phrase.content;
    });

    if (!fs.existsSync(this.out)) {
      fs.mkdirSync(this.out);
    }

    fs.writeFileSync(`${this.out}/${lang}.json`, new Buffer.from(JSON.stringify(newJsonObject)));
    console.log(`Translation file stored for ${this.out}/${lang}.json`);
    return newJsonObject;

  }

  getArgumentsValue(name) {
    const args = process.argv;
    let value = null;
    args.forEach((item) => {
      if (item.indexOf(`--${name}=`) > -1) {
        value = item.split("=")[1];
      }
    });
    return value;
  }

  async checkPath(targetDir) {
    targetDir = targetDir.replace(process.cwd(), "");
    return await new Promise(res => {
      targetDir.split("/").reduce((parentDir, childDir) => {
        const curDir = path.resolve(parentDir, childDir);
        if (!fs.existsSync(curDir)) {
          fs.mkdirSync(curDir);
        }
        res(true);
        return curDir;
      }, "");
    });
  }
}

const a = new translationApi();
a.pushPoFile();
a.pullTranslationFile("fa-IR").then(() => {
  a.transformFileToI18nJson("fa-IR");
});
