// const fastcsv = require("fast-csv");
// const fs = require("fs");

exports.saveToCSV = (jsonData, filename) => {
    console.log("Write to "+filename+" successfully!");
    console.log(filename, jsonData);
    // const ws = fs.createWriteStream(filename);
    // fastcsv
    //   .write(jsonData, { headers: true })
    //   .on("finish", function() {
    //     console.log("Write to "+filename+" successfully!");
    //   })
    //   .pipe(ws);
}