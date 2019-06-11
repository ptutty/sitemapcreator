/**
 * Copyright 2018 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author ebidel@ (Eric Bidelman) forked by Philip Tutty
 */

const puppeteer = require('puppeteer');
const del = require('del');
const util = require('util');
const fs = require('fs');

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

     const browser = await puppeteer.launch();
     const page = await browser.newPage();
     if (VIEWPORT) {
         await page.setViewport(VIEWPORT);
     }

     const root = {
         url: URL
     };
     await crawler.crawl(browser, root);
     await util.promisify(fs.writeFile)(`./${OUT_DIR}/crawl.json`, JSON.stringify(root, null, ' '));
     await browser.close();

 })();
