const { solarPowerColumnName, housePowerColumnName, getEntriesBetweenMoments } = require("./databaseInterface");

const inverterDataTrackingTimeInterval = Number.parseInt(process.env.INVERTER_DATA_TRACKING_INTERVAL);

function getProducedEnergyToday(){
    return getSomeEnergyToday(solarPowerColumnName)
}
exports.getProducedEnergyToday = getProducedEnergyToday;

function getProducedEnergyThisMonth(){
    return getSomeEnergyThisMonth(solarPowerColumnName);
}
exports.getProducedEnergyThisMonth = getProducedEnergyThisMonth;

function getProducedEnergyThisYear(){
    return getSomeEnergyThisYear(solarPowerColumnName);
}
exports.getProducedEnergyThisYear = getProducedEnergyThisYear;

function getUsedEnergyToday(){
    return getSomeEnergyToday(housePowerColumnName);
}
exports.getUsedEnergyToday = getUsedEnergyToday;

function getUsedEnergyThisMonth(){
    return getSomeEnergyThisMonth(housePowerColumnName);
}
exports.getUsedEnergyThisMonth = getUsedEnergyThisMonth;

function getUsedEnergyThisYear(){
    getSomeEnergyThisYear(housePowerColumnName);
}
exports.getUsedEnergyThisYear = getUsedEnergyThisYear;

function getSomeEnergyToday(columnName){

    const resultPromise = new Promise((resolve, reject) => {

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const firstMomentTimestamp = Math.round(startOfDay / 1000);
    
        getSomeEnergySince(firstMomentTimestamp, columnName).then((value) => {
            resolve(value);
        }, (reason) => {
            reject(reason);
        });

    });

    return resultPromise;

}

function getSomeEnergyThisMonth(columnName){

    const resultPromise = new Promise((resolve, reject) => {

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstMomentTimestamp = Math.round(startOfMonth / 1000);
    
        getSomeEnergySince(firstMomentTimestamp, columnName).then((value) => {
            resolve(value);
        }, (reason) => {
            reject(reason);
        });

    });

    return resultPromise;

}

function getSomeEnergyThisYear(columnName){

    const resultPromise = new Promise((resolve, reject) => {

        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const firstMomentTimestamp = Math.round(startOfYear / 1000);
    
        getSomeEnergySince(firstMomentTimestamp, columnName).then((value) => {
            resolve(value);
        }, (reason) => {
            reject(reason);
        });

    });

    return resultPromise;

}

function getSomeEnergySince(firstMoment, columnName){

    const nowTimestamp = Math.round(Date.now() / 1000);
    return getEnergy(firstMoment, nowTimestamp, columnName);

}

function getEnergy(firstMoment, lastMoment, columnName){

    const resultPromise = new Promise((resolve, reject) => {

        getEntriesBetweenMoments(firstMoment, lastMoment, columnName).then((value) => {

            // resolve(value);
            let totalPower = 0;

            for(entry of value){
                
                totalPower += entry[columnName] / (inverterDataTrackingTimeInterval / 1000);
                
            }

            totalPower = Math.round(totalPower);
            
            resolve(totalPower);
            
        }, (reason) => {
            reject(reason);
        });

    });

    return resultPromise;

}
