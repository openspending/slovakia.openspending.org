$(document).ready(function() {
  $.getJSON('/data/districts.json', function(districts) {
    window.map = $K.map('#map', 940, 500);

    map.loadMap('/img/slovakia.svg', function(map) {
      map.loadCSS('/css/map_styles.css', function() {
        map.addLayer('district', {
          key: 'id-2',
          title: function (data) { return data["name-2"]; },
          click: function (data) {
            findDistrictWithDataset(districts, data, function (district) {
              window.location.href = "municipality/#" + district.dataset;
            });
          }
        });

        $.each(map.getLayer('district').paths, function (i, path) {
            findDistrictWithDataset(districts, path.data, function () {
              $(path.svgPath.node).addClass('hasDataset');
            });
          });
      });
    });
  });

  function findDistrictWithDataset(districts, data, callback) {
    var district = _.find(districts, function (district) {
      return district.name === data["name-2"];
    });
    if (district && district.dataset) {
      callback(district);
    }
  }
});

