// Writes out files in locales directory from the files in the www/js
// directory. Should never have to do this.
var fs = require('fs');

const appBase = 'inst/shiny-examples/myapp/';
const localesDir = appBase + 'locales/';

function degather(dc) {
    let out = {en:{}, cn:{}};
    for (let k in dc) {
        const transs = dc[k];
        for (let lang in transs) {
            out[lang][k] = { message: transs[lang] };
        }
    }
    return out;
}

function writeLocale(filename, byLang) {
    for (let lang in byLang) {
        const out = JSON.stringify(byLang[lang]);
        fs.writeFileSync(localesDir + lang + '/' + filename, out);
    }
}

function degatherFile(filename) {
    const text = fs.readFileSync(appBase + 'www/js/' + filename, 'utf8');
    const dict = JSON.parse(text);
    const byLanguage = degather(dict);
    console.log(byLanguage);
    writeLocale(filename, byLanguage);
}

degatherFile('dictionary_id.json');
degatherFile('dictionary_class.json');
