"use strict";

const { spawn } = require('child_process');
const { Builder, By, Key, until } = require('selenium-webdriver');
const { describe, before, after, it } = require('mocha');
const clipboardy = require("clipboardy");
const assert = require("assert");
const { PNG } = require("pngjs");
const floor = Math.floor;

describe('IsoplotRgui', function() {
    let rProcess;
    let driver;

    before(function() {
        rProcess = spawn('Rscript', ['test/start-gui.R', '50054']);
        driver = new Builder().forBrowser('firefox').build();
    });

    after(async function() {
        // unbelievably this has to be async to make Mocha wait until
        // all the tests have resolved before it calls it
        rProcess.kill('SIGHUP');
        driver.quit();
    })

    describe('table implementation', function() {
        it('undoes mistakes', async function() {
            this.timeout(12000);
            await driver.get('http://localhost:50054');
            await testUndoInTable(driver);
        });

        it('resists script injection attempts', async function() {
            this.timeout(4000);
            await driver.get('http://localhost:50054');
            await goToCell(driver, 'INPUT', 1, 1);
            const input = await driver.switchTo().activeElement();
            const text = "<script>alert('bad!')</script>";
            await input.sendKeys(text, Key.TAB);
            const box = await driver.findElement(cellInTable('INPUT', 1,1));
            await driver.wait(until.elementTextContains(box, text));
        });

        it('is readable from the calculation engine', async function() {
            this.timeout(8000);
            await driver.get('http://localhost:50054');
            await choosePlotDevice(driver, 'ages');
            await driver.wait(until.elementLocated(cellInTable('INPUT', 1, 1)));
            await clearGrid(driver);
            const u235toU238 = 137.818;
            const testData = [
                ['25.2', '0.03', '0.0513', '0.0001'],
                ['25.4', '0.02', '0.0512', '0.0002'],
                ['27.1', '0.01', '0.05135', '0.00005']
            ];
            await inputTestData(driver, testData);
            await clickButton(driver, 'run');
            const expectedResults = [
                [251.1, 0.51, 250.86, 0.29, 253.3, 4.48, 250.88, 0.29],
                [248.92, 0.88, 248.93, 0.19, 248.81, 8.99, 248.93, 0.19],
                [235.59, 0.22, 233.591, 0.085, 255.54, 2.24, 233.619, 0.085]
            ];
            await chainWithIndex(expectedResults, (row, rowNumber) =>
                chainWithIndex(row, (value, columnNumber) => {
                return driver.findElement(
                        cellInTable('OUTPUT', rowNumber + 1, columnNumber + 1)
                        ).getText().then(actual => {
                    assertNearlyEqual(Number(actual), value);
                });
            }));
        });
    });

    describe('language support', function() {
        const onlineEN = 'Online';
        const introEN = 'free and open-source';
        const onlineZH = '在线使用';
        const introZH = '是一个免费的开源软件';
        const inputErrorHelpEN = 'Choose one of the following four options:';
        const propagateEN = 'Propagate external uncertainties?';
        const ratiosEN = 'ratios.';
        const helpEN = 'Help';
        it('displays the correct language', async function() {
            // test that English is working without choosing it
            await testTranslation(driver, false, helpEN, ratiosEN,
                propagateEN, inputErrorHelpEN, onlineEN, introEN);
            await testTranslation(driver, '中文', '帮助', '测量值。',
                '传递外部误差？',
                '选择以下四个选项之一',
                onlineZH, introZH);
            await testTranslation(driver, 'English', helpEN, ratiosEN,
                propagateEN, inputErrorHelpEN, onlineEN, introEN);
            await clickButton(driver, 'lang_zh_Hans');
            await assertTextContains(driver, 'online_tab', onlineZH);
            await assertTextContains(driver, 'intro', introZH);
            await clickButton(driver, 'lang_en');
            await assertTextContains(driver, 'online_tab', onlineEN);
            await assertTextContains(driver, 'intro', introEN);
        });
        it('displays English where no translation is available', async function() {
            await driver.get('http://localhost:50054');
            await driver.executeScript('window.localStorage.setItem("language", "xxtest");');
            await driver.get('http://localhost:50054');
            await waitForFunctionToBeInstalled(driver, 'translatePage');
            await driver.executeScript('window.translatePage();');

            // test dictionary_id.json
            await assertTextContains(driver, 'help', 'XXhelp');
            await clickButton(driver, 'help');
            await assertTextContains(driver, 'UPb_86', ratiosEN);
            // test dictionary_class.json
            await clickButton(driver, 'options');
            await assertTextContains(driver, 'help_exterr_UPb', propagateEN);
            await assertTextContains(driver, 'help_UPb_formats', 'XXinput format:');
            // test contextual_help.json
            await clickButton(driver, 'help_ierr');
            await assertTextContains(driver, 'helpmenu', inputErrorHelpEN);
            await clickButton(driver, 'help_mint_concordia');
            await assertTextContains(driver, 'helpmenu', 'XXminimum age limit.');
            // test home_id.json
            await clickButton(driver, 'home');
            await waitForFunctionToBeInstalled(driver, 'translateHomePage');
            await driver.executeScript('window.translateHomePage();');
            await assertTextContains(driver, 'online_tab', 'XXonline');
            await assertTextContains(driver, 'intro', introEN);
        });
    });

    describe('the plot', function() {
        describe('concordia UPb', function() {
            it('appears to work', async function() {
                await driver.get('http://localhost:50054');
                // 38/06, err, 07/06, err
                const testData = [
                    [25.2, 0.03, 0.0513, 0.0001],
                    [25.4, 0.02, 0.0512, 0.0002],
                    [27.1, 0.01, 0.05135, 0.00005]
                ];
                await clearGrid(driver);
                await inputTestData(driver, testData);
                await choosePlotDevice(driver, 'concordia');
                const options = {
                    U238U235: 137.818,
                    errU238U235: 0.0225,
                    minx: 0.260,
                    maxx: 0.282,
                    miny: 0.0368,
                    maxy: 0.0400,
                    ellipsefill: "'green'",
                    ellipsestroke: "'black'"
                };
                await performClick(driver, 'options');
                await performType(driver, options);
                await performClick(driver, 'plot');
                const png = await getPlotImage(driver);
                testData.forEach((data) => {
                    const failures = assertConcordiaBlob(png, options, data, 1500);
                    // some failures are caused by other marks on the graph; labels or
                    // other blobs, for example.
                    assert(failures.length <= 5, 'Too many failures: ' + failures.join(', '));
                });
            });
        });
        describe('weighted mean PbPb', function() {
            it('appears to work', async function() {
                await driver.get('http://localhost:50054');
                await chooseGeochronometer(driver, 'Pb-Pb');
                await choosePlotDevice(driver, 'weighted mean');
                const testResults = [
                    { bottom: 4667.4, top: 4691.5 },
                    { bottom: 4658.5, top: 4697.2 },
                    { bottom: 4671.5, top: 4687.5 }
                ];
                const options = {
                    U238U235: 137.818,
                    errU238U235: 0.0225,
                    "PbPb-formats": "Normal",
                    mint: 4650,
                    maxt: 4700,
                    LambdaU238: 0.000155125,
                    errLambdaU238: 8.3e-8,
                    LambdaU235: 0.00098485,
                    errLambdaU235: 6.7e-7
                };
                /*const testData = [
                    [115, 0.2, 75, 0.3],
                    [140, 0.6, 92, 0.5],
                    [152, 0.3, 100, 0.2]
                ];*/
                const testData = [[115], [140], [152]];
                for (const i in testData) {
                    weightedMeanPbPbUpdateTestData(testData[i], testResults[i], options);
                    console.log(testData[i]);
                }
                await performClick(driver, 'options');
                await performType(driver, options);
                await clearGrid(driver);
                await inputTestData(driver, testData);
                await performClick(driver, 'plot');
                const png = await getPlotImage(driver);
                const axes = getAxes(png);
                const ranget = options.maxt - options.mint;
                const barWidth = floor((axes.width + 1) / (testData.length - 1));
                for (const i in testData) {
                    const x = axes.left + barWidth * i;
                    const { top, bottom } = getBar(png, x, 'G');
                    const mint = (axes.bottom - bottom) / axes.height * ranget + options.mint;
                    const maxt = (axes.bottom - top) / axes.height * ranget + options.mint;
                    assertNear(mint, testResults[i].bottom, 0.1, 'Min time');
                    assertNear(maxt, testResults[i].top, 0.1, 'Max time');
                }
            });
        });
    });
});

