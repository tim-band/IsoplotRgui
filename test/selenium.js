"use strict";

const { spawn } = require('child_process');
const { Builder, By, Key, until } = require('selenium-webdriver');
const Mocha = require('mocha');
const clipboardy = require("clipboardy");
const PNG = require("pngjs").PNG;
const assert = require('assert');

const mocha = new Mocha();

mocha.addFile('test/selenium.js');
mocha.run(function(failures) {process.exitCode = failures? 1 : 0});

describe('IsoplotRgui', function testConcordia() {
    let rProcess;
    let driver;

    before(function() {
        rProcess = spawn('R', ['CMD', 'BATCH', 'test/start-gui.R', 'test/test.Rbatch']);
        driver = new Builder().forBrowser('firefox').build();
    });

    after(function() {
        rProcess.kill('SIGHUP');
    })

    // Smoke test for Concordia diagrams:
    // clear the grid,
    // enter some data with the keyboard,
    // enter some more data with copy and paste,
    // plot a concordia diagram,
    // check it has the blobs we expect.
    //... could also check undo/redo
    it('Concordia', async function testConcordia() {
        this.timeout(10000);
        await driver.get('http://localhost:50054');
        await driver.wait(driver => tryToClearGrid(driver), 3000);
        const u235toU238 = 137.818;
        const testData = [
            ['25.2', '0.03', '0.0513', '0.0001'],
            ['25.4', '0.02', '0.0512', '0.0002'],
            ['27.1', '0.01', '0.05135', '0.00005']
        ];
        await inputTestData(driver, testData);
        await clickButton(driver, 'options');
        await driver.wait(until.elementIsVisible(driver.findElement(By.id('maxx'))));
        const minx = '0.249', maxx = '0.286', miny = '0.0359', maxy = '0.0406';
        await inputText(driver, 'minx', minx);
        await inputText(driver, 'maxx', maxx);
        await inputText(driver, 'miny', miny);
        await inputText(driver, 'maxy', maxy);
        await clickButton(driver, 'plot');
        const png = await getPlotPng(driver);
        const rPlotMarginFactor = 0.04;
        const limits = findPlotLimits(png);
        const rangex0 = Number(maxx) - Number(minx);
        const minxn = Number(minx) - rangex0 * rPlotMarginFactor;
        const rangex = rangex0 * (1 +  2 * rPlotMarginFactor);
        const rangey0 = Number(maxy) - Number(miny);
        const minyn = Number(miny) - rangey0 * rPlotMarginFactor;
        const rangey = rangey0 * (1 + 2 * rPlotMarginFactor); 
        const plotWidth = limits.right - limits.left;
        const plotHeight = limits.bottom - limits.top;
        console.log(limits.left, limits.top, limits.right, limits.bottom);
        testData.forEach(data => {
            console.log(data);
            const x = data[2] * u235toU238 / data[0];
            const y = 1 / data[0];
            console.log(x + ',' + y);
            const plotX = Math.round(limits.left + plotWidth * (x - minxn) / rangex);
            const plotY = Math.round(limits.bottom - plotHeight * (y - minyn) / rangey);
            console.log(plotX + ',' + plotY);
            // should really calculate the slope and extent of the blob properly
            const blobTop = findBlobEdge(png, plotX, plotY, 0, -1).y;
            const blobBottom = findBlobEdge(png, plotX, plotY, 0, 1).y;
            const blobLeft = findBlobEdge(png, plotX, plotY, -1, 0).x;
            const blobRight = findBlobEdge(png, plotX, plotY, 1, 0).x;
            console.log('blob dimensions are (' + blobLeft + ', ' + blobTop + '), (' + blobRight + ', ' + blobBottom + ')');
        });
    });
});

function findBlobEdge(png, x, y, dx, dy) {
    const green = findColour(png, 2, x, y, dx, dy);
    return findColour(png, 0, green.x, green.y, dx, dy);
}

async function getPlotPng(driver) {
    const plotSrc = await driver.wait(until.elementLocated(By.css('#myplot img'))).getAttribute('src');
    const plot = plotSrc.substring(plotSrc.indexOf(',') + 1);
    return PNG.sync.read(Buffer.from(plot, 'base64'));
}

function findPlotLimits(png) {
    const middleX = Math.floor(png.width / 2);
    const top = findColour(png, 0, middleX, 0, 0, 1).y;
    const left = findColour(png, 7, middleX, top, -1, 0).x + 1;
    const middleY = Math.floor(png.height / 2);
    const right = findColour(png, 0, png.width - 1, middleY, -1, 0).x;
    const bottom = findColour(png, 7, right, middleY, 0, 1).y - 1;
    return { top, bottom, left, right };
}

function findColour(png, colour, x, y, dx, dy) {
    while (pixelColour(png, x, y) !== colour
            && 0 <= x && x < png.width
            && 0 <= y && y < png.height) {
        x += dx;
        y += dy;
    }
    return { x, y };
}

function pixelColour(png, x, y) {
    let p = 4 * (x + png.width * y);
    let colour = (png.data[p] < 128 ? 0 : 4) + (png.data[p + 1] < 128 ? 0 : 2) + (png.data[p + 2] < 128 ? 0 : 1);
    if (colour !== 7)
        console.log(colour + '@' + x + ',' + y);
    return colour;
}

// Clicks 'Clear' button then reports if the grid (or at least the home cell)
// did get cleared.
async function tryToClearGrid(driver) {
    clickButton(driver, 'clear');
    const homeCell = driver.findElement(cellInTable(1, 1));
    return await homeCell.getText() === '';
}

async function inputTestData(driver, testData) {
    await goToCell(driver, 1, 1);
    const box = await driver.switchTo().activeElement();
    // write the first line in by typing it
    await box.sendKeys(testData[0][0], Key.TAB, testData[0][1], Key.TAB, testData[0][2], Key.TAB, testData[0][3], Key.RETURN);
    // write the other lines in by pasting them
    clipboardy.writeSync(testData.slice(1).map(ds => ds.join('\t')).join('\n'));
    await goToCell(driver, 2, 1);
    const box2 = await driver.switchTo().activeElement();
    await box2.sendKeys(Key.CONTROL + 'v');
}

async function inputText(driver, id, text) {
    const input = driver.findElement(By.css('input#' + id));
    await input.click();
    await input.sendKeys(Key.CONTROL + 'a');
    await input.sendKeys(text);
}

async function clickButton(driver, id) {
    await driver.findElement(By.id(id)).click();
}

async function goToCell(driver, row, column) {
    let cell = await driver.wait(until.elementLocated(cellInTable(row, column)));
    cell.click();
}

function cellInTable(row, column) {
    return By.css('table tbody tr:nth-of-type(' + row + ') td:nth-of-type(' + column + ')');
}
