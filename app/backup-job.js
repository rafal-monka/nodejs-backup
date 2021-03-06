const dbConfig = require("./config/db.config");
const dbs = require("./backup-memory");
const backupStatus = require("./backup-status");
//const email = require("./email");

//backup job
exports.backupJob = (date = new Date())=> {
console.log('backupJob');
    let day = date.getFullYear()+'-'+(''+(date.getMonth()+1)).padStart(2,'0')+'-'+(''+date.getDate()).padStart(2,'0'); 

    try {
        //connect to the database
        let pool = dbConfig.memoryConnectionPool();       
        
        //run backup procedure
        dbs.backupMemory(pool, day);  

        //checkstatus after some delay
        setTimeout(function() { 
            backupStatus.checkingStatus(day);    
        }, backupStatus.CONST_INTERVAL);
        
    } catch (e) {
        console.log(e.toString());
    }    
}