// Sets data[1], data[2] and  data[3] as the error in the
// ratio of 206Pb to 204Pb, the ratio of 207Pb to 204Pb and the
// error of the ratio of 207Pb to 204Pb.
// data[0] must already be set as ratio of 206Pb to 204Pb.
// options needs the following fields set:
// * LambdaU238 and errLambdaU238: decay constant of 238U
// * LambdaU235 and errLambdaU235: decay constant of 235U
// * U238U235 and errU238U235: initial ratio of 238U to 235U.
// result.bottom to result.top is the size of the bar we want output.
function weightedMeanPbPbUpdateTestData(data, result, options) {
    const age2 = result.top + result.bottom;
    const age = age2 / 2;
    const ageErr = (result.top - result.bottom) / age2;
    const decay238 = Math.exp(age * options.LambdaU238);
    const pb206 = options.U238U235 * (decay238 - 1);
    const err238 = options.errLambdaU238 / options.LambdaU238;
    const err238235 = options.errU238U235 / options.U238U235;
    const decay238Err = Math.sqrt(ageErr * ageErr + err238 * err238);
    const pb206err = Math.sqrt(err238235 * err238235 + decay238Err * decay238Err);

    const decay235 = Math.exp(age * options.LambdaU235);
    const pb207 = decay235 - 1;
    const err235 = options.errLambdaU235 / options.LambdaU235;
    const pb207err = Math.sqrt(ageErr * ageErr + err235 * err235);

    const pb206pb204 = data[0];
    data[1] = roundd(pb206err * pb206pb204, 2);
    const pb207pb204 = pb206pb204 * pb207 / pb206;
    data[2] = roundd(pb207pb204, 2);
    data[3] = roundd(pb207err * pb207pb204, 2);
}

