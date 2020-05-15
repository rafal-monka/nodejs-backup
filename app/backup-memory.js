// Export data to CSV, and upload files to GDrive
const csv = require("./exportcsv");
const backupStatus = require("./backup-status");

exports.backupMemory = (pool, day) => {
console.log('backupMemory');
    const tables = [
        {name: "geolocs", 
          sql: "SELECT imei, clientdata, serverdata, longitude, latitude, altitude, accuracy, speed, bearing, name"
               +" FROM geolocs "
              +" WHERE created_at BETWEEN ? AND ?"},
        {name: "savedroutes",
          sql: "SELECT imei,name,DATE_FORMAT(datefrom,'%Y-%m-%d %T'),DATE_FORMAT(dateto,'%Y-%m-%d %T'),pausetime,distance,distance2 "
               +" FROM savedroutes"
              +" WHERE created_at BETWEEN ? AND ?"
              +" ORDER BY 3"},
        {name: "places", 
          sql: "SELECT imei, longitude, latitude, altitude, name"
               +" FROM places "
              +" WHERE created_at BETWEEN ? AND ?"},
        {name: "words", 
          sql: "SELECT phrase, hws, speechpart, replace(sentence,'\n','\r') as sentence, translation, replace(examples,'\n','\r') as examples, tags, counter"
               +" FROM words "
              +" WHERE createdAt BETWEEN ? AND ?"},                
    ]; 
    
    let datefrom = day+" 00:00:00";
    let dateTo = day+" 23:59:59";
    //loop tables
    tables.forEach((table, index) => {
console.log('forEach',table.name);
        backupStatus.addItem(table.name);

        pool.query(table.sql, [datefrom, dateTo], function(error, data, fields) {
            if (error) throw error;    
            const results = JSON.parse(JSON.stringify(data));          
            let rowsNumber = Object.keys(results).length;

            if (rowsNumber > 0) {
                backupStatus.setRows(table.name, rowsNumber);
                //export to CSV file      
                let filename = table.name+"."+day+".csv";
                csv.saveToCSV(results, filename, table.name);
            } else {
                backupStatus.setExported(table.name, true);
                backupStatus.setRows(table.name, 0);
                backupStatus.setStatus(table.name, true);
            }                     
        });    
    });     
}


// //--------------------------------------------OLD
// exports.backupMemoryOLD = (date) => {
//     console.log("backupMemory()");
//     //connect to the database
//     console.log("createconn...");
//     let conn = dbConfig.memoryConnection();
//     conn.connect(error => {
//         console.log("connecting...");
//         if (error) throw error;    
//         console.log("querying...");  
//         conn.query("SELECT * FROM savedroutes", function(error, data, fields) {
//             conn.end();
//             if (error) throw error;    
//             const jsonData = JSON.parse(JSON.stringify(data));          

//             //export to CSV file
//             console.log("savingToCSV...");
//             var filename = "savedroutes."+date+".csv";
//             csv.saveToCSV(jsonData, filename);

//             //saveLog("savedroutes");
//             gdrive.uploadGDrive(filenam);
//         });
//     });
// }

    // const saveLog = (name) => {
    //   console.log("saveLog..."+name);
          
    //   // let conn = dbConfig.backupConnection();
    //   // conn.connect(error => {
    //   //     if (error) throw error;    
    //   //     console.log("querying...");  
    //   //     conn.query("INSERT INTO backupjobs (what, amount) VALUES ('"+name+"', 123)", function(error, data, fields) {
    //   //         if (error) throw error;  
    //   //     })
    //   // });
    // }
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


// csv.saveToCSV(jsonData, filename, 
//     (arg = index)=> { //<--------------------------------callback with parameters
//         console.log('index=', index);
//         backupStatus[arg].exported = true;
//         backupStatus[arg].rows = rows
//         console.log(backupStatus);
//     }
// );