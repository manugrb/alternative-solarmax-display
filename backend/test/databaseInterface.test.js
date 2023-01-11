//This is a unit test for databaseInterface


const { connect, createNewInverterEntry, tearDownConnection, getEntriesInInterval, setInverterDataTableName, getEntriesBetweenMoments, getEntriesOfLastTime, getEntriesSince } = require("../databaseInterface");

describe('databaseInterface unit test', () => {

    it('sets the tableName', () => {
        expect(setInverterDataTableName("testInverterTable")).toBe("testInverterTable");
    });

    it('connects to database', () => {

        return expect(connect()).resolves.toBe(true);

    });

    it('inserts new entry into database', () => {

        const dataObject = {
            solarPower: 0,
            housePower: 0,
            gridPower: 0,
            batteryPower: 0,
            batteryCharge: 0,
            batteryCapacity: 0
        }

        return createNewInverterEntry(dataObject).then((value) => {
            expect(value.affectedRows).toBe(1);
        });

    });

    it('does not allow wrong data to get into the database', () => {

        const dataObject = {
            solarPower: -1,
            housePower: -1,
            gridPower: -1,
            batteryPower: -1,
            batteryCharge: -1,
            batteryCapacity: -1
        }

        return expect(createNewInverterEntry(dataObject)).rejects.toBeDefined();
    });

    describe('databaseInterface data getter functions', () => {

        let responseTimestamp;

        beforeEach(() => {

            const dataObject = {
                solarPower: 0,
                housePower: 0,
                gridPower: 0,
                batteryPower: 0,
                batteryCharge: 0,
                batteryCapacity: 0
            }
    
            return createNewInverterEntry(dataObject).then((value) => {
                responseTimestamp = Date.now();
            });

        });

        it('selects right entries in interval', () => {

            const firstMoment = Math.round((responseTimestamp - 2500) / 1000); //get all entries of the last 3 sec after receiving the response

            return getEntriesInInterval(firstMoment, 3).then((value) => {
                console.log(value);
                //might interfere with the background task when running
                expect(value.length).toBe(2); // we're checking to see 2 entries because we inserted 2 times 
            });

        });

        it('selects right entries between moments', () => {

            const firstMoment = Math.round((responseTimestamp - 2500) / 1000);
            const lastMoment = Math.round(Date.now() / 1000);

            return getEntriesBetweenMoments(firstMoment, lastMoment).then((value) => {
                expect(value.length).toBe(3);
             });

        });

        it('selects right entries of last x time', () => {

            return getEntriesOfLastTime(4).then((value) => {
                expect(value.length).toBe(4);
            });

        });

        it('selects right entries since x', () => {

            const firstMoment = Math.round((responseTimestamp - 2500) / 1000);

            return getEntriesSince(firstMoment).then((value) => {
                expect(value.length).toBe(5);
            });

        });

    });

    it('tears down database', () => {

        tearDownConnection();

        const dataObject = {
            solarPower: 0,
            housePower: 0,
            gridPower: 0,
            batteryPower: 0,
            batteryCharge: 0,
            batteryCapacity: 0
        }

        return expect(createNewInverterEntry(dataObject)).rejects.toBeDefined();

    });

});