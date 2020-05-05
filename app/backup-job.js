const dbs = require("./backup-memory");

//backup job
exports.backupJob = ()=> {
    console.log(new Date()+"-backupJob");
    let today = new Date();
    let day = today.getFullYear()+'-'+('0'+today.getMonth()+1).substring(-2)+'-'+('0'+today.getDate()).substring(-2);
    //console.log(d);  
    try {
        console.log("backupJob - trying...");
        dbs.backupMemory(day);     
    } catch (e) {
        console.log(e.toString());
    } 
}

