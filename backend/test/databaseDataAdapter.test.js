//this is a unit test for databaseDataAdapter and at the same time an integration test for databaseDataAdapter and databaseInterface.
//To really be able to use this test the test table in your database should be filled with some test data, that is distributed over different months and years.

const { getProducedEnergyToday, getProducedEnergyThisMonth, getProducedEnergyThisYear, getUsedEnergyToday, getUsedEnergyThisMonth, getUsedEnergyThisYear } = require("../databaseDataAdapter");
const { setInverterDataTableName, connect, getEntriesSince, solarPowerColumnName, housePowerColumnName } = require("../databaseInterface");

describe('databaseDataAdapter unit test', () => {

    beforeAll(() => {

        setInverterDataTableName("testInverterTable");

        return connect();

    });

    it("gets the correct value for today's produced energy", () => {

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const timestamp = startOfDay / 1000;
     
        const entriesPromise = getEntriesSince(timestamp, solarPowerColumnName);

        entriesResponse = entriesPromise.then((value) => {
            return computeTotalEnergy(value, solarPowerColumnName);
        });

        todaysEnergyPromise = getProducedEnergyToday();

        return Promise.all([entriesResponse, todaysEnergyPromise]).then((values) => {

            const absDifference = Math.abs(values[0] - values[1]);
            expect(absDifference).toBeLessThanOrEqual(5);  //the values don't need to be exactly the same it is enough when they are close.

        });

    });

    it("gets the correct value for this month's produced energy", () => {

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const timestamp = startOfMonth / 1000;
     
        const entriesPromise = getEntriesSince(timestamp, solarPowerColumnName);

        entriesResponse = entriesPromise.then((value) => {
            return computeTotalEnergy(value, solarPowerColumnName);
        });

        thisMonthsEnergyPromise = getProducedEnergyThisMonth();

        return Promise.all([entriesResponse, thisMonthsEnergyPromise]).then((values) => {

            const absDifference = Math.abs(values[0] - values[1]);
            expect(absDifference).toBeLessThanOrEqual(5);

        });

    });

    it("gets the correct value for this year's produced energy", () => {

        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const timestamp = startOfYear / 1000;
     
        const entriesPromise = getEntriesSince(timestamp, solarPowerColumnName);

        entriesResponse = entriesPromise.then((value) => {
            return computeTotalEnergy(value, solarPowerColumnName);
        });

        thisYearsEnergyPromise = getProducedEnergyThisYear();

        return Promise.all([entriesResponse, thisMonthsEnergyPromise]).then((values) => {

            const absDifference = Math.abs(values[0] - values[1]);
            expect(absDifference).toBeLessThanOrEqual(5);

        });
        
    });


    it("gets the correct value for today's used energy", () => {

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const timestamp = startOfDay / 1000;
     
        const entriesPromise = getEntriesSince(timestamp, housePowerColumnName);

        entriesResponse = entriesPromise.then((value) => {
            return computeTotalEnergy(value, housePowerColumnName);
        });

        todaysEnergyPromise = getUsedEnergyToday();

        return Promise.all([entriesResponse, todaysEnergyPromise]).then((values) => {

            const absDifference = Math.abs(values[0] - values[1]);
            expect(absDifference).toBeLessThanOrEqual(5);

        });

    });

    it("gets the correct value for this month's used energy", () => {

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const timestamp = startOfMonth / 1000;
     
        const entriesPromise = getEntriesSince(timestamp, housePowerColumnName);

        entriesResponse = entriesPromise.then((value) => {
            return computeTotalEnergy(value, housePowerColumnName);
        });

        thisMonthsEnergyPromise = getUsedEnergyThisMonth();

        return Promise.all([entriesResponse, thisMonthsEnergyPromise]).then((values) => {

            const absDifference = Math.abs(values[0] - values[1]);
            expect(absDifference).toBeLessThanOrEqual(5);

        });

    });

    it("gets the correct value for this year's used energy", () => {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const timestamp = startOfYear / 1000;
     
        const entriesPromise = getEntriesSince(timestamp, housePowerColumnName);

        entriesResponse = entriesPromise.then((value) => {
            return computeTotalEnergy(value, housePowerColumnName);
        });

        thisYearsEnergyPromise = getUsedEnergyThisYear();

        return Promise.all([entriesResponse, thisYearsEnergyPromise]).then((values) => {

            const absDifference = Math.abs(values[0] - values[1]);
            expect(absDifference).toBeLessThanOrEqual(5);

        });
    });


    function computeTotalEnergy(objectArray, key){

        let total = 0;
        const intervalLength = Math.round(Number.parseInt(process.env.INVERTER_DATA_TRACKING_INTERVAL) / 1000);
        const checksPerHour = 3600 / intervalLength;

        for(object of objectArray){
            total += object[key] / checksPerHour;
        }

        return Math.round(total);

    }

});