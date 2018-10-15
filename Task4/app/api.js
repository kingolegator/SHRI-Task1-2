'use strict'
const fs = require("fs");
const log = console.log
const constants = require('../app/constant')
require('../app/helper')

const getEventsFile = function (callback) {
    fs.readFile("./data/events.json", "utf8", callback);
}

const isEmpty = function (val) {
    return !(typeof (val) != 'undefined' && val != null);
}

const validateValueOfProperty = (key, values) => {
    if (!isEmpty(constants[key])) {
        for (let index = 0; index < values.length; index++) {
            if (constants[key].indexOf(values[index]) == -1)
                return false;
        }
        return true;
    }
    return true;
}

module.exports = {
    timeUpStatus: function (request, response, next) {
        const time = process.uptime();
        const uptime = `${time}`.toHHMMSS();
        response.status(200).send(uptime);
    },

    eventsWitoutFilters: function (request, response, next) {
        let queryParam;
        switch (request.method) {
            case "POST":
                queryParam = Object.assign({}, request.body);
                break;
            case "GET":
                queryParam = Object.assign({}, request.query);
                break;
        }
        let pageNumb = queryParam.pageNumb;
        let maxEntities = queryParam.maxEntities;

        /**
         * clear the request object of unnecessary properties, for filtering by the correct properties
         */
        if (!isEmpty(pageNumb) || !isEmpty(maxEntities)) {
            delete queryParam.pageNumb,
                delete queryParam.maxEntities
        }

        if (!Object.keys(queryParam).length) {
            const callback = (err, data) => {
                if (err) {
                    throw err;
                }
                let eventsArr = JSON.parse(data).events;
                if (!isEmpty(pageNumb) && !isEmpty(maxEntities)) {
                    if (isNaN(pageNumb) || isNaN(maxEntities)) {
                        return response.status(400).send(`incorrect [${isNaN(pageNumb) ? `{pageNumb: ${pageNumb}}` : ""}${isNaN(maxEntities) ? `{maxEntities: ${maxEntities}}` : ""}] values`);
                    }
                    pageNumb = Math.abs(pageNumb);
                    maxEntities = Math.abs(maxEntities);
                    const pagesCount = Math.ceil(eventsArr.length / maxEntities);
                    if (pageNumb !== 0) {
                        if (pageNumb > pagesCount) {
                            return response.status(400).send(`the page is too large, allowed number ${pagesCount} pcs`);
                        }
                        eventsArr = eventsArr.slice((pageNumb - 1) * maxEntities, pageNumb * maxEntities);
                        return response.status(200).send(eventsArr);
                    }
                    return response.status(400).send(`incorrect page number, for a given number of entities available ${pagesCount} pcs`);
                }
                response.status(200).send(eventsArr);
            };
            getEventsFile(callback);
            return;
        }
        next();
    },

    eventsWithFilters: function (request, response, next) {
        let queryParam;
        switch (request.method) {
            case "POST":
                queryParam = Object.assign({}, request.body);
                break;
            case "GET":
                queryParam = Object.assign({}, request.query);
                break;
        }
        let pageNumb = queryParam.pageNumb;
        let maxEntities = queryParam.maxEntities;

        /**
         * clear the request object of unnecessary properties, for filtering by the correct properties
         */
        if (!isEmpty(pageNumb) || !isEmpty(maxEntities)) {
            delete queryParam.pageNumb,
                delete queryParam.maxEntities
        }

        if (!validateValueOfProperty(Object.keys(queryParam)[0], queryParam[Object.keys(queryParam)[0]].split(':'))) {
            return response.status(400).send("incorrectType");
        }

        const callback = (err, data) => {
            if (err) {
                throw err;
            }
            const eventsArr = JSON.parse(data).events;
            let filteredEvents = Object.eventsFilter(eventsArr, queryParam);

            if (filteredEvents.length < 1) {
                filteredEvents = eventsArr;
            }
            /**
             * if paggination is enabled
             */
            if (!isEmpty(pageNumb) && !isEmpty(maxEntities)) {
                if (isNaN(pageNumb) || isNaN(maxEntities)) {
                    return response.status(400).send(`incorrect [${isNaN(pageNumb) ? `{pageNumb: ${pageNumb}}` : ""}${isNaN(maxEntities) ? `{maxEntities: ${maxEntities}}` : ""}] values`);
                }
                pageNumb = Math.abs(pageNumb);
                maxEntities = Math.abs(maxEntities);
                const pagesCount = Math.ceil(filteredEvents.length / maxEntities);
                if (pageNumb !== 0) {
                    if (pageNumb > pagesCount) {
                        return response.status(400).send(`the page is too large, allowed number ${pagesCount}pcs`);
                    }
                    filteredEvents = filteredEvents.slice((pageNumb - 1) * maxEntities, pageNumb * maxEntities);
                    return response.status(200).send(filteredEvents);
                }
                return response.status(400).send(`incorrect page number, for a given number of entities available ${pagesCount}pcs`);
            }
            return response.status(200).send(filteredEvents);
        };
        getEventsFile(callback);
    }
}