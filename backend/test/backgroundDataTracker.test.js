//this is a unit test for backgroundDataTracker

const { prepareForTracking, startAllIntervals, stopAllIntervals } = require("../backgroundDataTracker");

describe('backgroundDataTracker unit test', () => {

    let inverterInterval;

    it('prepares for tracking', () => {

        return expect(prepareForTracking()).resolves.toBe(true);

    });

    it('starts all intervals', () => {

        const expectedTimeOut = process.env.INVERTER_DATA_TRACKING_INTERVAL;
        const interval = startAllIntervals();
        inverterInterval = interval;

        expect(interval['_idleTimeout']).toBe(Number.parseInt(expectedTimeOut));
        expect(interval['_destroyed']).toBe(false);

    });

    it('stops all intervals', () => {

        stopAllIntervals();

        expect(inverterInterval['_destroyed']).toBe(true);

    });

});