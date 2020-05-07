const dbConfig = require("./config/db.config");
const dbs = require("./backup-memory");
const backupStatus = require("./backup-status");

//backup job
exports.backupJob = ()=> {
console.log('backupJob');
    let today = new Date();
    let day = today.getFullYear()+'-'+('0'+(today.getMonth()+1)).substring(-2)+'-'+('0'+today.getDate()).substring(-2); 

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
