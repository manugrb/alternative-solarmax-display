const datafetcher = require('./datafetcher.js');

function getInverterJson(){

    const inverterJsonPromise = new Promise((resolve, reject) => {

        datafetcher.getRawInverterData().then((value) => {

            const rawData = value;
            const rawDataPieces = rawData.split("%");

            const solarPower = rawDataPieces[1];
            const housePowerUsage = rawDataPieces[3];
            const gridPower = rawDataPieces[4];
            const batteryPower = rawDataPieces[5];
            const batteryCharge = rawDataPieces[6];
            const batteryCapacity = rawDataPieces[7];

            const inverterJson = {
                "solarPower": solarPower,
                "housePower": housePowerUsage,
                "gridPower": gridPower,
                "batteryPower": batteryPower,
                "batteryCharge": batteryCharge,
                "batteryCapacity": batteryCapacity
            }

            resolve(inverterJson);

        });
    

    });

    return inverterJsonPromise;

}

exports.getInverterJson = getInverterJson;


function getHistoricData(){

    const historicInverterDataPromise = new Promise((resolve, reject) => {

        datafetcher.getRawHistoricInverterData().then((value) => {

            jsonData = JSON.parse(value.trim());

            const solarPower = jsonData[0];
            const housePowerUsage = jsonData[1];
            const gridPower = jsonData[2];
            const batteryPower = jsonData[3];

            const historicJson = {
                "solarPower": solarPower,
                "housePower": housePowerUsage,
                "gridPower": gridPower,
                "batteryPower": batteryPower
            }
            
            resolve(historicJson);

        });

    });

    return historicInverterDataPromise;

}

exports.getHistoricData = getHistoricData;