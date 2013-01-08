Municipal Budgets of Slovakia
=============================

This contains the web frontend to the Slovakia budget site, a front-end
to the OpenSpending platform.

Initialize the repository
-------------------------

To run the site for local development, follow these steps: 

* Install [Jekyll](https://github.com/mojombo/jekyll/wiki)
* Make sure you're on the branch gh-pages
* Fetch the openspendingjs submodule with:
  * `git submodule init` 
  * `git submodule update`

Generate the site
-----------------

The site can be generated with this command from the repository root: 

    jekyll --server --auto 

This will run an HTTP server at port 4000 to serve the site. 

Embedding this on your own page
-------------------------------

The treetable visualization in this site just needs what's contained in
[this file](slovakia.openspending.org/blob/gh-pages/municipality/index.html).
Copy its contents in the page where you want the visualization added, and
fix the scripts' paths.

Don't forget to change

    OpenSpending.scriptRoot = "{{site.openspendingjs}}"

to your [openspendingjs](https://github.com/openspending/openspendingjs) copy's
URL.

Everything should work now. To see some dataset, you need to pass its name in
the URL's hash. For example, say that my page is in
http://slovakia.openspending.org/municipality/ and my dataset is called "kosice".
To view it, I would link to http://slovakia.openspending.org/municipality/#kosice.

