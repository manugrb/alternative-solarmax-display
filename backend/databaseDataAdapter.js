const { getEntriesInInterval, solarPowerColumnName } = require("./databaseInterface");

const inverterDataTrackingTimeInterval = Number.parseInt(process.env.INVERTER_DATA_TRACKING_INTERVAL);

function getProducedEnergyToday(){

    const resultPromise = new Promise((resolve, reject) => {

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const firstMomentTimestamp = Math.round(startOfDay / 1000);
    
        const nowTimestamp = Math.round(Date.now() / 1000);
    
        getProducedEnergy(firstMomentTimestamp, nowTimestamp).then((value) => {
            resolve(value);
        }, (reason) => {
            reject(reason);
        });

    });

    return resultPromise;

}

exports.getProducedEnergyToday = getProducedEnergyToday;

function getProducedEnergy(firstMoment, lastMoment){

    const resultPromise = new Promise((resolve, reject) => {

        getEntriesInInterval(firstMoment, lastMoment, solarPowerColumnName).then((value) => {

            // resolve(value);
            let totalPower = 0;
            for(entry of value){
                
                totalPower += entry[solarPowerColumnName] / (inverterDataTrackingTimeInterval / 1000);
                
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

exports.getProducedEnergy = getProducedEnergy;