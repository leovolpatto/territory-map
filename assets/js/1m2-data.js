/**
 * @param {_1m2State} uf
 * @param {string} region
 * @param {object} city
 */
function _1m2City(uf, region, city){
    var cityLocation = null;
    var cityRegion = null;
   
    _1m2City.prototype.getCityRegion = function(){
        return cityRegion;
    }
    
    _1m2City.prototype.getCityLocation = function(){
        return cityLocation;
    }

    function findCity(){
        for(let j = 0; j < cities.features.length; j++){
            const x = cities.features[j];
            const y = city.municipio;
            
            const desc = x.properties.Description.toString();
            const foundUF = desc.substring(desc.length - 2).toString().toUpperCase();
                        
            if(x.properties.Name.toUpperCase() === y.toUpperCase() 
                    && city.regiao.toUpperCase() === region.toUpperCase()
                    && foundUF === city.uf){
                cityLocation = x;
                cityRegion = city;
                return true;
            }
        }
        
        return false;        
    }
    
    if(!findCity()){
        throw new Error("City not found: " + city.municipio);
    }
    
    return {
        'cityRegion':cityRegion,
        'cityLocation':cityLocation
    }
}

/**
 * @param {_1m2State} uf
 * @param {string} regiao
 * @returns {_1m2Region}
 */
function _1m2Region(uf, regiao){
    var theUf = uf.getUF();
    const _cities = uf.getData().filter((c) => {
           return c.uf === theUf;
    });

    var theCities = [];
    _cities.forEach((city) => {
        try{
            theCities.push(new _1m2City(uf, regiao, city));
        }catch (ex){};
    });
    
    _1m2Region.prototype.getCities = function(){
        return theCities;
    }
    
    return {
        "uf": theUf,
        "region": regiao,
        "cities": theCities,
        "state":uf,
    }
}

function _1m2State(uf){
    var data = [];
    var regions = [];
    
    if(uf === 'GO'){
        data = goais;
    }
    else if(uf === 'SP'){
        data = sp;
    }
    
    else if(uf === 'TO'){
        data = tocantins;
    }

    function findRegionInState(state){
        var regs = [];
        for(let i = 0; i < data.length; i++){
            if(regs.indexOf(data[i].regiao) >= 0){
                break;
            }
            
            regs.push(data[i].regiao);
        }
        
        regs.forEach((regiao) => {
            regions.push(new _1m2Region(state, regiao));
        });
        
        return regions;
    }
    
    /**
     * @returns {string}
     */
    _1m2State.prototype.getUF = function(){
        return uf;
    }
    
    /**
     * @returns {Array|tocantins|goais|sp}
     */
    _1m2State.prototype.getData = function(){
        return data;
    }
    
    regions = findRegionInState(this);
        
    return {
        "uf":uf,
        "regions":regions
    }
}

function _1m2Data(){    
    var states = dados;
    
    _1m2Data.prototype.getStates = function(){
        return states;
    }
    
    return {
        "states": states
    }
}