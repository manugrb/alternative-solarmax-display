const connect = require("./databaseInterface.js");
const { getInverterJson } = require("./inverterInterface.js");

let inverterDataTrackingInterval;

const inverterDataTrackingTimeInterval = process.env.INVERTER_DATA_TRACKING_INTERVAL;

function prepareForTracking(){
    const preparePromise = new Promise((resolve, reject) => {
        connect.connect().then((value) => {
            resolve(value);
        }, (reason) => {
            reject();
        });
    });

    return preparePromise;
}

function startAllIntervals(){
    return startInverterDataTrackingInterval();
}

function stopAllIntervals(){
    return stopInverterDataTrackingInterval();
}

function startInverterDataTrackingInterval(){
    inverterDataTrackingInterval = setInterval(() => {
        console.log('tracking' + inverterDataTrackingTimeInterval);

        getInverterJson().then((value) => {
            
            connect.createNewInverterEntry(value).then(() => {}, (reason) => {
                console.error(reason);
            } );

        });

    }, Number.parseInt(inverterDataTrackingTimeInterval));

    return inverterDataTrackingInterval;
    
}

function stopInverterDataTrackingInterval(){

    clearInterval(inverterDataTrackingInterval);

}

module.exports = {
    prepareForTracking,
    startAllIntervals,
    stopAllIntervals
}