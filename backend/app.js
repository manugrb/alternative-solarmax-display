const express = require("express");
const cors = require("cors");
const inverterInterface = require("./inverterInterface");
const {prepareForTracking, startAllIntervals} = require("./backgroundDataTracker.js");
const { getEntriesSince, getEntriesBetweenMoments, getEntriesInInterval } = require("./databaseInterface");
const { getProducedEnergyToday, getProducedEnergyThisMonth, getProducedEnergyThisYear, getUsedEnergyToday, getUsedEnergyThisMonth, getUsedEnergyThisYear, getBoughtEnergyToday, getBoughtEnergyThisMonth, getBoughtEnergyThisYear, getSoldEnergyToday, getSoldEnergyThisMonth, getSoldEnergyThisYear } = require("./databaseDataAdapter");
const { calculateCO2Equivalent, calculateBalance } = require("./impactInterface");

const app = express();
const PORT = Number.parseInt(process.env.API_PORT);

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
            getDataPromise = getProducedEnergyThisMonth();
            break;
        
        case "year":
            getDataPromise = getProducedEnergyThisYear();
            break;

        default:
            console.error("wrong timeframe parameter!");
            res.status(400).send("Wrong timeframe parameter! ");
            return;

    }

    getDataPromise.then((value) => {
        const responseObject = {
            producedEnergy: value
        }
        res.status(200).send(responseObject);
    }, (reason) => {
        res.status(500).send(reason);
    });

});

app.get('/usedPower', (req, res) => {

    const timeframe = req.query.timeframe;
    
    let getDataPromise;
    switch(timeframe){

        case "today":
            getDataPromise = getUsedEnergyToday();
            break;
        
        case "month":
            getDataPromise = getUsedEnergyThisMonth();
            break;
        
        case "year":
            getDataPromise = getUsedEnergyThisYear();
            break;

        default:
            console.error("wrong timeframe parameter!");
            res.status(400).send("Wrong timeframe parameter! ");
            return;

    }

    getDataPromise.then((value) => {
        const responseObject = {
            usedEnergy: value
        }
        res.status(200).send(responseObject);
    }, (reason) => {
        res.status(500).send(reason);
    })

});

app.get('/boughtPower', (req, res) => {

    const timeframe = req.query.timeframe;
    
    let getDataPromise;
    switch(timeframe){

        case "today":
            getDataPromise = getBoughtEnergyToday();
            break;
        
        case "month":
            getDataPromise = getBoughtEnergyThisMonth();
            break;
        
        case "year":
            getDataPromise = getBoughtEnergyThisYear();
            break;

        default:
            console.error("wrong timeframe parameter!");
            res.status(400).send("Wrong timeframe parameter! ");
            return;

    }

    getDataPromise.then((value) => {
        const responseObject = {
            boughtEnergy: value
        }
        res.status(200).send(responseObject);
    }, (reason) => {
        res.status(500).send(reason);
    });

});

app.get('/soldPower', (req, res) => {

    const timeframe = req.query.timeframe;
    
    let getDataPromise;
    switch(timeframe){

        case "today":
            getDataPromise = getSoldEnergyToday();
            break;
        
        case "month":
            getDataPromise = getSoldEnergyThisMonth();
            break;
        
        case "year":
            getDataPromise = getSoldEnergyThisYear();
            break;

        default:
            console.error("wrong timeframe parameter!");
            res.status(400).send("Wrong timeframe parameter! ");
            return;

    }

    getDataPromise.then((value) => {
        const responseObject = {
            soldEnergy: value
        }
        res.status(200).send(responseObject);
    }, (reason) => {
        res.status(500).send(reason);
    });

});

app.get('/savedCO2', (req, res) => {

    const timeframe = req.query.timeframe;

    let getDataPromise;

    switch(timeframe){

        case "today":
            getDataPromise = getProducedEnergyToday();
            break;
        case "month":
            getDataPromise = getProducedEnergyThisMonth();
            break;
        
        case "year":
            getDataPromise = getProducedEnergyThisYear();
            break;

        default:
            console.error("wrong timeframe parameter!");
            res.status(400).send("Wrong timeframe parameter! ");
            return;

    }

    getDataPromise.then((value) => {

        const producedEnergy = value;
        co2Equivalent = calculateCO2Equivalent(producedEnergy);

        const responseObject = {
            savedCO2: co2Equivalent
        }
        res.status(200).send(responseObject);
    }, (reason) => {
        res.status(500).send(reason);
    });

});

app.get('/balance', (req, res) => {

    const timeframe = req.query.timeframe;

    let getBoughtDataPromise;
    let getSoldDataPromise;

    switch(timeframe){

        case "today":
            getBoughtDataPromise = getBoughtEnergyToday();
            getSoldDataPromise = getSoldEnergyToday();
            break;
        case "month":
            getBoughtDataPromise = getBoughtEnergyThisMonth();
            getSoldDataPromise = getSoldEnergyThisMonth();
            break;
        
        case "year":
            getBoughtDataPromise = getBoughtEnergyThisYear();
            getSoldDataPromise = getSoldEnergyThisYear();
            break;

        default:
            console.error("wrong timeframe parameter!");
            res.status(400).send("Wrong timeframe parameter! ");
            return;

    }

    Promise.all([getBoughtDataPromise, getSoldDataPromise]).then((values) => {

        const boughtEnergy = values[0];
        const soldEnergy = values[1];

        const balance = calculateBalance(boughtEnergy, soldEnergy);

        const responseObject = {
            balance: balance
        }
        res.status(200).send(responseObject);
    }, (reason) => {
        res.status(500).send(reason);
    });

});

prepareForTracking().then(() => {
    startAllIntervals();
}, (reason) => {
    console.error(reason);
});