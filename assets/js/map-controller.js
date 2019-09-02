function Controller() {
    drawStates = function () {
        L.geoJSON(window.statesData, {
            style: function (feature) {
                return {
                    color: '#000',
                    fill: false
                };
            }
        })
                .addTo(map);
    };

    //https://leafletjs.com/reference-1.5.0.html#geojson-adddata
    drawCities = function () {
        L.geoJSON(window.citiesData, {
            style: function (feature) {
                return {
                    color: '#FFF',
                    fill: true,
                    weight: 1
                };
            },
            onEachFeature: function (feature, layer) {
                //layer.options.color = '#CDEEDA';
                layer.on({click: selectCity})
            }
        })/*.bindPopup(function (layer) {
         console.log(layer);
         return layer.feature.properties.Name;
         })*///.on('click', selectCity)
                .addTo(map);
    };

    selectCity = function (layer) {
        var a = layer.target;
        //a.options.color = '#c19d32';
        //a.options.color = '#c19d32';
        //a.options.fill = true;
        //a.options.fillcolor = '#000';

        // create a red polygon from an array of LatLng points
        var latlngs = layer.target._latlngs;
        //var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);
        var polygon = L.polygon(latlngs);
        // zoom the map to the polygon
        //map.fitBounds(polygon.getBounds());
    }

    draw1M2Cities = function (data) {
        var coords = [];
        data.states.forEach((state) => {
            state.regions.forEach((region) => {

                region.cities.forEach((city) => {
                    var latlngs = [];
                    city.cityLocation.geometry.coordinates.forEach((c) => {
                        const latLog = {
                            lat: c[1],
                            lng: c[0]
                        };
                        latlngs.push(latLog);
                    });
                    var polygon = L.polygon(latlngs, {color: 'red', fill: true, weight: 3});
                    polygon.addTo(map);
                });
            });
        });
    }
}

draw1M2Regions = function (data) {

    var editableLayers = [];
    data.states.forEach((state) => {
        state.regions.forEach((region) => {

            var regionColor = '#' + Math.random().toString(16).slice(2, 8).toUpperCase();
            regionColor = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);

            var editableLayer = new L.FeatureGroup();
            editableLayers.push(editableLayer);
            map.addLayer(editableLayer);

            var polygons = [];
            debugger;
            region.cities.forEach((city) => {
                var cityPolygons =
                        {
                            regions: [
                                // list of regions each region is a list of points
                                //[[50,50], [150,150], [190,50]],
                                //[[130,50], [290,150], [290,50]]
                            ],
                            inverted: false // is this polygon inverted?
                        };

                city.cityLocation.geometry.coordinates.forEach((c) => {
                    cityPolygons.regions.push([[c[1], c[0]]]);
                });
                polygons.push(cityPolygons);
            });

            //var segments = PolyBool.segments(cityPolygons.regions[0]);
            /*
             var segments = PolyBool.segments(polygons[0]);
             for (var i = 1; i < polygons.length; i++) {
             var seg2 = PolyBool.segments(polygons[i]);
             var comb = PolyBool.combine(segments, seg2);
             segments = PolyBool.selectUnion(comb);
             }
             debugger;
             var regPol = PolyBool.polygon(segments);
             */
            debugger;
            var result = polygons[0];
            for (var i = 1; i < polygons.length; i++) {
                result = PolyBool.union(result, polygons[i]);
            }
            debugger;
            var regPol = result;
            console.log(regPol);

            latlngs = regPol;

            var polygon = L.polygon(latlngs, {"fillOpacity": .75, fillColor: regionColor, color: regionColor, fill: true, opacity: 2, weight: 0});
            polygon.addTo(editableLayer);
        });
    });

    return;

    var editableLayers = new L.FeatureGroup();
    map.addLayer(editableLayers);

    data.states.forEach((state) => {
        state.regions.forEach((region) => {
            var regionColor = '#' + Math.random().toString(16).slice(2, 8).toUpperCase();
            regionColor = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);

            region.cities.forEach((city) => {
                var latlngs = [];
                city.cityLocation.geometry.coordinates.forEach((c) => {
                    const latLog = {
                        lat: c[1],
                        lng: c[0]
                    };
                    latlngs.push(latLog);
                });
                var polygon = L.polygon(latlngs, {"fillOpacity": .75, fillColor: regionColor, color: regionColor, fill: true, opacity: 2, weight: 0});
                polygon.addTo(editableLayers);
            });
        });
    });
}

Controller.prototype.init = function () {
    //drawCities();
    drawStates();

    //var data = new _1m2Data();
    //draw1M2Regions(data);
    //draw1M2Cities(data);
};

//https://turfjs.org/docs/#union