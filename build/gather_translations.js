var fs = require('fs');

const appBase = 'inst/shiny-examples/myapp/';
const localesDir = appBase + 'locales/';

function gather(dc) {
    let out = {};
    for (language in dc) {
        transs = dc[language];
        for (const message in transs) {
            if (!(message in out)) {
                out[message] = {};
            }
            out[message][language] = transs[message]['message'];
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
    fs.writeFileSync(appBase + 'www/js/' + filename, JSON.stringify(byMessage));
}

gatherFile('dictionary_id.json');
gatherFile('dictionary_class.json');
