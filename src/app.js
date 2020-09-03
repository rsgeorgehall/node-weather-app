const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const hbs = require('hbs');
const { response } = require('express');
const geocode = require('./Utils/geocode.js');
const forecast = require('./Utils/forecast.js');



// define paths for express config
const publicDir = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');



// setup handlebars location and views location
app.set('views', viewsPath);
app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);


// setup static directory to serve static files
app.use(express.static(publicDir));



//express.static is built in middleware that serves pages from the directory we give as a parameter
// for index.html it creates and serves a page with the path /index.html on the current domain - creating a new page
// index.html is unique in that this page will also be served as the root page i.e. /
// this will override app.get() below for the same root page
// public folder is the only directory set up to be exposed to the browser here


app.get('/', (req, res) => {
    res.render('index.hbs', {
        title: 'Weather',
        name: 'George'
    });
});



app.get('/about', (req, res) => {
    res.render('about.hbs', {
        title: 'About',
        name: 'George'
    });
});

app.get('/help', (req, res) => {
    res.render('help.hbs', {
        title: 'help',
        name: 'George',
        helpText: 'this is some helpful text'
    });
});

// res.send will below send JSON. automatically stringifyies JS and sends it when you make a JS object with properties
app.get('/weather', (req, res) => {

    if (req.query.address) {

        geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
            if (error) {
                return res.send({
                    error
                });
            };
            
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({
                        error
                    });
                };
    
                res.send({
                    location,
                    forecastData
                });
            });

        });

    } else {
        res.send({
            error: 'Please provide an address'
        });
    };
   
});




app.get('/products', (req, res) => {

    if (!req.query.string) {
        return res.send({
            error: 'You must provide a search term'
        });
    };

    // req object has info on query string. query is an object itself with properties that are the key-value pairs in the query string

    console.log(req.query.search);

    res.send({
        products: []
    });
});








// we can make our 404 pages more targeted. for instance, here this can be a 404 page that knows they are trying to look for something related to help so has special details on it

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'George',
        mssg: 'Help article not found'
    });
});




// penultimate should be 404 route. This is because wildcard * means match anything that hasn't been mathced so far so if put at top all will match
// when express gets a request it first looks if theres a static file of the name in the public folder then it goes down app.js and checks against every route, if finds it will use that one. * must therefore go last as will always be found

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'George',
        mssg: 'Page not found'
    });
});



// start the server as the last thing
app.listen(port, () => {
    console.log('Server is listening on PORT'+port);
});


