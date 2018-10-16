"use strict"
const fs = require("fs");
const constants = require("../app/constant")
require("../app/helper")

const getEventsFile = function (callback) {
    fs.readFile("./data/events.json", "utf8", callback);
}

const isEmpty = function (val) {
    return !(typeof (val) != "undefined" && val != null);
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
    timeUpStatus: function (request, response) {
        const time = process.uptime();
        const uptime = `${time}`.toHHMMSS();
        return response.status(200).send(uptime);
    },

    eventsHandling: function (request, response) {
        let queryParam;
        switch (request.method) {
            case "POST":
                queryParam = request.body;
                break;
            case "GET":
                queryParam = request.query;
                break;
        }
        let pageNumb = queryParam.pageNumb;
        let maxEntities = queryParam.maxEntities;

        //clear the request object of unnecessary properties, for filtering by the correct properties
        if (!isEmpty(pageNumb) || !isEmpty(maxEntities)) {
            delete queryParam.pageNumb;
            delete queryParam.maxEntities;
        }

        if (Object.keys(queryParam).length &&
            !validateValueOfProperty(Object.keys(queryParam)[0], queryParam[Object.keys(queryParam)[0]].split(":"))) {
            return response.status(400).send(`incorrect${Object.keys(queryParam)[0]}`);
        }

        const callback = (err, data) => {
            if (err) {
                throw err;
            }
            const eventsArr = JSON.parse(data).events;

            //if no parameters are specified for the filter, assign the original array
            let filteredEvents = Object.keys(queryParam).length ? Object.eventsFilter(eventsArr, queryParam) : eventsArr;

            //  if there are no such events, return 400
            if (filteredEvents.length < 1) {
                return response.status(400).send(`no items with [${Object.keys(queryParam)[0]}] filter`);
            }

            //if paggination is enabled
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
                return response.status(400).send(`incorrect page number, for a given number of entities available ${pagesCount} pcs`);
            }
            return response.status(200).send(filteredEvents);
        };
        getEventsFile(callback);
    }
}