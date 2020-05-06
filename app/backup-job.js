const dbConfig = require("./config/db.config");
const dbs = require("./backup-memory");
const backupStatus = require("./backup-status");
const email = require("./email");

//@@@ ------> backup-status
const CONST_INTERVAL = 5*1000; //5 seconds
const CONST_RETRY = 6; //try max 6 times = 30 seconds
let i = 0;
let maxi = CONST_RETRY;
function checkingStatus(day) { 
console.log('checkingStatus');
console.log(backupStatus.getInfo());

    let status = backupStatus.check();
console.log(">status=", status, '-', i, '/', maxi);
    if (status === false) {
        if (i < maxi) {
            setTimeout(function() { 
                console.log(i); 
                checkingStatus(day);    
            }, CONST_INTERVAL);
            i++;
        } else {
            console.log('Send email NOT DONE');
            email.sendEmail('[Error] Geoloc backup of '+day, backupStatus.getInfo());
        }
    } else {
        console.log('Send email OK'); 
        email.sendEmail('[OK] Geoloc backup of '+day, backupStatus.getInfo());
    }
}


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
            checkingStatus(day);    
        }, CONST_INTERVAL);
        
    } catch (e) {
        console.log(e.toString());
    }    
}


//while loop
// let i = 0; 
// let status = false;
// while (i < 5 && status === false) {
//     status = backupStatus.check(); 
//     pause();
//     i++; 
// }

// if (backupStatus.check() === true) {
//     console.log('Send email OK')            
// } else {
//     console.log('Send email NOT DONE???')
// }
// backupStatus.show();