$(document).ready(function() {
  $.getJSON('/data/districts.json', function(districts) {
    districts = _.filter(districts, function(d) {return d.datasets!=undefined});
    var first = $('#first-list').empty();
    var second = $('#second-list').empty();
    _.each(districts, function(d, i) {
      var el = (i%2 == 0) ? first : second;
      el.append('<li><a href="'+urlFor(d.datasets)+'">'+d.name+'</a></li>');
    });

    window.map = $K.map('#map', 920, 500);

    map.loadMap('/img/slovakia.svg', function(map) {
      map.loadCSS('/css/map_styles.css', function() {
        map.addLayer('district', {
          key: 'id-2',
          title: function (data) { return data["name-2"]; }
        });

        $.each(map.getLayer('district').paths, function (i, path) {
          findDistrictWithDatasets(districts, path.data, function () {
            $(path.svgPath.node).addClass('hasDataset');
          });
        });

        addDistrictsToPathData(map.getLayer('district').paths, districts);
        setupTooltips();
      });
    });
  });

  function findDistrictWithDatasets(districts, data, callback) {
    findDistrict(districts, data, function (district) {
      if (district.datasets) {
        callback(district);
      }
    });
  }

  function findDistrict(districts, data, callback) {
    var district = _.find(districts, function (district) {
      return district.name === data["name-2"];
    });
    if (district) {
      callback(district);
    }
  }

  function addDistrictsToPathData(paths, districts) {
    $.each(paths, function (i, path) {
      findDistrict(districts, path.data, function (district) {
        $(path.svgPath.node).data('district', district);
      });
    });
  }

  function setupTooltips() {
    $('.hasDataset').qtip({
      content: {
        text: function (abc) {
          var district = this.data().district;
          var datasets = district.datasets;
          var text = '';

          $.each(datasets, function (i, dataset) {
            text += '<p><a href="'+urlFor(dataset.dataset)+'">'+dataset.name+'</a></p>';
          });

          return text;
        },
        title: {
          text: function () { return this.data().district.name; },
          button: true
        }
      },
      show: {
        event: 'click',
        solo: true
      },
      events: {
        show: function(event, api, abc) {
          var district = $('#'+event.originalEvent.target.id).data().district;
          var datasets = district.datasets;
          if (_.isString(datasets)) {
            event.preventDefault();
            window.location.href = urlFor(datasets);
          }
        }
      },
      hide: false,
      style: 'qtip-light qtip-rounded'
    });
  }

  function urlFor(dataset) {
    return '/municipality/#' + dataset;
  }
});

