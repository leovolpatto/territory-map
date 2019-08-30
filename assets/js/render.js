import {Builder, State} from "./objects.js";

class Render {

    constructor() {
        this.builder = new Builder();
        /**
         * @param {State} parsed
         */
        this.parsed = null;
        this.addEvents();
        
        this.regionsLayer = null;
        this.microregionsLayer = null;
    }

    addEvents(){
        const self = this;
        document.getElementById("regions").onchange = function(d){
            if(d.srcElement.checked){
                self.renderRegions();
            }
            else{
                map.removeLayer(self.regionsLayer);
            }
        }
        document.getElementById("microregions").onchange = function(d){
            if(d.srcElement.checked){
                self.renderMicroregions();
            }
            else{
                map.removeLayer(self.microregionsLayer);
            }
        }
    }
    
    randomColor(stateColor){
        const greens = ['#6B8E23', '#7CFC00','#228B22','#9ACD32','#00FF7F','#3CB371'];
        const blues  = ['#F0F8FF', '#87CEFA','#1E90FF','#4682B4','#B0C4DE','#00BFFF'];
        const reds  = ['#FFA07A', '#CD5C5C','#DC143C','#B22222','#FF0000','#8B0000'];
        
        var color = '';
        switch(stateColor){
            case "green":
                color = greens[Math.floor(Math.random() * 6) + 1];
                break;
            case "blue":
                color = blues[Math.floor(Math.random() * 6) + 1];
                break;
            case "red":
                color = reds[Math.floor(Math.random() * 6) + 1];
                break;
            default:
                color = stateColor;
        }
        
        if(color === undefined){
            return this.randomColor(stateColor);
        }
        
        return color;
    }
    
    renderRegions(){
        var self = this;
        var drawnItems = new L.FeatureGroup();
        this.regionsLayer = drawnItems;
        map.addLayer(drawnItems);

        var polygons = [];
        this.parsed.forEach(state => {
            state.regions.forEach(region => {
                var _color = self.randomColor(state.color);
                console.log(_color);
                region.microregions.forEach(microregion => {
                    microregion.cities.forEach(city => {
                        if(city.geojsonData != null && city.geojsonData.geometry != null){
                            var latlngs = [];
                            city.geojsonData.geometry.coordinates.forEach((c) => {
                                const latLog = {
                                    lat: c[1],
                                    lng: c[0]
                                };
                                latlngs.push(latLog);
                            });
                            var polygon = L.polygon(latlngs, {color: _color, fillOpacity: 1, fill: true, weight: 0});
                            polygon.bindPopup(region.name);
                            polygon.bindTooltip(region.name);
                            polygon.on('mouseover', (e) => {
                                polygon.openTooltip();
                                console.log('ee');
                            });
                            polygons.push(polygon);
                        }
                    });
                });
            });
        });
        
        polygons.forEach(p => drawnItems.addLayer(p));
        var label = new L.Marker([57.666667, -2.64], {
            icon: new L.DivIcon({
                className: 'my-div-icon',
                html: '<img class="my-div-image" src="http://png-3.vector.me/files/images/4/0/402272/aiga_air_transportation_bg_thumb"/>'+
                      '<span class="my-div-span">RAF Banff Airfield</span>'
            })
        });        
    }
    
    renderMicroregions(){
        var drawnItems = new L.FeatureGroup();
        this.microregionsLayer = drawnItems;
        map.addLayer(drawnItems);

        var polygons = [];
        this.parsed.forEach(state => {
            state.regions.forEach(region => {
                region.microregions.forEach(microregion => {
                    microregion.cities.forEach(city => {
                        if(city.geojsonData != null && city.geojsonData.geometry != null){
                            var latlngs = [];
                            city.geojsonData.geometry.coordinates.forEach((c) => {
                                const latLog = {
                                    lat: c[1],
                                    lng: c[0]
                                };
                                latlngs.push(latLog);
                            });
                            var polygon = L.polygon(latlngs, {color: state.color, fill: true, weight: 0});
                            polygons.push(polygon);
                        }
                    });
                });
            });
        });
        
        polygons.forEach(p => drawnItems.addLayer(p));        
    }

    render() {
        this.parsed = this.builder.build();
        console.log(this.parsed);

        //this.renderCities();
    }

    renderCities() {
        this.parsed.forEach(state => {
            state.regions.forEach(region => {
                region.microregions.forEach(microregion => {
                    microregion.cities.forEach(city => {
                        if(city.geojsonData == null){
                            console.info(city.name + " no coords");
                        }
                        else{
                            this.drawPolygon(city.geojsonData.geometry.coordinates);
                        }
                    });
                });
            });
        });
    }

    drawPolygon(coords) {
        var latlngs = [];
        coords.forEach((c) => {
            const latLog = {
                lat: c[1],
                lng: c[0]
            };
            latlngs.push(latLog);
        });
        var polygon = L.polygon(latlngs, {color: 'red', fill: true, weight: 0});
        polygon.addTo(map);
    }
}



setTimeout(() => {
    console.log('a');
    let rend = new Render();
    rend.render();
}, 3000);

