//this is a unit test for inverterInterface.js and at the same time an integration test for inverterInterface with datafetcher.

const { getInverterJson } = require("../inverterInterface");

describe('inverterInterface unit test', () => {

    it("gets inverter json data in the right format", () => {

        return getInverterJson().then((value) => {

            expect(Number.parseInt(value.solarPower)).toBeGreaterThanOrEqual(0);
            expect(Number.parseInt(value.housePower)).toBeDefined();
            expect(Number.parseInt(value.gridPower)).toBeDefined();
            expect(Number.parseInt(value.batteryPower)).toBeDefined();
            expect(Number.parseInt(value.batteryCharge)).toBeGreaterThanOrEqual(0);
            expect(Number.parseInt(value.batteryCapacity)).toBeGreaterThanOrEqual(0);

        });

    });

});