function roundd(x, n) {
    let p = Math.pow(10,n);
    return Math.round(x * p) / p;
}

function assertNear(actual, expected, delta, name) {
    assert(expected - delta < actual && actual << expected + delta,
        name + ' is ' + actual + ', which is not near ' + expected);
}

// finds a vertical solid colour `col` at pixel position x
function getBar(png, x, col) {
    let top = 0;
    let run = 0;
    const runThreshold = 4;
    let y;
    for (y = 0; y != png.height && run != runThreshold; ++y) {
        if (colour(png, {x, y}) === col) {
            if (run === 0) {
                top = y;
            }
            ++run;
        } else {
            run = 0;
        }
    }
    let bottom = top;
    run = 0;
    for (; y != png.height && run != runThreshold; ++y) {
        if (colour(png, {x, y}) === col) {
            run = 0;
        } else {
            bottom = y;
            ++run;
        }
    }
    return { top, bottom };
}

// gets PNG of plot
async function getPlotImage(driver) {
    const img = await driver.wait(until.elementLocated(By.css('#myplot img')));
    const imgSrc = await img.getAttribute('src');
    const imgB64 = imgSrc.split(',')[1];
    return PNG.sync.read(Buffer.from(imgB64, 'base64'));
}

function assertConcordiaBlob(png, options, testData, sampleCount) {
    const axes = getAxes(png);
    const ranges = getRanges(options);
    const [u38pb06, u38pb06err, pb07pb06, pb07pb06err] = testData;
    const { U238U235 } = options;
    const u38pb06rev = varianceOfRelativeError(u38pb06, u38pb06err);
    const pb07pb06rev = varianceOfRelativeError(pb07pb06, pb07pb06err);
    // y is Pb206 / U238
    const y = 1 / u38pb06;
    // x is Pb207 / U235
    const x = pb07pb06 * U238U235 / u38pb06;
    const yErr = y * Math.sqrt(u38pb06rev);
    const xErrBy3806 = x * Math.sqrt(u38pb06rev);
    const xErrBy0706 = x * Math.sqrt(pb07pb06rev);
    // the zone of ambiguity seems to be 5 <= h2 <= 7. I don't know why.
    const minimumGreenDistanceSquared = 5;
    const maximumGreenDistanceSquared = 7;
    let failures = [];
    for (let i = 0; i != sampleCount; ++i) {
        // So, let's choose a random dot
        // tv = amount of pb07pb06 error we have
        const tv = Math.random() * 6 - 3;
        // tw = amount of u38pb06 error we have
        const tw = Math.random() * 6 - 3;
        const h2 = tv * tv + tw * tw;
        const gx = x + tv * xErrBy0706 + tw * xErrBy3806;
        const gy = y + tw * yErr;
        // we think if h2 < 1 the transformed dot wll be green
        const pixel = toPixel(axes, ranges, gx, gy);
        const col = colour(png, pixel);
        const expectedCol = h2 < minimumGreenDistanceSquared ? 'G' : 'W';
        if (expectedCol !== col
            && (col === 'G' || col === 'W')
            && (h2 < minimumGreenDistanceSquared
                || maximumGreenDistanceSquared < h2)) {
            failures.push('Expected colour ' + expectedCol
                + ' but got ' + col + ' at distance^2 ' + h2);
        }
    }
    return failures;
}

