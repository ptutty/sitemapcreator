
# Tree view site map generator

Discovers all the pages in site or single page app (SPA) and creates
a tree of the result in ./output/<site slug/crawl.json. Optionally
takes screenshots of each page as it is visited.


### prerequistes 

- Node 

### install

- clone repo to local machine
- CD into install directory
- npm install (to install dependencies)


### config

- edit config.json and add your site details
- depth is how many levels to crawl

```js
{
    "host": "https://warwick.ac.uk",
    "path": "/services/careers/",
    "depth": 2
}
```


### usage

any of the following:

```console
  node app.js
  node app.js
  node app.js --screenshots
```

### Start a local server to view the results of crawler in d3:

```console
  node server.js
```


### Then open the visualizer in a browser:

  http://localhost:8080/html/d3tree.html?url=../output/https___yourspa.com/crawl.json


