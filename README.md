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


