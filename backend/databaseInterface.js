const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const inverterDataTableName = "inverterData";

const solarPowerColumnName = "solarPower";
const housePowerColumnName = "housePower";
const gridPowerColumnName = "gridPower";
const batteryPowerColumnName = "batteryPower";
const batteryChargeColumnName = "batteryCharge";
const batteryCapacityColumnName = "batteryCapacity";

exports.solarPowerColumnName = solarPowerColumnName,
exports.housePowerColumnName = housePowerColumnName,
exports.gridPowerColumnName = gridPowerColumnName,
exports.batteryPowerColumnName = batteryPowerColumnName,
exports.batteryChargeColumnName = batteryChargeColumnName,
exports.batteryCapacityColumnName = batteryCapacityColumnName


const databaseHost = process.env.DATABASEHOST;
const databaseUser = process.env.DATABASEUSER;
const password = process.env.PASSWORD;
const databaseName = process.env.DATABASENAME;

const con = mysql.createConnection({
    host: databaseHost,
    user: databaseUser,
    password: password
});

function connect(){

    const connectionPromise = new Promise((resolve, reject) => {

        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            setupDatabaseConnection().then(() => {
                resolve();
            }, (reason) => {
                reject(reason);
            })
            
        });

    });

    return connectionPromise;

}

exports.connect = connect;

function setupDatabaseConnection(){

    const setupPromise = new Promise((resolve, reject) => {

        const createDBSQL = "CREATE DATABASE IF NOT EXISTS " + databaseName + ";";
        con.query(createDBSQL, function (err, result) {
            if (err){
                reject(err);
                throw err;
            }
            const useDBSQL = "use " + databaseName + ";"
            con.query(useDBSQL, function (err, result) {
                if (err){
                    reject(err);
                    throw err;
                }                
              
                const tableColumns = "time TIMESTAMP,\
                    solarPower SMALLINT UNSIGNED,\
                    housePower SMALLINT,\
                    gridPower SMALLINT,\
                    batteryPower SMALLINT,\
                    batteryCharge SMALLINT UNSIGNED,\
                    batteryCapacity SMALLINT";

                const createTableSQL = "CREATE TABLE IF NOT EXISTS " + inverterDataTableName + " (" + tableColumns  + ");";
                con.query(createTableSQL, function(err, result){
                    if(err){
                        reject(err);
                        throw err;
                    }

                    resolve();

                });

          });
        });

    });

    return setupPromise;

}

function createNewInverterEntry(inverterData){

    const resultPromise = new Promise((resolve, reject) => {

        const solarPower = inverterData.solarPower;
        const housePower = inverterData.housePower;
        const gridPower = inverterData.gridPower;
        const batteryPower = inverterData.batteryPower;
        const batteryCharge = inverterData.batteryCharge;
        const batteryCapacity = inverterData.batteryCapacity;
    
        const newEntrySQL = `INSERT INTO ${inverterDataTableName} (solarPower, housePower, gridPower, batteryPower, batteryCharge, batteryCapacity) VALUES (${solarPower}, ${housePower}, ${gridPower}, ${batteryPower}, ${batteryCharge}, ${batteryCapacity});`
    
        con.query(newEntrySQL, function(err, result){
            if(err){
                reject(err);
                throw err;
            }
    
            resolve(result);
    
        });
        
    });

    return resultPromise;

}

exports.createNewInverterEntry = createNewInverterEntry;


function getEntriesInInterval(firstMoment, intervalLength, selection = "*"){

    const resultPromise = new Promise((resolve, reject) => {

        const selectEntriesSQL = `SELECT ${selection} FROM ${inverterDataTableName} WHERE time > FROM_UNIXTIME(${firstMoment}) AND time < DATE_ADD(FROM_UNIXTIME(${firstMoment}), INTERVAL ${intervalLength} SECOND);`;
        console.log(selectEntriesSQL);
    
        con.query(selectEntriesSQL, function(err, result){
            if(err){
                reject(err);
                throw err;
            }
    
            resolve(result);

        });

    });

    return resultPromise;

}

exports.getEntriesInInterval = getEntriesInInterval;

function getEntriesBetweenMoments(firstMoment, lastMoment, selection = "*"){

    const resultPromise = new Promise((resolve, reject) => {

        const selectEntriesSQL = `SELECT ${selection} FROM ${inverterDataTableName} WHERE time > FROM_UNIXTIME(${firstMoment}) AND time < FROM_UNIXTIME(${lastMoment});`;
        console.log(selectEntriesSQL);
    
        con.query(selectEntriesSQL, function(err, result){
            if(err){
                reject(err);
                throw err;
            }
    
            resolve(result);

        });

    });

    return resultPromise;

}

exports.getEntriesBetweenMoments = getEntriesBetweenMoments;


function getEntriesOfLastTime(intervalLength, selection = "*"){

    const resultPromise = new Promise((resolve, reject) => {

        const selectEntriesSQL = `SELECT ${selection} FROM ${inverterDataTableName} WHERE time > DATE_SUB(NOW()), INTERVAL ${intervalLength} SECOND);`;
        console.log(selectEntriesSQL);
    
        con.query(selectEntriesSQL, function(err, result){
            if(err){
                reject(err);
                throw err;
            }
    
            resolve(result);

        });

    });

    return resultPromise;

}

exports.getEntriesOfLastTime = getEntriesOfLastTime;


function getEntriesSince(firstMoment, selection = "*"){

    const resultPromise = new Promise((resolve, reason) => {
        
        const selectEntriesSQL = `SELECT ${selection} FROM ${inverterDataTableName} WHERE time > FROM_UNIXTIME(${firstMoment}) AND time < NOW();`;
        console.log(selectEntriesSQL);
    
        con.query(selectEntriesSQL, function(err, result){
            if(err){
                reject(err);
                throw err;
            }
    
            resolve(result);

        });

    });

    return resultPromise;

}

exports.getEntriesSince = getEntriesSince;