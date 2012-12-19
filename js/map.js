$(document).ready(function() {
  $.getJSON('/data/districts.json', function(districts) {
    districts = _.filter(districts, function(d) { return d.dataset !== undefined; });
    window.map = $K.map('#map', 920, 500);

    map.loadMap('/img/slovakia.svg', function(map) {
      map.loadCSS('/css/map_styles.css', function() {
        map.addLayer('district', {
          key: 'id-2',
          title: function (data) { return data["name-2"]; }
        });

        $.each(map.getLayer('district').paths, function (i, path) {
          findDistrict(districts, path.data, function () {
            $(path.svgPath.node).addClass('hasDataset');
          });
        });

        addDistrictsToPathData(map.getLayer('district').paths, districts);
        setupTooltips();
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

  function setupTooltips() {
    $('.hasDataset').qtip({
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
        var sublist = list.find('ul:last');
        setupDistrictsList(dataset, sublist);
      }
    });
  }

  function urlFor(dataset) {
    return '/municipality/#' + dataset;
  }
});

