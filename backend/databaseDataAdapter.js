const { solarPowerColumnName, housePowerColumnName, getEntriesBetweenMoments, gridPowerColumnName } = require("./databaseInterface");

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
    return getSomeEnergyThisYear(housePowerColumnName);
}
exports.getUsedEnergyThisYear = getUsedEnergyThisYear;


function getBoughtEnergyToday(){
    return getSomeEnergyToday(gridPowerColumnName, (entryValue) => {
        return (entryValue < 0);
    }).then((value) => {
        return Math.abs(value);
    });
}
exports.getBoughtEnergyToday = getBoughtEnergyToday;

function getBoughtEnergyThisMonth(){
    return getSomeEnergyThisMonth(gridPowerColumnName, (entryValue) => {
        return (entryValue < 0);
    }).then((value) => {
        return Math.abs(value);
    });
}
exports.getBoughtEnergyThisMonth = getBoughtEnergyThisMonth;

function getBoughtEnergyThisYear(){
    return getSomeEnergyThisYear(gridPowerColumnName, (entryValue) => {
        return (entryValue < 0);
    }).then((value) => {
        return Math.abs(value);
    });
}
exports.getBoughtEnergyThisYear = getBoughtEnergyThisYear;


function getSoldEnergyToday(){
    return getSomeEnergyToday(gridPowerColumnName, (entryValue) => {
        return (entryValue > 0);
    });
}
exports.getSoldEnergyToday = getSoldEnergyToday;

function getSoldEnergyThisMonth(){
    return getSomeEnergyThisMonth(gridPowerColumnName, (entryValue) => {
        return (entryValue > 0);
    });
}
exports.getSoldEnergyThisMonth = getSoldEnergyThisMonth;

function getSoldEnergyThisYear(){
    return getSomeEnergyThisYear(gridPowerColumnName, (entryValue) => {
        return (entryValue > 0);
    });
}
exports.getSoldEnergyThisYear = getSoldEnergyThisYear;

function getSomeEnergyToday(columnName, checkerFunction = (arg) => {return true}){

    const resultPromise = new Promise((resolve, reject) => {

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const firstMomentTimestamp = Math.round(startOfDay / 1000);
    
        getSomeEnergySince(firstMomentTimestamp, columnName, checkerFunction).then((value) => {
            resolve(value);
        }, (reason) => {
            reject(reason);
        });

    });

    return resultPromise;

}

function getSomeEnergyThisMonth(columnName,  checkerFunction = (arg) => {return true}){

    const resultPromise = new Promise((resolve, reject) => {

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstMomentTimestamp = Math.round(startOfMonth / 1000);
    
        getSomeEnergySince(firstMomentTimestamp, columnName, checkerFunction).then((value) => {
            resolve(value);
        }, (reason) => {
            reject(reason);
        });

    });

    return resultPromise;

}

function getSomeEnergyThisYear(columnName,  checkerFunction = (arg) => {return true}){

    const resultPromise = new Promise((resolve, reject) => {

        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const firstMomentTimestamp = Math.round(startOfYear / 1000);
    
        getSomeEnergySince(firstMomentTimestamp, columnName, checkerFunction).then((value) => {
            resolve(value);
        }, (reason) => {
            reject(reason);
        });

    });

    return resultPromise;

}

function getSomeEnergySince(firstMoment, columnName,  checkerFunction){

    const nowTimestamp = Math.round(Date.now() / 1000);
    return getEnergy(firstMoment, nowTimestamp, columnName, checkerFunction);

}

function getEnergy(firstMoment, lastMoment, columnName, checkerFunction){

    const resultPromise = new Promise((resolve, reject) => {

        getEntriesBetweenMoments(firstMoment, lastMoment, columnName).then((value) => {

            // resolve(value);
            let totalPower = 0;
            
            for(entry of value){
                
                const entryValue = entry[columnName];
                if(checkerFunction(entryValue)){
                    totalPower += entry[columnName] / (inverterDataTrackingTimeInterval / 1000);
                }
                
            }

            totalPower = Math.round(totalPower);
            
            resolve(totalPower);
            
        }, (reason) => {
            reject(reason);
        });

    });

    return resultPromise;

}
