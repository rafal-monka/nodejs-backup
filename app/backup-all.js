// Create conn to the databases, export data to CSV, and upload files to GDrive
require('dotenv').config();
const dbConfig = require("./config/db.config");
const mysql = require("mysql2");
const csv = require("./exportcsv");

const saveLog = (name) => {
  console.log("saveLog..."+name);
      
  // let conn = dbConfig.backupConnection();
  // conn.connect(error => {
  //     if (error) throw error;    
  //     console.log("querying...");  
  //     conn.query("INSERT INTO backupjobs (what, amount) VALUES ('"+name+"', 123)", function(error, data, fields) {
  //         if (error) throw error;  
  //     })
  // });
}

exports.backupMemory = (date) => {
  console.log("backupMemory()");
  //connect to the database
  console.log("createconn...");
  let conn = dbConfig.memoryConnection();
  conn.connect(error => {
      console.log("connecting...");
      if (error) throw error;    
      console.log("querying...");  
      conn.query("SELECT * FROM savedroutes", function(error, data, fields) {
          conn.end();
          if (error) throw error;    
          const jsonData = JSON.parse(JSON.stringify(data));          

          //export to CSV file
          console.log("savingToCSV...");
          csv.saveToCSV(jsonData, "savedroutes."+date+".csv");

          saveLog("savedroutes");
      });
    });

  //memory
  // db.connBACKUP.connect(error => {
  //   if (error) throw error;
  //   // query data from MySQL
  //   db.connMEMORY.query("SELECT count(*) FROM savedroutes", function(error, data, fields) {
  //       if (error) throw error;
    
  //       const jsonData = JSON.parse(JSON.stringify(data));
  //       console.log("savedroutes", jsonData);
    
  //       // TODO: export to CSV file
  //   });
  // });  
}

//module.exports = databases;

// const Sequelize = require("sequelize");
// const dbConfig = require("../config/db.config.js");

// const sequelizeBACKUP = new Sequelize(dbConfig.DB_DATABASE, dbConfig.DB_USER, dbConfig.DB_PASSWORD, {
//   host: dbConfig.DB_HOST,
//   port: dbConfig.options.port,
//   define: {
//     charset: dbConfig.dialectOptions.charset,
//     collate: dbConfig.dialectOptions.collate
//   },
//   dialect: dbConfig.dialect,
//   operatorsAliases: false,
//   pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle
//   },
//   // disable logging; default: console.log
//   logging: true
// });

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelizeBACKUP = sequelizeBACKUP;

// db.backupjob1 = require("./backupjob.model.js")(sequelizeBACKUP, Sequelize);

// module.exports = db;