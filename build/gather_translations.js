var fs = require('fs');
var translation = require('./translation_config');

const appBase = 'inst/shiny-examples/myapp/';
const localesDir = appBase + 'locales/';

function gather(dc) {
    let out = {};
    for (const language in dc) {
        transs = dc[language];
        for (const message in transs) {
            if (!(message in out)) {
                out[message] = {};
            }
            const targetLanguage = language in translation.languageRenames?
                translation.languageRenames[language] : language;
            out[message][targetLanguage] = transs[message]['message'];
        }
    }
    return out;
}

function gatherFile(filename) {
    let allLangs = {};
    let languages = fs.readdirSync(localesDir);
    // move en to the front
    const enIndex = languages.indexOf('en');
    if (0 <= enIndex) {
        languages = ['en'].concat( languages.slice(0, enIndex), languages.slice(enIndex + 1));
    }
    languages.forEach(function(language) {
        const text = fs.readFileSync(localesDir + language + '/' + filename, 'utf8');
        allLangs[language] = JSON.parse(text);
    });
    const byMessage = gather(allLangs);
    fs.writeFileSync(appBase + 'www/' + filename, JSON.stringify(byMessage));
}

translation.filenames.forEach(function(filename) {
    gatherFile(filename);
});
