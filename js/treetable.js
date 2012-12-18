OpenSpending.Treetable = function (elem, context, drilldowns) {
  var treemapElem = $('<div id="vis_widget" />').appendTo(elem);
  var aggregateTableElem = $('<div id="table_widget" />').appendTo(elem);

  function render(dataset, state, callback) {
    var render_ctx = _.extend(context, {"dataset": dataset});
    var treemap_ctx = _.extend(render_ctx, {
      click: function(node) { callback(node.data.name); },
      tooltipMessage: function(widget, node) {
        var percentualValue = (node.data.value * 100)/widget.total;
        return node.name + " (" + (percentualValue).toFixed(2) + "%)";
      }
    });

    new OpenSpending.Treemap(treemapElem, treemap_ctx, state);
    new OpenSpending.AggregateTable(aggregateTableElem, render_ctx, state).then(function(widget) {
      widget.calculateRowsValues = _.wrap(widget.calculateRowsValues, _addTotalRowToResults)
      widget.$e.unbind('click', 'td a');
      widget.$e.on('click', 'td a', function(e) {
        var name = $(e.target).data('name') + '';
        callback(name);
        return false;
      });
    });
  }

  function drilldown(dataset, filters, callback) {
    var currentDrilldown = _.find(drilldowns, function(d) {
      return -1 == _.indexOf(_.keys(filters), d);
    });

    var state = {
      drilldowns: [currentDrilldown],
      cuts: filters
    };

    render(dataset, state, function(name) {
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
        label: "Total"
      };
    });

    return total;
  }

  return {
    render: render,
    drilldown: drilldown
  }
};
