import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

const databaseHost = process.env.DATABASEHOST;
const databaseUser = process.env.DATABASEUSER;
const password = process.env.PASSWORD;
const databaseName = process.env.DATABASE;

const con = mysql.createConnection({
    host: databaseHost,
    user: databaseUser,
    password: password
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    const createDBSQL = "CREATE DATABASE IF NOT EXISTS " + databaseName + ";";
    con.query(createDBSQL, function (err, result) {
      if (err) throw err;
      const useDBSQL = "use " + databaseName + ";"
      con.query(useDBSQL, function (err, result) {
          if (err) throw err;
          console.log('worked');
      });
    });

   
});
