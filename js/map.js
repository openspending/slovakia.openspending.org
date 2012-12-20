$(document).ready(function() {
  $.when($.getJSON('/data/districts.json'), $.getJSON('/data/regions.json')).done(function(districts, regions) {
    districts = _.filter(districts[0], function(d) { return d.dataset !== undefined; });
    regions = regions[0];
    window.map = $K.map('#map', 920, 500);

    map.loadMap('/img/slovakia.svg', function(map) {
      map.loadCSS('/css/map_styles.css', function() {
        map.addLayer('district', {
          key: 'id-2',
          title: function (data) { return data['name-2']; }
        });
        map.addLayer('region', {
          key: 'varname-1',
          title: function (data) { return data['varname-1']; },
          click: function (data) {
            var region = _.find(regions, function (region) {
              return region.name == data['varname-1'];
            });
            if (region) {
              window.location.href = urlFor(region.dataset);
            }
          }
        });

        $.each(map.getLayer('district').paths, function (i, path) {
          findDistrict(districts, path.data, function () {
            var node = path.svgPath.node;
            $(node).addClass('hasDataset');
            node.ownerSVGElement.appendChild(node)
          });
        });

        var regionPaths = map.getLayer('region').pathsById;
        $.each(regions, function (i, region) {
          var path = regionPaths[region.name];
          if (path) {
            $(path[0].svgPath.node).addClass('hasDataset');
          }
        });

        addDistrictsToPathData(map.getLayer('district').paths, districts);
        setupDistrictsTooltips();
        setupDistrictsList(districts, $('#district-list'));
      });
    });
  });

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

  function setupDistrictsTooltips() {
    $('.district.hasDataset').qtip({
      content: {
        text: function (abc) {
          var district = this.data().district;
          var dataset = district.dataset;
          var text = '';

          $.each(dataset, function (i, dataset) {
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
          var dataset = district.dataset;
          if (_.isString(dataset)) {
            event.preventDefault();
            window.location.href = urlFor(dataset);
          }
        }
      },
      hide: false,
      style: 'qtip-light qtip-rounded'
    });
  }

  function setupDistrictsList(districts, list) {
    list.empty();
    _.each(districts, function(district, i) {
      var dataset = district.dataset;
      if (_.isString(dataset)) {
        list.append('<li><a href="'+urlFor(district.dataset)+'">'+district.name+'</a></li>');
      } else {
        list.prepend('<li>'+district.name+'<ul class="single-column-list"></ul></li>');
        var sublist = list.find('ul:first');
        setupDistrictsList(dataset, sublist);
      }
    });
  }

  function urlFor(dataset) {
    return '/municipality/#' + dataset;
  }
});

