"use strict";

const { spawn } = require('child_process');
const { Builder, By, Key, until } = require('selenium-webdriver');
const Mocha = require('mocha');
const clipboardy = require("clipboardy");
const PNG = require("pngjs").PNG;

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
        await inputTestData(driver);
        await clickButton(driver, 'options');
        await driver.wait(until.elementIsVisible(driver.findElement(By.id('maxx'))));
        const minx = '0.249', maxx = '0.286', miny = '0.0359', maxy = '0.0406';
        await inputText(driver, 'minx', minx);
        await inputText(driver, 'maxx', maxx);
        await inputText(driver, 'miny', miny);
        await inputText(driver, 'maxy', maxy);
        await clickButton(driver, 'plot');
        const png = await getPlotPng(driver);
        let limits = findPlotLimits(png);
    });
});

async function getPlotPng(driver) {
    const plotSrc = await driver.findElement(By.css('#myplot img')).getAttribute('src');
    const plot = plotSrc.substring(plotSrc.indexOf(',') + 1);
    return PNG.sync.read(Buffer.from(plot, 'base64'));
}

function findPlotLimits(png) {
    const middleX = Math.floor(png.width / 2);
    const top = findColour(png, 0, middleX, 0, 0, 1).y;
    const left = findColour(png, 7, middleX, top, -1, 0).x + 1;
    const middleY = Math.floor(png.height / 2);
    const right = findColour(png, 0, png.width, middleY, -1, 0).x;
    const bottom = findColour(png, 7, right, middleY, 0, 1).y - 1;
    return { top, bottom, left, right };
}

function findColour(png, colour, x, y, dx, dy) {
    while (pixelColour(png, x, y) !== colour) {
        x += dx;
        y += dy;
    }
    return { x, y };
}

function pixelColour(png, x, y) {
    let p = 4 * (x + png.width * y);
    return (png.data[p] < 128 ? 0 : 4) + (png.data[p + 1] < 128 ? 0 : 2) + (png.data[p + 2] < 128 ? 0 : 1);
}

// Clicks 'Clear' button then reports if the grid (or at least the home cell)
// did get cleared.
async function tryToClearGrid(driver) {
    clickButton(driver, 'clear');
    const homeCell = driver.findElement(cellInTable(1, 1));
    return await homeCell.getText() === '';
}

async function inputTestData(driver) {
    await goToCell(driver, 1, 1);
    const box = await driver.switchTo().activeElement();
    await box.sendKeys('25.2', Key.TAB, '0.03', Key.TAB, '0.0513', Key.TAB, '0.0001', Key.RETURN);
    clipboardy.writeSync('25.4\t0.02\t0.0512\t0.0002\n27.1\t0.01\t0.05135\t0.00005');
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
