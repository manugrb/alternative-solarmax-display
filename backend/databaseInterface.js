import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

const inverterDataTableName = "inverterData";

const databaseHost = process.env.DATABASEHOST;
const databaseUser = process.env.DATABASEUSER;
const password = process.env.PASSWORD;
const databaseName = process.env.DATABASENAME;

const con = mysql.createConnection({
    host: databaseHost,
    user: databaseUser,
    password: password
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    setupDatabaseConnection().then(() => {
        console.log("setup complete");
    }, (reason) => {
        console.error(reason);
    })
    
});

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
              
                const createTableSQL = "CREATE TABLE IF NOT EXISTS " + inverterDataTableName + " (time TIMESTAMP, solarPower SMALLINT UNSIGNED, housePower SMALLINT, gridPower SMALLINT, batteryPower SMALLINT, batteryCharge SMALLINT UNSIGNED, batteryCapacity SMALLINT);";
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
