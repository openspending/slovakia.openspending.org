OpenSpending.Treetable = function (elem, context, drilldowns) {
  var treemapElem = $('<div id="vis_widget" />').appendTo(elem);
  var aggregateTableElem = $('<div id="table_widget" />').appendTo(elem);

  function render(state, callback) {
    var treemap_ctx = _.extend(context, {
      click: function(node) { callback(node.data.name); }
    });

    new OpenSpending.Treemap(treemapElem, treemap_ctx, state);
    new OpenSpending.AggregateTable(aggregateTableElem, context, state).then(function(widget) {
      widget.calculateRowsValues = _.wrap(widget.calculateRowsValues, _addTotalRowToResults)
      widget.$e.unbind('click', 'td a');
      widget.$e.on('click', 'td a', function(e) {
        var name = $(e.target).data('name') + '';
        callback(name);
        return false;
      });
    });
  }

  function drilldown(filters, callback) {
    var currentDrilldown = _.find(drilldowns, function(d) {
      return -1 == _.indexOf(_.keys(filters), d);
    });

    var state = {
      drilldowns: [currentDrilldown],
      cuts: filters
    };

    render(state, function(name) {
      if (_.indexOf(drilldowns, currentDrilldown) >= drilldowns.length-1) {
        context.callback(name);
      } else {
        callback(name, filters, currentDrilldown);
      }
    });
  }

  function _addTotalRowToResults(calculateRowsValues, data) {
    var rows = calculateRowsValues(data);
    var total = _calculateTotalRow(data, rows);

    rows.push(total);

    return rows;
  }

  function _calculateTotalRow(data) {
    var total = {
      __amount_pct: 1,
      amount: data.summary.amount
    };

    _.each(drilldowns, function (drilldown) {
      total[drilldown] = {
        label: "TOTAL"
      };
    });

    return total;
  }

  return {
    render: render,
    drilldown: drilldown
  }
};
