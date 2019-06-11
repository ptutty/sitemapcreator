const sharp = require('sharp');
const pageHrefs = require('./get_page_anchors');
const config = require('./config');
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

        console.log(`Loading: ${page.url}`);

        const newPage = await browser.newPage();
        await newPage.goto(page.url, {
            waitUntil: 'networkidle2'
        });

        let anchors = await newPage.evaluate(pageHrefs.collectAllSameOriginAnchorsDeep);

        
        // if not the homepage don't crawl top nav links again on subpages 
        if (depth > 0 ) {
            anchors = anchors
                .filter(a => a.endsWith("/options/") !== true)
                .filter(a => a.endsWith("/workexperience/") !== true)
                .filter(a => a.endsWith("/findingwork/") !== true)
                .filter(a => a.endsWith("/applications/") !== true)
                .filter(a => a.endsWith("/graduates/") !== true)
                .filter(a => a.endsWith("/help/") !== true)
                .filter(a => a.endsWith(config.path) !== true)
            
        }

        // general filters
        anchors = anchors
            .filter(a => a.includes(config.path) === true)
            .filter(a => a.includes("#") !== true) // filter out anchors
            .filter(a => a.includes("/intranet/") !== true) // filter out intranet
            .filter(a => a.endsWith(config.path) !== true) // filter links back to homepage i.e. "service/careers/"
            .filter(a => a.includes("/tutors/") !== true) // filter out tutors (intranet)
            .filter(a => a.includes("?external") !== true) // filter out query strings (text only links)
            .filter(a => a.includes("https://websignon.warwick.ac.uk") !== true) // filter out signing  (SSO)
            .filter(a => a.includes(".pdf") !== true) // filter out pdf links

        page.title = await newPage.evaluate('document.title');
        page.children = anchors.map(url => ({
            url
        }));

        // if (SCREENSHOTS) {
        //     const path = `./${OUT_DIR}/${slugify(page.url)}.png`;
        //     let imgBuff = await newPage.screenshot({
        //         fullPage: false
        //     });
        //     imgBuff = await sharp(imgBuff).resize(null, 150).toBuffer(); // resize image to 150 x auto.
        //     util.promisify(fs.writeFile)(path, imgBuff); // async
        //     page.img = `data:img/png;base64,${imgBuff.toString('base64')}`;
        // }

        crawledPages.set(page.url, page); // cache it.
        await newPage.close();


        // Crawl subpages.
        for (const childPage of page.children) {
            await this.crawl(browser, childPage, depth + 1);
        }

    }
};