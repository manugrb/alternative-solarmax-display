const connect = require("./databaseInterface.js");

let inverterDataTrackingInterval;

const inverterDataTrackingTimeInterval = process.env.INVERTER_DATA_TRACKING_INTERVAL;

function prepareForTracking(){
    const preparePromise = new Promise((resolve, reject) => {
        connect.connect().then((value) => {
            resolve();
        }, (reason) => {
            reject();
        });
    });

    return preparePromise;
}

function startAllIntervals(){
    startInverterDataTrackingInterval();
}

function stopAllIntervals(){
    stopInverterDataTrackingInterval();
}

function startInverterDataTrackingInterval(){
    inverterDataTrackingInterval = setInterval(() => {
        console.log('tracking' + inverterDataTrackingTimeInterval);
    }, Number.parseInt(inverterDataTrackingTimeInterval));
}

function stopInverterDataTrackingInterval(){

    clearInterval(inverterDataTrackingInterval);

}

module.exports = {
    prepareForTracking,
    startAllIntervals
}