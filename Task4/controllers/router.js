'use strict'
const fs = require("fs");
const log = console.log
const constants = require('../app/constant')
const api = require('../app/api')

require('../app/helper')

module.exports = function (app) {

    app.use((request, response, next) => {
        log(request.originalUrl);
        next();
    })

    //#region postHandler
    app.post('/status', api.timeUpStatus)

    app.post('/api/events', api.eventsWitoutFilters)

    app.post('/api/events', api.eventsWithFilters)
    //#endregion

    //#region getHandler
    app.get('/', (request, response, next) => {
        next();
    })
    
    app.get('/status', api.timeUpStatus)

    app.get('/api/events', api.eventsWitoutFilters)

    app.get('/api/events', api.eventsWithFilters)
    //#endregion

    app.use(function (req, res, next) {
        log('not found');
        res.status(404).send('<h1>Page not found</h1>');
    });
}