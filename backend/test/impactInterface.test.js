//this is a unit test for imactInterface.js

const dotenv = require("dotenv");
dotenv.config();

const { calculateCO2Equivalent, calculateSpentMoney, calculateSavedMoney, calculateBalance, calculateEarnedMoney } = require("../impactInterface");


describe('impactInterface unit test', () => {

    const electricityPrice = Number.parseFloat(process.env.ENERGY_PRICE_PER_KWH);
    const electricityReward = Number.parseFloat(process.env.ENERGY_REWARD_PER_KWH);
    const co2EmmissionsPerKWh = Number.parseInt(process.env.GRAMS_CO2_PER_KWH);
    const PORT = process.env.API_PORT;

    it('calculates the CO2 equivalent correctly', () => {

        const co2Equivalent = calculateCO2Equivalent(25000);
        const expectedValue = 25 * co2EmmissionsPerKWh;

        expect(co2Equivalent).toBe(expectedValue);

    });

    it('calculates the spent money correctly', () => {

        const spentMoney = calculateSpentMoney(25000);
        const expectedValue = electricityPrice * 25;

        expect(spentMoney).toBe(expectedValue);

    });

    it('calculates the saved money correctly', () => {

        const savedMoney = calculateSavedMoney(25000);
        const expectedValue = electricityPrice * 25;
        const spentMoney = calculateSpentMoney(25000);

        expect(savedMoney).toBe(expectedValue);
        expect(spentMoney).toBe(savedMoney);

    });

    it('calculates the earned money correctly', () => {

        const earnedMoney = calculateEarnedMoney(25000);
        const expectedValue = electricityReward * 25;

        expect(earnedMoney).toBe(expectedValue);

    });

    it('calculates the balance correctly', () => {

        const emptyBalance = calculateBalance(0, 0);
        expect(emptyBalance).toBe(0);

        const nonEmptyBalance = calculateBalance(25000, 25000, 50000);
        const earnedMoney = calculateEarnedMoney(25000);
        const spentMoney = calculateSpentMoney(25000);
        const expectedValue = earnedMoney - spentMoney;

        expect(nonEmptyBalance).toBe(expectedValue);

    });

});