/**
 * 
 * @author  Philip Tutty
 */

const puppeteer = require('puppeteer');
const del = require('del');
const util = require('util');
const fs = require('fs');
const stringify = require('json-stringify-safe');

const config = require('./config');
const helpers = require('./helpers');
const crawler = require('./crawler');
const URL = config.host + config.path;
const OUT_DIR = `output/${helpers.slugify(URL)}`;
const SCREENSHOTS = process.argv.includes('--screenshots');

const VIEWPORT = SCREENSHOTS ? {
    width: 1028,
    height: 800,
    deviceScaleFactor: 2
} : null;


(async () => {

    helpers.mkdirSync(OUT_DIR); // create output dir if it doesn't exist.
    await del([`${OUT_DIR}/*`]); // cleanup after last run.

    const browser = await puppeteer.launch({
        headless: config.headless
    });

    const page = await browser.newPage();
    if (VIEWPORT) {
        await page.setViewport(VIEWPORT);
    }

    const root = {
        url: URL
    };
    await crawler.crawl(browser, root);
    await util.promisify(fs.writeFile)(`./${OUT_DIR}/crawl.json`, stringify(root, null, ' '));
    await browser.close();

})();