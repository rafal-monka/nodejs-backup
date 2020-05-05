// Create conn to the databases, export data to CSV, and upload files to GDrive
const dbConfig = require("./config/db.config");
const mysql = require("mysql2");
const csv = require("./exportcsv");

exports.backupMemory = (day) => {
  console.log("backupMemory()");
  const filenames = ['savedroutes'];
  const sqltext = [
    "SELECT imei,name,DATE_FORMAT(datefrom,'%Y-%m-%d %T'),DATE_FORMAT(dateto,'%Y-%m-%d %T'),pausetime,distance,distance2 "
    +" FROM savedroutes"
   +" WHERE created_at BETWEEN ? AND ?"
  +" ORDER BY 3"]; 
  //connect to the database
  console.log("memoryConnectionPool..."+sqltext);
  let pool = dbConfig.memoryConnectionPool();  
  //columns: imei,name,datefrom,dateto,pausetime,distance,distance2
  pool.query(sqltext[0], [day+" 00:00:00", day+" 23:59:59"], function(error, data, fields) {
      if (error) throw error;    
      const jsonData = JSON.parse(JSON.stringify(data));          
      //export to CSV file      
      var filename = filenames[0]+"."+day+".csv";
      console.log("savingToCSV...",filename);
      if (Object.keys(jsonData).length > 0) {
          csv.saveToCSV(jsonData, filename);
      } else {
          console.log("No data...");
      }
      //saveLog("savedroutes");
      
  });
}

exports.backupMemoryOLD = (date) => {
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
            var filename = "savedroutes."+date+".csv";
            csv.saveToCSV(jsonData, filename);

            //saveLog("savedroutes");
            gdrive.uploadGDrive(filenam);
        });
    });
}

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