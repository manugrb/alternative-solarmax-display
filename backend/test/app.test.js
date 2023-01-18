//this is a unit test for app.js it is also an integration test for app.js, databaseInterface.js and databasedataAdapter.js. (It is maybe even
//an end-to-end-test of the whole backend if you want to call it that).

const { default: fetch } = require("node-fetch");
const { getProducedEnergyToday, getProducedEnergyThisMonth, getProducedEnergyThisYear, getUsedEnergyToday, getUsedEnergyThisMonth, getUsedEnergyThisYear, getBoughtEnergyThisMonth, getBoughtEnergyToday, getBoughtEnergyThisYear, getSoldEnergyToday, getSoldEnergyThisMonth, getSoldEnergyThisYear } = require("../databaseDataAdapter");
const { setInverterDataTableName, getEntriesBetweenMoments, connect, getEntriesInInterval, getEntriesSince } = require("../databaseInterface");
const { calculateCO2Equivalent, calculateBalance, calculateSystemRevenue } = require("../impactInterface");

describe("app.js unit test", () => {

    const PORT = process.env.API_PORT;

    beforeAll(() => {
        // setInverterDataTableName("testInverterTable");
        return connect();
    });

    it("returns data in the right format when requested with /general", () => {

        const url = "http://localhost:" + PORT + "/general";

        const responsePromise = fetch(url).then((value) => {

            return value.json();

        });

        return responsePromise.then((value) => {

            expect(Number.parseInt(value.solarPower)).toBeGreaterThanOrEqual(0);
            expect(Number.parseInt(value.housePower)).toBeDefined();
            expect(Number.parseInt(value.gridPower)).toBeDefined();
            expect(Number.parseInt(value.batteryPower)).toBeDefined();
            expect(Number.parseInt(value.batteryCharge)).toBeGreaterThanOrEqual(0);
            expect(Number.parseInt(value.batteryCapacity)).toBeGreaterThanOrEqual(0);

        });

    });

    it("returns correct energy value between moments", () => {

        const firstMoment = Date.now() - 10 * 60 * 1000;
        const lastMoment = Date.now();
        const url = "http://localhost:" + PORT + "/history?beginning=" + firstMoment + "&end=" + lastMoment;

        const responsePromise = fetch(url).then((value) => {
            return value.json();
        });

        const expectedValuePromise = getEntriesBetweenMoments(Math.round(firstMoment / 1000), Math.round(lastMoment / 1000));

        return Promise.all([responsePromise, expectedValuePromise]).then((values) => {

            expect(values[0].length).toBe(values[1].length);

        });

    });

    it("returns correct energy value in interval", () => {

        const firstMoment = Date.now() - 10 * 60 * 1000;
        const intervalLength = 10 * 60 * 1000;
        const url = "http://localhost:" + PORT + "/history?beginning=" + firstMoment + "&intervalLength=" + intervalLength;

        const responsePromise = fetch(url).then((value) => {
            return value.json();
        });

        const expectedValuePromise = getEntriesInInterval(Math.round(firstMoment / 1000), Math.round(intervalLength / 1000));

        return Promise.all([responsePromise, expectedValuePromise]).then((values) => {
            expect(values[0].length).toBe(values[1].length);
        });

    });

    it("returns correct energy value since", () => {

        const firstMoment = Date.now() - 10 * 60 * 1000;
        const url = "http://localhost:" + PORT + "/history?beginning=" + firstMoment;

        const responsePromise = fetch(url).then((value) => {
            return value.json();
        });

        const expectedValuePromise = getEntriesSince(Math.round(firstMoment / 1000));

        return Promise.all([responsePromise, expectedValuePromise]).then((values) => {
            expect(values[0].length).toBe(values[1].length);
        });

    });


    it("returns value for today's produced energy", () => {

        const url = "http://localhost:" + PORT + "/producedPower?timeframe=today";

        const firstResponsePromise = fetch(url).then((value) => {
            return value.json();
        });
        const responsePromise = firstResponsePromise.then((value) => {
            return value.producedEnergy;
        })

        const expectedValuePromise = getProducedEnergyToday();

        return Promise.all([responsePromise, expectedValuePromise]).then((values) => {
            expect(values[0]).toBe(values[1]);
        });

    });

    it("returns value for this month's produced energy", () => {

        const url = "http://localhost:" + PORT + "/producedPower?timeframe=month";

        const firstResponsePromise = fetch(url).then((value) => {
            return value.json();
        });
        const responsePromise = firstResponsePromise.then((value) => {
            return value.producedEnergy;
        })

        const expectedValuePromise = getProducedEnergyThisMonth();

        return Promise.all([responsePromise, expectedValuePromise]).then((values) => {
            expect(values[0]).toBe(values[1]);
        });

    });

    it("returns value for this year's produced energy", () => {

        const url = "http://localhost:" + PORT + "/producedPower?timeframe=year";

        const firstResponsePromise = fetch(url).then((value) => {
            return value.json();
        });
        const responsePromise = firstResponsePromise.then((value) => {
            return value.producedEnergy;
        })

        const expectedValuePromise = getProducedEnergyThisYear();

        return Promise.all([responsePromise, expectedValuePromise]).then((values) => {
            expect(values[0]).toBe(values[1]);
        });

    });


    it("returns value for today's used energy", () => {

        const url = "http://localhost:" + PORT + "/usedPower?timeframe=today";

        const firstResponsePromise = fetch(url).then((value) => {
            return value.json();
        });
        const responsePromise = firstResponsePromise.then((value) => {
            return value.usedEnergy;
        })

        const expectedValuePromise = getUsedEnergyToday()

        return Promise.all([responsePromise, expectedValuePromise]).then((values) => {
            expect(values[0]).toBe(values[1]);
        });

    });

    it("returns value for this month's used energy", () => {

        const url = "http://localhost:" + PORT + "/usedPower?timeframe=month";

        const firstResponsePromise = fetch(url).then((value) => {
            return value.json();
        });
        const responsePromise = firstResponsePromise.then((value) => {
            return value.usedEnergy;
        })

        const expectedValuePromise = getUsedEnergyThisMonth();

        return Promise.all([responsePromise, expectedValuePromise]).then((values) => {
            expect(values[0]).toBe(values[1]);
        });

    });

    it("returns value for this year's used energy", () => {

        const url = "http://localhost:" + PORT + "/usedPower?timeframe=year";

        const firstResponsePromise = fetch(url).then((value) => {
            return value.json();
        });
        const responsePromise = firstResponsePromise.then((value) => {
            return value.usedEnergy;
        })

        const expectedValuePromise = getUsedEnergyThisYear();

        return Promise.all([responsePromise, expectedValuePromise]).then((values) => {
            expect(values[0]).toBe(values[1]);
        });

    });

    it("returns value for today's bought energy", () => {

        const url = "http://localhost:" + PORT + "/boughtPower?timeframe=today";

        const firstResponsePromise = fetch(url).then((value) => {
            return value.json();
        });
        const responsePromise = firstResponsePromise.then((value) => {
            return value.boughtEnergy;
        })

        const expectedValuePromise = getBoughtEnergyToday()

        return Promise.all([responsePromise, expectedValuePromise]).then((values) => {
            expect(values[0]).toBe(values[1]);
        });

    });

    it("returns value for this month's bought energy", () => {

        const url = "http://localhost:" + PORT + "/boughtPower?timeframe=month";

        const firstResponsePromise = fetch(url).then((value) => {
            return value.json();
        });
        const responsePromise = firstResponsePromise.then((value) => {
            return value.boughtEnergy;
        })

        const expectedValuePromise = getBoughtEnergyThisMonth();

        return Promise.all([responsePromise, expectedValuePromise]).then((values) => {
            expect(values[0]).toBe(values[1]);
        });

    });

    it("returns value for this year's bought energy", () => {

        const url = "http://localhost:" + PORT + "/boughtPower?timeframe=year";

        const firstResponsePromise = fetch(url).then((value) => {
            return value.json();
        });
        const responsePromise = firstResponsePromise.then((value) => {
            return value.boughtEnergy;
        })

        const expectedValuePromise = getBoughtEnergyThisYear();

        return Promise.all([responsePromise, expectedValuePromise]).then((values) => {
            expect(values[0]).toBe(values[1]);
        });

    });

    it("returns value for today's sold energy", () => {

        const url = "http://localhost:" + PORT + "/soldPower?timeframe=today";

        const firstResponsePromise = fetch(url).then((value) => {
            return value.json();
        });
        const responsePromise = firstResponsePromise.then((value) => {
            return value.soldEnergy;
        })

        const expectedValuePromise = getSoldEnergyToday()

        return Promise.all([responsePromise, expectedValuePromise]).then((values) => {
            expect(values[0]).toBe(values[1]);
        });

    });

    it("returns value for this month's sold energy", () => {

        const url = "http://localhost:" + PORT + "/soldPower?timeframe=month";

        const firstResponsePromise = fetch(url).then((value) => {
            return value.json();
        });
        const responsePromise = firstResponsePromise.then((value) => {
            return value.soldEnergy;
        })

        const expectedValuePromise = getSoldEnergyThisMonth();

        return Promise.all([responsePromise, expectedValuePromise]).then((values) => {
            expect(values[0]).toBe(values[1]);
        });

    });

    it("returns value for this year's sold energy", () => {

        const url = "http://localhost:" + PORT + "/soldPower?timeframe=year";

        const firstResponsePromise = fetch(url).then((value) => {
            return value.json();
        });
        const responsePromise = firstResponsePromise.then((value) => {
            return value.soldEnergy;
        })

        const expectedValuePromise = getSoldEnergyThisYear();

        return Promise.all([responsePromise, expectedValuePromise]).then((values) => {
            expect(values[0]).toBe(values[1]);
        });

    });

    it("returns the right value for the saved CO2", () => {

        const todayUrl = "http://localhost:" + PORT + "/savedCO2?timeframe=today";
        const monthUrl = "http://localhost:" + PORT + "/savedCO2?timeframe=month";
        const yearUrl = "http://localhost:" + PORT + "/savedCO2?timeframe=year";

        const firstTodayResponsePromise = fetch(todayUrl).then((value) => {
            return value.json();
        });

        const firstMonthResponsePromise = fetch(monthUrl).then((value) => {
            return value.json();
        });
        const firstYearResponsePromise = fetch(yearUrl).then((value) => {
            return value.json();
        });

        const todayExpectedValuePromise = getProducedEnergyToday().then((value) => {
            return calculateCO2Equivalent(value);
        });

        const monthExpectedValuePromise = getProducedEnergyThisMonth().then((value) => {
            return calculateCO2Equivalent(value);
        });

        const yearExpectedValuePromise = getProducedEnergyThisYear().then((value) => {
            return calculateCO2Equivalent(value);
        });

        return Promise.all([firstTodayResponsePromise, todayExpectedValuePromise, firstMonthResponsePromise, monthExpectedValuePromise, firstYearResponsePromise, yearExpectedValuePromise]).then((values) => {

            expect(values[0].savedCO2).toBe(values[1]);
            expect(values[2].savedCO2).toBe(values[3]);
            expect(values[4].savedCO2).toBe(values[5]);

        });

    });

    it("returns the right value for balance", () => {

        const todayUrl = "http://localhost:" + PORT + "/balance?timeframe=today";
        const monthUrl = "http://localhost:" + PORT + "/balance?timeframe=month";
        const yearUrl = "http://localhost:" + PORT + "/balance?timeframe=year";

        const firstTodayResponsePromise = fetch(todayUrl).then((value) => {
            return value.json();
        });

        const firstMonthResponsePromise = fetch(monthUrl).then((value) => {
            return value.json();
        });
        const firstYearResponsePromise = fetch(yearUrl).then((value) => {
            return value.json();
        });

        const todayBoughtEnergyPromise = getBoughtEnergyToday();
        const todaySoldEnergyPromise = getSoldEnergyToday();
        const todayExpectedValuePromise = Promise.all([todayBoughtEnergyPromise, todaySoldEnergyPromise]).then((values) => {
            return calculateBalance(values[0], values[1]);
        });

        const monthBoughtEnergyPromise = getBoughtEnergyThisMonth();
        const monthSoldEnergyPromise = getSoldEnergyThisMonth();
        const monthExpectedValuePromise = Promise.all([monthBoughtEnergyPromise, monthSoldEnergyPromise]).then((values) => {
            return calculateBalance(values[0], values[1]);
        });

        const yearBoughtEnergyPromise = getBoughtEnergyThisYear();
        const yearSoldEnergyPromise = getSoldEnergyThisYear();
        const yearExpectedValuePromise = Promise.all([yearBoughtEnergyPromise, yearSoldEnergyPromise]).then((values) => {
            return calculateBalance(values[0], values[1]);
        });

        return Promise.all([firstTodayResponsePromise, todayExpectedValuePromise, firstMonthResponsePromise, monthExpectedValuePromise, firstYearResponsePromise, yearExpectedValuePromise]).then((values) => {

            expect(values[0].balance).toBe(values[1]);
            expect(values[2].balance).toBe(values[3]);
            expect(values[4].balance).toBe(values[5]);

        });

    });

    it("returns the right value for systemRevenue", () => {

        const todayUrl = "http://localhost:" + PORT + "/systemRevenue?timeframe=today";
        const monthUrl = "http://localhost:" + PORT + "/systemRevenue?timeframe=month";
        const yearUrl = "http://localhost:" + PORT + "/systemRevenue?timeframe=year";

        const firstTodayResponsePromise = fetch(todayUrl).then((value) => {
            return value.json();
        });

        const firstMonthResponsePromise = fetch(monthUrl).then((value) => {
            return value.json();
        });
        const firstYearResponsePromise = fetch(yearUrl).then((value) => {
            return value.json();
        });

        const todaySoldEnergyPromise = getSoldEnergyToday();
        const todayProducedEnergyPromise = getProducedEnergyToday();
        const todayExpectedValuePromise = Promise.all([todaySoldEnergyPromise, todayProducedEnergyPromise]).then((values) => {
            return calculateSystemRevenue(values[0], values[1]);
        });

        const monthSoldEnergyPromise = getSoldEnergyThisMonth();
        const monthProducedEnergyPromise = getProducedEnergyThisMonth();
        const monthExpectedValuePromise = Promise.all([monthSoldEnergyPromise, monthProducedEnergyPromise]).then((values) => {
            return calculateSystemRevenue(values[0], values[1]);
        });

        const yearSoldEnergyPromise = getSoldEnergyThisYear();
        const yearProducedEnergyPromise = getProducedEnergyThisYear();
        const yearExpectedValuePromise = Promise.all([yearSoldEnergyPromise, yearProducedEnergyPromise]).then((values) => {
            return calculateSystemRevenue(values[0], values[1]);
        });

        return Promise.all([firstTodayResponsePromise, todayExpectedValuePromise, firstMonthResponsePromise, monthExpectedValuePromise, firstYearResponsePromise, yearExpectedValuePromise]).then((values) => {

            expect(values[0].systemRevenue).toBe(values[1]);
            expect(values[2].systemRevenue).toBe(values[3]);
            expect(values[4].systemRevenue).toBe(values[5]);

        });

    });

});