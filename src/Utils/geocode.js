const request = require('postman-request');

const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiMTVoYWxsZyIsImEiOiJja2Vpc3p5M24wY2hzMnhwaTZvNjF0dnQxIn0.VmGh3s642dnzFDHxWc7yxg&limit=1`

    request({ url, json:true }, (error, {body} = {}) => {
        if (error) {
            callback('Unable to Connect to Location Services!', undefined);
        } else if (body.message || body.features.length === 0) {
            callback('Unable to find location. Try another search.', undefined);
        } else {
            callback(undefined, {
                latitude:  body.features[0].center[1] ,
                longitude: body.features[0].center[0] ,
                location: body.features[0].place_name 
            });
        };
    });
};

module.exports = geocode;