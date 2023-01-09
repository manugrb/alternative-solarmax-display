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