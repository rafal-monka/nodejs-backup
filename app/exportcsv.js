const fastcsv = require("fast-csv");
const fs = require("fs");
const gdrive = require("./upload-gdrive.js");

exports.saveToCSV = (jsonData, filename) => {
    const dir = './export-data';
    const filepath = dir+'/'+filename;
    console.log("Writing... to file "+filepath);

    //create folder
    if (!fs.existsSync(dir)){
        console.log("mkdirSync... "+dir);
        fs.mkdirSync(dir);
    }

    //save to file
    const ws = fs.createWriteStream(filepath);
    fastcsv
        .write(jsonData, { 
          headers: false,
          delimiter: ";",
          quoteColumns: true
        })
        .on("finish", function() {
            console.log("Write to "+filepath+" successfully!");
            //@@@ gdrive.uploadGDrive(filenama);
        })
        .pipe(ws);
}