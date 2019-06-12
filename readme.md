
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

- edit config-sample.json and rename config.json, add your site details
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

filter allow you to remove unwanter cruff from the visualisation if needs be such as in page anchors links, links back to the homepage, links to documents, intranet links etc. See the array 'excludeAnchorsWhichContain' below

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



### usage

any of the following:

```console
  node app.js
```
or with optional screenshots

```console
  node app.js --screenshots
```

### Start a local server to view the results of crawler in d3:

```console
  node server.js
```


### Then open the visualizer in a browser:

  http://localhost:8080/html/d3tree.html?url=../output/https___yourspa.com/crawl.json


