OpenSpending.Treetable = function (context, drilldowns) {
  function render(dataset, state, callback) {
    var render_ctx = _.extend(context, {'dataset': dataset});
    var treemap_ctx = _.extend(render_ctx, {
      click: function(node) { callback(node.data.name); }
    });

    var lastYearDataDeferred = _loadLastYearData(render_ctx, state);
    var aggregateTable = new OpenSpending.AggregateTable($('#table_widget'), render_ctx, state)

    $.when(aggregateTable, lastYearDataDeferred).then(function(widget, lastYearData) {
      widget.calculateRowsValues = _.wrap(widget.calculateRowsValues, function (calculateRowsValues, data) {
        return _calculateYearlyChanges(calculateRowsValues, data, lastYearData[0], state.drilldowns);
      });
      widget.generateColumns = _.wrap(widget.generateColumns, _addYearlyChangeColumn);
      widget.$e.unbind('click', 'td a');
      widget.$e.on('click', 'td a', function(e) {
        var name = $(e.target).data('name') + '';
        callback(name);
        return false;
      });
      // Workaround for race condition. Check openspendingjs' issue #12.
      if (widget.dataTable) {
        widget.update(state);
      }
    });
    new OpenSpending.Treemap($('#vis_widget'), treemap_ctx, state);
  }

  function _loadLastYearData(context, state) {
    var params = {
      dataset: context.dataset,
      drilldown: state.drilldowns.join('|'),
      cut: 'year:' + (parseInt(state.cuts.year) - 1)
    };
    return $.getJSON(context.siteUrl + '/api/2/aggregate', params);
  }

  function _addYearlyChangeColumn(generateColumns, drilldowns) {
    var columns = generateColumns(drilldowns);

    columns.push({
          'name': 'yearlyChange',
          'label': 'Yearly Change (<span class="currency"></span>)',
          'width': '20%',
          'render': function(coll, obj) {
            return OpenSpending.Utils.formatAmountWithCommas(obj || 0,
              0, coll.aData['__amount_currency']);
          }
        });

    return columns;
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

  function _calculateYearlyChanges(calculateRowsValues, data, lastYearData, drilldowns) {
    var rows = calculateRowsValues(data);
    var newRows = _.map(rows, function(row) {
      var lastYear = _.find(lastYearData.drilldown, function (lastYear) {
        var blah = true;
        for (var i in drilldowns) {
          blah = blah && row[drilldowns[i]] && lastYear[drilldowns[i]] && (row[drilldowns[i]].id === lastYear[drilldowns[i]].id);
        };
        return blah;
      });

      if (lastYear) {
        row.yearlyChange = row.amount - lastYear.amount;
      } else {
        row.yearlyChange = "";
      };

      return row;
    });

    if (rows.length > 0) {
      var totalRow = rows[rows.length - 1];
      if (lastYearData.summary.num_entries > 0) {
        totalRow.yearlyChange = totalRow.amount - lastYearData.summary.amount;
      } else {
        totalRow.yearlyChange = "";
      }
    }

    return newRows;
  }

  return {
    render: render,
    drilldown: drilldown
  }
};
