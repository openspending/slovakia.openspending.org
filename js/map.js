$(document).ready(function() {
    $.getJSON('/data/datasets.json', function(datasets) {
            var regionDatasets = _.groupBy(datasets, function(ds) {
                return ds.region;
            });
            window.map = $K.map('#map',500,350);

            var showData = function(region) {
               var regionData = regionDatasets[region];

                $("#region-title").text(region);

                $("#region-panel").empty();
                if(regionData){
                    var $regionList = $('<ul class="budget-list"></ul>');
                    var $councilList = $('<ul class="budget-list budget-inline"></ul>');
                    for(var key in regionData){
                        var obj = regionData[key];
                        switch(obj.type){
                            case "regional":
                                $regionList.append('<li><a href="'+obj.link+'" id="rib-link" class="budget-link regional-budget-link">Regional Investment Budget</a></li>');
                                break;

                            case "transparency":
                                $regionList.append('<li><a href="'+obj.link+'" id="bti-link" class="budget-link regional-budget-link">Budget Transparency Index</a>');
                                break;
                            case "council":
                                $councilList.append('<li><a href="council.html?name='+obj.name+'#/~/total--2009-" class="budget-link council-budget-link">'+obj.label+'</a></li>');
                                break;
                        }
                    }
                    if($regionList.find('li').length>0){
                        $("#region-panel").append($regionList);
                    }
                    if($councilList.find('li').length>0){
                        $("#region-panel").append('<h3 id="councils-title" class="panel-label">Councils</h3>');
                        $("#region-panel").append($councilList);
                    }

                }
                else{
                    $("#region-panel").append('<p>No Data available for this region.</p>');
                }

            }

            var selectRegion= function(region){
                var path = map.getLayerPath("region", region);
                $(map.container.selector + " path.active").removeClass("active");
                $(path.svgPath.node).addClass("active");
            }

            // communes.svg adamawa.svg cameroon.svg north_west.svg regions.svg region_communes.svg
            map.loadMap('/img/regions.svg', function(map) {
                map.loadStyles('/css/map_styles.css', function() {
                    map.addLayer({
                        id: 'region',
                        key: 'region'
                    });

                    map.tooltips({
                        layer: 'region',
                        content: function(data) {
                            var countStr = "";
                            if(regionDatasets[data]){
                                countStr = regionDatasets[data].length.toString();
                            }
                            else{
                                countStr = 'National budget';
                            }
                            return data + ' (' + countStr + ')';

                        },
                        style: {
                            name: 'dark'
                        }
                    });

                    map.onLayerEvent('click', function(d) {
                        selectRegion(d.region);
                        showData(d.region);
                    });

                });
            });
    });
});

