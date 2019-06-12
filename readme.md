
# Tree view site map generator

Discovers all the pages in site or single page app (SPA) and creates
a tree of the result in ./output/<site slug/crawl.json. Optionally
takes screenshots of each page as it is visited.


### Prerequistes 

- Node v8+

Install Node using [HomeBrew on Mac](https://www.dyclassroom.com/howto-mac/how-to-install-nodejs-and-npm-on-mac-using-homebrew)

### download project and install dependancies

```console
clone https://github.com/ptutty/sitemapcreator
cd sitemapcreator
npm install
```

### Config

- edit config-sample.json and rename config.json, add the URL details of the site you wish to crawl
- depth is how many levels to crawl
- if you wish to test you may find it useful to set headless: false so see what is going on.
- the filter flag allows you to cusomize anchors link which are crawled
```js
{
    "host": "https://www.bbc.co.uk",
    "path": "/sport",
    "depth": 2,
    "headless": true,
    "filters": false
}
```

### Filters

Filter allow you to remove unwanted cruff from the visualisation, such as: page anchors links, links back to the homepage, links to documents, intranet links etc. See the array 'excludeAnchorsWhichContain' below

Sometime you may wish not to crawl the navigation again on each subpage, you can list URL fragments in the array 'excludeSubpageAnchorsEndingWith'

```js
{ 
    "excludeSubpageAnchorsEndingWith" : [
        "/live/",
        "/programmes/",
    ],
    "excludeAnchorsWhichContain" : [
        "#",
        ".pdf",
        "docx",
        "doc"
    ]
}

```



### Start a crawl

To start a crawl, run the command below in the console - make sure you are in the project directory.

```console
  node app.js
```
You will see URL's being crawled in the console.
You can also run a crawl and capture optional screenshots

```console
  node app.js --screenshots
```

### View the visualisation

Start a local server.

```console
  node server.js
```
Then open the URL below in a browser:

http://localhost:8080/html/d3tree.html?url=../output/https___yourspa.com/crawl.json


