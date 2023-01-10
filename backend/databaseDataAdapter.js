const { getEntriesInInterval, solarPowerColumnName } = require("./databaseInterface");

const inverterDataTrackingTimeInterval = Number.parseInt(process.env.INVERTER_DATA_TRACKING_INTERVAL);

function getProducedEnergyToday(){

    const resultPromise = new Promise((resolve, reject) => {

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const firstMomentTimestamp = Math.round(startOfDay / 1000);
    
        getProducedEnergySince(firstMomentTimestamp).then((value) => {
            resolve(value);
        }, (reason) => {
            reject(reason);
        });

    });

    return resultPromise;

}
exports.getProducedEnergyToday = getProducedEnergyToday;

function getProducedEnergyThisMonth(){

    const resultPromise = new Promise((resolve, reject) => {

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstMomentTimestamp = Math.round(startOfMonth / 1000);
    
        getProducedEnergySince(firstMomentTimestamp).then((value) => {
            resolve(value);
        }, (reason) => {
            reject(reason);
        });

    });

    return resultPromise;

    
}
exports.getProducedEnergyThisMonth = getProducedEnergyThisMonth;

function getProducedEnergyThisYear(){

    const resultPromise = new Promise((resolve, reject) => {

        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const firstMomentTimestamp = Math.round(startOfYear / 1000);
    
        getProducedEnergySince(firstMomentTimestamp).then((value) => {
            resolve(value);
        }, (reason) => {
            reject(reason);
        });

    });

    return resultPromise;

}
exports.getProducedEnergyThisYear = getProducedEnergyThisYear;


function getProducedEnergySince(firstMoment){

    const nowTimestamp = Math.round(Date.now() / 1000);
    return getProducedEnergy(firstMoment, nowTimestamp);

}

function getProducedEnergy(firstMoment, lastMoment){

    return getEnergy(firstMoment, lastMoment, solarPowerColumnName);

}

exports.getProducedEnergy = getProducedEnergy;


function getEnergy(firstMoment, lastMoment, columnName){

    const resultPromise = new Promise((resolve, reject) => {

        getEntriesInInterval(firstMoment, lastMoment, columnName).then((value) => {

            // resolve(value);
            let totalPower = 0;

            for(entry of value){
                
                totalPower += entry[columnName] / (inverterDataTrackingTimeInterval / 1000);
                
            }

            totalPower = Math.round(totalPower);
            const responseObject = {
                producedPower: totalPower
            }

            resolve(responseObject);
            
        }, (reason) => {
            reject(reason);
        });

    });

    return resultPromise;

}
