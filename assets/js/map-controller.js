function Controller() {
    
    var states = ['AC'];
    
    drawStates = function (){
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
    drawCities = function (){
        L.geoJSON(window.citiesData, {
            style: function (feature) {
                return {
                    color: '#FFF',
                    fill: true,
                    weight:1
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
    
    selectCity = function(layer){
        var a = layer.target;
        a.options.color = '#c19d32';
        a.options.color = '#c19d32';
        a.options.fill = true;
        a.options.fillcolor = '#000';

        // create a red polygon from an array of LatLng points
        var latlngs = layer.target._latlngs;
        var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);
        // zoom the map to the polygon
        map.fitBounds(polygon.getBounds());
    }
    
}

Controller.prototype.init = function() {
     drawCities();
     drawStates();
};

//https://turfjs.org/docs/#union