function varianceOfRelativeError(value, standardDeviation) {
    const r = standardDeviation / value;
    return r*r;
}

function colour(png, pixel) {
    const index = (pixel.x + png.width * pixel.y) * 4;
    const r = png.data[index];
    const g = png.data[index + 1];
    const b = png.data[index + 2];
    const bright = Math.max(r,g,b,20);
    const threshold = bright * 0.6;
    const colour =
        (r < threshold? 0 : 1) +
        (g < threshold? 0 : 2) +
        (b < threshold? 0 : 4);
    return "KRGYBMCW"[colour];
}

function isLinePixel(png, index) {
    const d = png.data;
    const brightness = d[index] + d[index + 1] + d[index + 2];
    return brightness < 450;
}

function isOnHorizontalLine(png, index) {
    const pixelsToCheck = floor(png.width / 10);
    index -= floor(pixelsToCheck / 2) * 4;
    let lastIndex = index + pixelsToCheck * 4;
    for (; index < lastIndex; index += 4) {
        if (!isLinePixel(png, index)) {
            return false;
        }
    }
    return true;
}

// returns the index of a point on the bottom line
function findBottomLine(png) {
    const width = png.width;
    const row = width * 4;
    const endIndex = row * png.height;
    let index = endIndex - floor(width / 2) * 4
    // search the bottom third of the image
    const giveUp = index - row * floor(png.height / 3);
    for (; giveUp <= index; index -= row) {
        if (isLinePixel(png, index) && isOnHorizontalLine(png, index)) {
            return index;
        }
    }
    return null;
}

function isOnVerticalLine(png, index) {
    const pixelsToCheck = floor(png.height / 10);
    const row = 4 * png.width;
    index -= floor(pixelsToCheck / 2) * row;
    let lastIndex = index + pixelsToCheck * row;
    for (; index < lastIndex; index += row) {
        if (!isLinePixel(png, index)) {
            return false;
        }
    }
    return true;
}

// returns the index of a point on the bottom line
function findLeftLine(png) {
    const width = png.width;
    const row = width * 4;
    let startIndex = floor(png.height / 2) * row;
    // search the left third of the image
    const giveUp = startIndex + floor(width / 3) * 4;
    for (let index = startIndex; index < giveUp; index += 4) {
        if (isLinePixel(png, index) && isOnVerticalLine(png, index)) {
            return index;
        }
    }
    return null;
}

function lineEndIndex(png, index, dIndex) {
    let result = index;
    let gap = 0;
    while (gap < 4) {
        if (isLinePixel(png, index)) {
            result = index;
            gap = 0;
        } else {
            ++gap;
        }
        index += dIndex;
    }
    return result;
}

function getAxes(png) {
    const leftLinePoint = findLeftLine(png);
    const bottomLinePoint = findBottomLine(png);
    const row = png.width * 4;
    const topIndex = lineEndIndex(png, leftLinePoint, -row);
    const bottomIndex = lineEndIndex(png, leftLinePoint, row);
    const leftIndex = lineEndIndex(png, bottomLinePoint, -4);
    const rightIndex = lineEndIndex(png, bottomLinePoint, 4);
    return {
        bottom: floor(bottomIndex / row),
        left: (leftIndex / 4) % png.width,
        height: floor((bottomIndex - topIndex) / row),
        width: floor((rightIndex - leftIndex) / 4)
    };
}

