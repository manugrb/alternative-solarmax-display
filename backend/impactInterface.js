//In this file you can find all the functions responsible of calculating the impact of the saved energy

const electricityPrice = Number.parseFloat(process.env.ENERGY_PRICE_PER_KWH);
const electricityReward = Number.parseFloat(process.env.ENERGY_REWARD_PER_KWH);
const co2EmmissionsPerKWh = Number.parseFloat(process.env.GRAMS_CO2_PER_KWH);

function calculateCO2Equivalent(energy){
    return co2EmmissionsPerKWh *  (energy / 1000);
}
exports.calculateCO2Equivalent = calculateCO2Equivalent;

function calculateEarnedMoney(energy){
    return electricityReward * (energy / 1000);
}
exports.calculateEarnedMoney = calculateEarnedMoney;

function calculateSavedMoney(energy){
    return calculateSpendMoney(energy); //the price for the saved energy is the same as the price for the bought energy
}
exports.calculateSavedMoney = calculateSavedMoney;

function calculateSpendMoney(energy){
    return electricityPrice * (energy / 1000);
}
exports.calculateSpendMoney = calculateSpendMoney;
