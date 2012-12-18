OpenSpending = "OpenSpending" in window ? OpenSpending : {}

$(function() {
  var context = {
    siteUrl: "http://openspending.org",
    pagesize: 10,
    callback: function(name) {
      console.log("HUHU");
    }
  };

  OpenSpending.WidgetLink = Backbone.Router.extend({
    routes: {
        ":dataset": "home",
        ":dataset/*args": "drilldown"
    },

    home: function(dataset) {
      var self = this;
      this.setDataset(dataset).then(function () {
        self.yearsContainer.find(':last').click();
      });
    },

    drilldown: function(dataset, args) {
      //this.dataset = dataset;
      this.setDataset(dataset);
      var router = this;
      var currentFilters = this.getFilters();
      router.treetable.drilldown(this.dataset, currentFilters, function (name, filters, drilldown) {
        filters = _.extend({}, filters);
        filters[drilldown] = name;
        router.setFilters(filters);
      });
    },

    getFragment: function(filters) {
      var fragment = _.map(_.keys(filters), function(k) {
        return k + ':' + filters[k];
      }).join('/');
      return this.dataset + '/' + fragment;
    },

    setFilters: function(filters) {
      var newFilters = $.extend({}, this.getFilters(), filters);
      this.navigate(this.getFragment(newFilters), {trigger: true});
    },

    getFilters: function() {
      var filters = {};
      var fragment = Backbone.history.fragment.split('/');
      fragment.shift();
      _.each(fragment, function(kv) {
        var kv_ = kv.split(':', 2);
        filters[kv_[0]] = kv_[1];
      });
      return filters;
    },

    setupYearsLinks: function() {
      var self = this;
      var router = this;
      this.yearsContainer.empty();

      function fetchDistinct(dimension, attribute, query) {
        var dfd = $.ajax({
            url: context.siteUrl + '/' + self.dataset + '/' + dimension + '.distinct',
            data: {attribute: attribute, q: query, limit: 20},
            dataType: 'jsonp',
            cache: true,
            jsonpCallback: 'distinct_' + btoa(dimension + '__' + attribute + '__' + query).replace(/\=/g, '')
            });
        return dfd.promise();
      }

      function renderYears(years) {
        _.each(years.sort(), function (year) {
          self.yearsContainer.append("<a class='btn' data-year='"+year+"' href='#'>"+year+"</a>");
        });
      }

      function setupYearsEvents() {
        self.yearsContainer.find('a').click(function () {
          var element = $(this);
          element.siblings().removeClass('disable')
          element.addClass('disable');
          router.setFilters(element.data());
          return false;
        });
      }

      return fetchDistinct("time", "year").then(function (distinct) {
        var years = _.map(distinct.results, function (result) {
          return result.year;
        });

        renderYears(years);
        setupYearsEvents();
      }).promise();
    },

    setDataset: function(dataset) {
      if (dataset == this.dataset) {
        return;
      }
      this.dataset = dataset;
      $('.page-title').html(dataset);
      $('title').html(dataset);
      return this.setupYearsLinks();
    },

    initialize: function(elem, context, filters, drilldowns) {
      this.treetable = OpenSpending.Treetable(elem, context, drilldowns);
      this.initialFilters = filters;
      this.yearsContainer = $('<div class="openspending-link-filter" />').insertBefore(elem);
    },
  });

  OpenSpending.app = new OpenSpending.WidgetLink($('#treetable_widget'), context, {'year': '2012'}, ['group', 'to']);
});