function getRanges(options) {
    const centreX = (options.maxx + options.minx) / 2;
    // R expands its ranges by on each side 4%, it seems
    const halfRangeX = (options.maxx - options.minx) * 0.54;
    const centreY = (options.maxy + options.miny) / 2;
    const halfRangeY = (options.maxy - options.miny) * 0.54;
    return {
        minx: centreX - halfRangeX,
        sizex: 2 * halfRangeX,
        miny: centreY - halfRangeY,
        sizey: 2 * halfRangeY
    };
}

function toPixel(axes, range, x, y) {
    return {
        x: floor(0.5 + axes.left + axes.width * (x - range.minx) / range.sizex),
        y: floor(0.5 + axes.bottom - axes.height * (y - range.miny) / range.sizey)
    };
}

async function waitForFunctionToBeInstalled(driver, functionName) {
    await driver.wait(async function () {
        return await driver.executeScript('return !!window.' + functionName);
    });
}

async function removeDefaultLanguage(driver) {
    await driver.executeScript('window.localStorage.removeItem("language");');
}

async function testTranslation(driver, language, help, ratios,
        propagate, inputErrorHelp, online, intro) {
    if (!language) {
        removeDefaultLanguage(driver);
    }
    await driver.get('http://localhost:50054');
    if (language) {
        await chooseLanguage(driver, language);
    }
    // test dictionary_id.json
    await assertTextContains(driver, 'help', help);
    await clickFindThen(driver, 'help', By.id('UPb_86'), async function(element) {
        const text = await element.getText();
        assert(text.search(ratios));
        return true;
    });
    // test dictionary_class.json
    await clickButton(driver, 'options');
    await assertTextContains(driver, 'help_exterr_UPb', propagate);
    // test contextual_help.json
    await clickButton(driver, 'help_ierr');
    await assertTextContains(driver, 'helpmenu', inputErrorHelp);
    // test home_id.json
    await clickButton(driver, 'home');
    await assertTextContains(driver, 'online_tab', online);
    await assertTextContains(driver, 'intro', intro);
}

async function assertTextContains(driver, id, text) {
    const element = await driver.wait(until.elementLocated(By.id(id)));
    await driver.wait(until.elementTextContains(element, text));
}

function chainWithIndex(arr, callback, first=0, end=arr.length) {
    if (first < end) {
        return callback(arr[first], first).then(chainWithIndex(arr, callback, first + 1, end));
    }
    return new Promise(x => x, r => { throw r; });
}

function assertNearlyEqual(a, b) {
    const db = Math.abs(b * 1e-6) + 1e-12;
    assert(b - db < a && a < b + db, a + ' is not nearly ' + b);
}

// Clicks element (or id) `clickFirst`, then finds element by `clickSecondLocator`,
// then calls `thenDo` with argument the element found by the locator.
// If the locator fails to find an element it tries again.
// `thenDo` should return true to succeed, false to retry, or fail an assertion
// to fail.
async function clickFindThen(driver, clickFirst, clickSecondLocator, thenDo) {
    const button = typeof(clickFirst) === 'string'?
        await driver.wait(until.elementLocated(By.id(clickFirst))) : clickFirst;
    await driver.wait(async function() {
        let seconds = await driver.findElements(clickSecondLocator);
        if (!!seconds.length && await thenDo(seconds[0])) {
            return true;
        }
        await button.click();
    });
}

async function selectMenuItem(driver, buttonId, menuId, choiceText) {
    await clickFindThen(driver, buttonId,
        By.xpath(`//ul[@id='${menuId}']/li/div[contains(text(),'${choiceText}')]`),
        async function (choice) {
            if (await choice.isEnabled() && await choice.isDisplayed()) {
                await performClick(driver, choice);
                return true;
            }
            return false;
        }
    );
}

async function choosePlotDevice(driver, choiceText) {
    await selectMenuItem(driver, 'plotdevice-button', 'plotdevice-menu', choiceText);
}

async function chooseGeochronometer(driver, choiceText) {
    await selectMenuItem(driver, 'geochronometer-button', 'geochronometer-menu', choiceText);
}

