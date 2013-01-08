OpenSpending.Treetable = function (context, drilldowns) {
  function render(dataset, state, callback) {
    var render_ctx = _.extend(context, {'dataset': dataset});
    var treemap_ctx = _.extend(render_ctx, {
      click: function(node) { callback(node.data.name); }
    });

    new OpenSpending.AggregateTable($('#table_widget'), render_ctx, state).then(function(widget) {
      widget.$e.unbind('click', 'td a');
      widget.$e.on('click', 'td a', function(e) {
        var name = $(e.target).data('name') + '';
        callback(name);
        return false;
      });
    });
    new OpenSpending.Treemap($('#vis_widget'), treemap_ctx, state);
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

  return {
    render: render,
    drilldown: drilldown
  }
};
