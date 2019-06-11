
const config = require('./config');

module.exports = {

    /**
     * Finds all anchors on the page, inclusive of those within shadow roots.
     * Note: Intended to be run in the context of the page.
     * @param {boolean=} sameOrigin When true, only considers links from the same origin as the app.
     * @return {!Array<string>} List of anchor hrefs.
     */
    collectAllSameOriginAnchorsDeep(sameOrigin = false) {
        const allElements = [];

        const findAllElements = function (nodes) {
            for (let i = 0, el; el = nodes[i]; ++i) {
                allElements.push(el);
                // If the element has a shadow root, dig deeper.
                if (el.shadowRoot) {
                    findAllElements(el.shadowRoot.querySelectorAll('*'));
                }
            }
        };

        findAllElements(document.querySelectorAll('*'));

        const filtered = allElements
            .filter(el => el.localName === 'a' && el.href) // element is an anchor with an href.
            .filter(el => el.href !== location.href) // link doesn't point to page's own URL.
            .filter(el => {
                if (sameOrigin) {
                    return new URL(location).origin === new URL(el.href).origin;
                }
                return true;
            })
            .map(a => a.href);

        return Array.from(new Set(filtered));
    }

}