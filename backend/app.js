const express = require("express");
const cors = require("cors");
const inverterInterface = require("./inverterInterface");
const {prepareForTracking, startAllIntervals} = require("./backgroundDataTracker.js");
const { getEntriesSince, getEntriesBetweenMoments, getEntriesInInterval } = require("./databaseInterface");
const { getProducedEnergyToday } = require("./databaseDataAdapter");

const app = express();
const PORT = 3001;

app.use(
    cors({
        origin: "*"
    })
);

app.listen(PORT, () => {
    console.log("it's alive on http://localhost:" + PORT);
})

app.get('/general', (req, res) => {
    
    inverterInterface.getInverterJson().then((value) => {
        res.status(200).send(value);
    });

});

app.get('/history', (req, res) => {

    const beginning = req.query.beginning;
    const end = req.query.end;
    const intervalLength = req.query.intervalLength;

    if(!!beginning && !!end && !intervalLength){
        //We have a beginning and end timestamp

        const beginningForDB = Math.round(beginning / 1000);
        const endForDB = Math.round(end / 1000);

        console.log("getting betweenIntervals" + beginningForDB + " " + endForDB + " current time: " + Date.now());
        getEntriesBetweenMoments(beginningForDB, endForDB).then((value) => {
            res.status(200).send(value);
        }, (reason) => {
            console.error(reason);
            res.status(500).send(reason);
        });


        return;
    }

    if(!!beginning && !end && !intervalLength){
        //We have only a beginning timestamp
        const beginningForDB = Math.round(beginning / 1000);

        console.log("getting since" + beginningForDB);
        getEntriesSince(beginningForDB).then((value) => {
            res.status(200).send(value);
        }, (reason) => {
            console.error(reason);
            res.status(500).send(reason);
        });

        return;
    }

    if(!!beginning && !end & !!intervalLength){
        //We have a beginning timestamp with an interval

        const beginningForDB = Math.round(beginning / 1000);
        const intervalLengthForDB = Math.round(intervalLength / 1000);

        console.log("getting in Interval" + beginningForDB + " " + intervalLengthForDB);
        getEntriesInInterval(beginningForDB, intervalLengthForDB).then((value) => {
            res.status(200).send(value);
        }, (reason) => {
            console.error(reason);
            res.status(500).send(reason);
        });

        return;

    }

    console.error("/history call's arguments are malformed." + beginning + " " + end + " " + intervalLength + " " + !!beginning + " " + !!end + " " + !!intervalLength);

});

app.get('/producedPower', (req, res) => {

    const timeframe = req.query.timeframe;
    
    let getDataPromise;
    switch(timeframe){

        case "today":
            getDataPromise = getProducedEnergyToday();
            break;
        
        case "month":
            break;
        
        case "year":
            break;

        default:
            console.error("wrong timeframe parameter!");
            res.status(400).send("Wrong timeframe parameter! ");
            return;

    }

    getDataPromise.then((value) => {
        res.status(200).send(value);
    }, (reason) => {
        res.status(500).send(reason);
    })

});

prepareForTracking().then(() => {
    startAllIntervals();
}, (reason) => {
    console.error(reason);
});