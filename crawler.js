const sharp = require('sharp');
const pageHrefs = require('./get_page_anchors');
const config = require('./config');
const filters = require('./filters');
const DEPTH = config.depth;
const URL = config.host + config.path;
const crawledPages = new Map();
const maxDepth = DEPTH; // Subpage depth to crawl site.
const SCREENSHOTS = process.argv.includes('--screenshots');

module.exports = {

    /**
     * Crawls a URL by visiting an url, then recursively visiting any child subpages.
     * @param {!Browser} browser
     * @param {{url: string, title: string, img?: string, children: !Array<!Object>}} page Current page.
     * @param {number=} depth Current subtree depth of crawl.
     */
    async crawl(browser, page, depth = 0) {
        if (depth > maxDepth) {
            return;
        }

        if (crawledPages.has(page.url)) {
            console.log(`Reusing route: ${page.url}`);
            const item = crawledPages.get(page.url);
            page.title = item.title;
            page.img = item.img;
            page.children = item.children;
            // Fill in the children with details (if they already exist).
            page.children.forEach(c => {
                const item = crawledPages.get(c.url);
                c.title = item ? item.title : '';
                c.img = item ? item.img : null;
            });

            return;

        } else {

            console.log(`Loading: ${page.url}`);

            const newPage = await browser.newPage();
            await newPage.goto(page.url, {
                waitUntil: 'networkidle2'
            });

            let anchors = await newPage.evaluate(pageHrefs.collectAllSameOriginAnchorsDeep);

            // Don't crawl these links as we are now on subpages (top nav and footer)
            if (depth > 0) {
                filters.excludeSubpageAnchorsEndingWith.forEach((item) => {
                    anchors = anchors.filter(a => a.endsWith(item) !== true);
                })
            }

            // warwick.ac.uk/careers/services general filters see filter.json
            filters.excludeAnchorsWhichContain.forEach((item) => {
                anchors = anchors
                    .filter(a => a.includes(item) !== true)
            })

            anchors = anchors
                .filter(a => a.endsWith(config.path) !== true) // filter links back to homepage i.e. "service/careers/"
                .filter(a => a.includes(config.path) === true)

            page.title = await newPage.evaluate('document.title');
            page.children = anchors.map(url => ({
                url
            }));

            if (SCREENSHOTS) {
                const path = `./${OUT_DIR}/${slugify(page.url)}.png`;
                let imgBuff = await newPage.screenshot({
                    fullPage: false
                });
                imgBuff = await sharp(imgBuff).resize(null, 150).toBuffer(); // resize image to 150 x auto.
                util.promisify(fs.writeFile)(path, imgBuff); // async
                page.img = `data:img/png;base64,${imgBuff.toString('base64')}`;
            }

            crawledPages.set(page.url, page); // cache it.
            await newPage.close();

        }

        // Crawl subpages.
        for (const childPage of page.children) {
            await this.crawl(browser, childPage, depth + 1);
        }

    }
};