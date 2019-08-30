class StateGeoson{

    /**
     * @param {State} state
     */
    static findAndSetGeoson(state) {        
        for (let j = 0; j < statesData.features.length; j++) {
            const uf = cities.features[j].properties.Name;

            if (state.uf.toUpperCase() === uf.toUpperCase()) {
                    state.geojsonData = cities.features[j];
                    break;
            }            
        }
    }
}

class CityGeoson {

    constructor() {

    }
    
    /**
     * @param {City} city
     */
    static findAndSetGeoson(city) {
        
        for (let j = 0; j < cities.features.length; j++) {
            const x = cities.features[j];
            const y = city.name;

            const desc = x.properties.Description.toString();
            const foundUF = desc.substring(desc.length - 2).toString().toUpperCase();

            if (x.properties.Name.toUpperCase() === y.toUpperCase()) {
                if (foundUF === city.microregion.region.state.uf) {
                    city.geojsonData = x;
                    break;
                }
            }
        }
    }
}


class City {
    constructor(name, area, location, microregion) {
        this.name = name;
        this.area = area;
        this.location = location;

        /**
         * @param {StateMicroregion} microregion
         */
        this.microregion = microregion;
        this.geojsonData = null;
    }
    
    static buildFromRaw(raw, microregionInstance) {
        const city = new City(raw.municipio, raw.area, raw.location, microregionInstance);
        CityGeoson.findAndSetGeoson(city);
        return city;
    }
}

class StateMicroregion {

    constructor(name, region) {
        this.name = name;

        /**
         * @type Array
         */
        this.cities = [];
        this.region = region;
    }

    /**
     * @param {City} city
     */
    addCity(city) {
        this.cities.push(city);
    }

    static buildFromRaw(microregionName, microregionData, regionInstance) {
        const microregion = new StateMicroregion(microregionName, regionInstance);
        microregionData.forEach(r => microregion.addCity(City.buildFromRaw(r, microregion)));
        return microregion;
    }
}

class StateRegion {

    constructor(name, state) {
        this.name = name;
        /**
         * @type Array
         */
        this.microregions = [];
        this.state = state;
    }

    /**
     * @param {StateMicroregion} microregion
     */
    addMicroregion(microregion) {
        this.microregions.push(microregion);
    }

    static buildFromRaw(regionName, regionData, stateInstance) {
        const region = new StateRegion(regionName, stateInstance);
        let microReg = [...new Set(regionData.map(e => e.microregiao))];
        microReg.forEach(r => {
            const regData = regionData.filter(d => d.microregiao === r);
            region.addMicroregion(StateMicroregion.buildFromRaw(r, regData, region));
        });
        return region;
    }
}

export class State {
    constructor(uf, sourceInstance, color) {
        this.uf = uf;
        this.regions = [];
        this.color = color;

        this.geojsonData = null;
        
        StateGeoson.findAndSetGeoson(this);
        
        this.source = function () {
            return sourceInstance;
        }
    }
    /**
     * @param {StateRegion} region
     */
    addRegion(region) {
        this.regions.push(region);
    }

    static buildFromRaw(uf, ufData, sourceInstance, color) {
        const state = new State(uf, sourceInstance, color);
        [...new Set(ufData.map(e => e.regiao))].forEach(r => {
            const regData = ufData.filter(d => d.regiao === r);
            state.addRegion(StateRegion.buildFromRaw(r, regData, state));
        });

        return state;
    }
}

export class Builder {
    constructor() {
        this.states = [];
    }

    /**
     * @returns {State[]} 
     */
    build() {
        /**
         * @type Builder
         */
        const self = this;
        let stat = [...new Set(dados.map(e => e.uf))];
        const colors = ['red', 'green', 'blue'];
        var colorIdx = 0;
        stat.forEach(uf => {
            self.states.push(State.buildFromRaw(uf, dados.filter(d => d.uf === uf), dados, colors[colorIdx]));
            colorIdx ++;
        });

        return this.states;
    }
}