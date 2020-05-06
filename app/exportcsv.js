const fastcsv = require("fast-csv");
const fs = require("fs");
const gdrive = require("./upload-gdrive.js");
const backupStatus = require("./backup-status");

exports.saveToCSV = (jsonData, filename, tablename) => {
console.log('saveToCSV',filename,tablename);
    const dir = './export-data';
    //create folder
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    //save to file
    const ws = fs.createWriteStream(dir+'/'+filename);
    fastcsv
        .write(jsonData, { 
          headers: false,
          delimiter: ";",
          quoteColumns: true
        })
        .on("finish", function() {
console.log('fastcsv.on-finish');
            backupStatus.setExported(tablename, true);
            gdrive.uploadGDrive(dir, filename, tablename);
        })
        .pipe(ws);
}