const request = require('postman-request');


const forecast = (lat, long, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=dd31a13a8bf8910e4a9ae3e77ad53f02&query=${lat},${long}&units=m`

    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to Weather Service', undefined);
        } else if (body.error) {
            callback('Cannot find that location', undefined);
        } else {
            callback(undefined, body.current.weather_descriptions[0]+ '. The temperature is currently '+ body.current.temperature+ ' degrees Celsius out.');
        }
    });
};

module.exports = forecast;