async function chooseLanguage(driver, languageText) {
    await performClick(driver, 'language-button');
    const arbitraryLanguageChoice = await driver.wait(
        until.elementLocated(By.css('#language-menu li')));
    await driver.wait(until.elementIsVisible(arbitraryLanguageChoice));
    const choice = await findMenuItem(driver, languageText);
    await performClick(driver, choice);
}

// to be used when normal clicks mysteriously don't work
async function performClick(driver, element) {
    if (typeof(element) === 'string') {
        element = await driver.wait(until.elementLocated(By.id(element)));
        await driver.wait(until.elementIsEnabled(element));
    }
    await driver.actions()
        .move({origin: element})
        .press()
        .release()
        .perform();
    return element;
}

// super robust typing into input box or selecting from input
async function performType(driver, idToKeys) {
    for (const k in idToKeys) {
        const input = await performClick(driver, k);
        const tag = await input.getTagName();
        if (tag === "input") {
            await input.clear();
            await input.sendKeys(idToKeys[k]);
        } else if (tag === "select") {
            const choice = await driver.wait(until.elementLocated(
                By.xpath(`//select[@id='${k}']//option[contains(text(),'${idToKeys[k]}')]`)));
            // For some reason performClick() doesn't really work for select elements
            await input.click();
            await driver.wait(until.elementIsVisible(choice));
            await choice.click();
        } else {
            assert.fail(`element with id ${k} has unexpected tag ${tag}`);
        }
    }
}

// Clicks 'Clear' button then reports if the grid (or at least the home cell)
// did get cleared.
async function tryToClearGrid(driver) {
    await clickButton(driver, 'clear');
    const homeCell = await driver.findElement(cellInTable('INPUT', 1, 1));
    const text = await homeCell.getText();
    return text === '';
}

async function clearGrid(driver) {
    await driver.wait(() => tryToClearGrid(driver));
}

async function testUndoInTable(driver) {
    await goToCell(driver, 'INPUT', 1, 1);
    let input = await driver.switchTo().activeElement();
    await input.sendKeys('13.2', Key.TAB);
    const box = await driver.findElement(cellInTable('INPUT', 1, 1));
    await driver.wait(until.elementTextContains(box,'13.2'));
    await goToCell(driver, 'INPUT', 1, 1);
    input = await driver.switchTo().activeElement();
    await input.sendKeys(Key.CONTROL, 'a');
    await input.sendKeys('7.54', Key.TAB);
    await driver.wait(until.elementTextContains(box,'7.54'));
    await input.sendKeys(Key.CONTROL, 'z');
    await driver.wait(until.elementTextContains(box,'13.2'));
    await input.sendKeys(Key.CONTROL, Key.SHIFT, 'z');
    await driver.wait(until.elementTextContains(box,'7.54'));
}

async function inputTestData(driver, testData) {
    await goToCell(driver, 'INPUT', 1, 1);
    const box = await driver.switchTo().activeElement();
    // write the first line in by typing it
    await box.sendKeys(testData[0][0], Key.TAB, testData[0][1], Key.TAB, testData[0][2], Key.TAB, testData[0][3], Key.RETURN);
    // write the other lines in by pasting them
    clipboardy.writeSync(testData.slice(1).map(ds => ds.join('\t')).join('\n'));
    await goToCell(driver, 'INPUT', 2, 1);
    const box2 = await driver.switchTo().activeElement();
    await box2.sendKeys(Key.CONTROL + 'v');
}

async function findMenuItem(driver, text) {
    const uiMenuItemLocator = By.className('ui-menu-item-wrapper');
    await driver.wait(until.elementLocated(uiMenuItemLocator));
    const menuItems = await driver.findElements(uiMenuItemLocator);
    for (const index in menuItems) {
        const item = menuItems[index];
        const itemText = await item.getText();
        if (itemText === text) {
            return item;
        }
    }
    assert(false, "No ui menu item found with text '" + text + "'");
}

async function clickButton(driver, id) {
    const button = await driver.wait(until.elementLocated(By.id(id)));
    button.click();
}

async function goToCell(driver, tableId, row, column) {
    await driver.wait(until.elementLocated(cellInTable(tableId, row, column))).click();
}

function cellInTable(tableId, row, column) {
    return By.css('#' + tableId + ' table tbody tr:nth-of-type(' + row + ') td:nth-of-type(' + column + ')');
}
