const dbs = require("./backup-all");
const email = require("./email");

//backup job
exports.backupJob = ()=> {
    console.log(new Date()+"-backupJob");
    let today = new Date();
    let d = today.getFullYear()+'-'+('0'+today.getMonth()).substring(-2)+'-'+('0'+today.getDate()).substring(-2);
    //console.log(d);
  
    try {
        console.log("trying...");

        dbs.backupMemory(d);   
        
        email.sendEmail('Test mail', 'Hello world');
        //@@@
        //mysql query :params
        //saveToCSV files
        //upload File Gdrive

    } catch (e) {
      console.log(e.toString());
    } 
}

