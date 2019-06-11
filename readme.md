
## Tree view site map generator

Discovers all the pages in site or single page app (SPA) and creates
a tree of the result in ./output/<site slug/crawl.json. Optionally
takes screenshots of each page as it is visited.


# prerequistes 

- Node 

# install

- clone repo to local machine
- CD into install directory
- npm install (to install dependencies)


# config

- edit config.json and add you site details


# usage

any of the following:

```console
  node crawler.js
  URL=https://yourspa.com node crawler.js
  URL=https://yourspa.com node crawler.js --screenshots

```

Then open the visualizer in a browser:
  http://localhost:8080/html/d3tree.html
  http://localhost:8080/html/d3tree.html?url=../output/https___yourspa.com/crawl.json

Start Server:
  node server.js
 
