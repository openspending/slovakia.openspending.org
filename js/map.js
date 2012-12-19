$(document).ready(function() {
  $.getJSON('/data/districts.json', function(districts) {
    districts = _.filter(districts, function(d) {return d.dataset!=undefined});
    var first = $('#first-list').empty();
    var second = $('#second-list').empty();
    _.each(districts, function(d, i) {
      var el = (i%2 == 0) ? first : second;
      console.log(d.name);
      el.append("<li><a href='municipality/#"+d.dataset+"'>"+d.name+"</a></li>");
    });

    window.map = $K.map('#map', 920, 500);

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

