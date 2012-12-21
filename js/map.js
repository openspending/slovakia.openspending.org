$(document).ready(function() {
  $.when($.getJSON('/data/districts.json'), $.getJSON('/data/regions.json')).done(function(districts, regions) {
    districts = _.filter(districts[0], function(d) { return d.dataset !== undefined; });
    regions = regions[0];
    window.map = $K.map('#map', 920, 500);

    map.loadMap('/img/slovakia.svg', function(map) {
      map.loadCSS('/css/map_styles.css', function() {
        map.addLayer('district', {
          key: 'name-2',
          title: function(data) { return data['name-2']; }
        });
        map.addLayer('region', {
          key: 'varname-1',
          title: function(data) { return data['varname-1']; },
          click: function(data) {
            var region = _.find(regions, function(region) {
              return region.name == data['varname-1'];
            });
            if (region) {
              redirectTo(region.dataset);
            }
          }
        });

        eachElementsPathNodeInLayer('district', districts, function(node) {
          // Move the node with its parent, which holds its tooltip.
          var parent = $(node).parent()[0];
          sendToFrontInside(parent, node.ownerSVGElement);
          $(node).addClass('has-dataset');
        });

        eachElementsPathNodeInLayer('region', regions, function(node) {
          var strokeNode = node.cloneNode();
          $(node).addClass('has-dataset');
          $(strokeNode).addClass('stroke-only');
          sendToFrontInside(strokeNode, node.ownerSVGElement);
        });

        addDistrictsToPathData('district', districts);
        setupDistrictsTooltips();
        setupDistrictsList(districts, $('#district-list'));
      });
    });
  });

  function eachElementsPathNodeInLayer(layerName, elements, callback) {
    var paths = map.getLayer(layerName).pathsById;
    $.each(elements, function (i, element) {
      var path = paths[element.name];
      if (path) {
        callback(path[0].svgPath.node, element);
      }
    });
  };

  function sendToFrontInside(svgElement, container) {
    container.appendChild(svgElement);
  };

  function addDistrictsToPathData(districtLayerName, districts) {
    eachElementsPathNodeInLayer(districtLayerName, districts, function(node, district) {
      $(node).data('district', district);
    });
  };

  function setupDistrictsTooltips() {
    $('.district.has-dataset').qtip({
      content: {
        text: function() {
          var district = this.data().district;
          var dataset = district.dataset;
          var text = '';

          $.each(dataset, function(i, dataset) {
            text += '<p><a href="'+urlFor(dataset.dataset)+'">'+dataset.name+'</a></p>';
          });

          return text;
        },
        title: {
          text: function() { return this.data().district.name; },
          button: true
        }
      },
      show: {
        event: 'click',
        solo: true
      },
      events: {
        show: function(event) {
          var district = $('#'+event.originalEvent.target.id).data().district;
          var dataset = district.dataset;
          if (_.isString(dataset)) {
            event.preventDefault();
            redirectTo(dataset);
          }
        }
      },
      hide: false,
      style: 'qtip-light qtip-rounded'
    });
  };

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
  };

  function redirectTo(dataset) {
    window.location.href = urlFor(dataset);
  };

  function urlFor(dataset) {
    return '/municipality/#' + dataset;
  };
});

