/*
 * Backup Node app
 */
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const schedule = require('node-schedule');
const app = express();
//const db = require("./app/models");
const bj = require("./app/backup-job.js");
// const gdrive = require("./app/upload-gdrive.js");

console.log("Starting Backup app..."+process.env.MAIL_USER);

app.use(cors()); 

//db.sequelizeBACKUP.sync( /* { force: true } */ ); //!!! In development, you may need to drop existing tables and re-sync database.

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Backup application." });
});


bj.backupJob();
//var j = schedule.scheduleJob("0 22 * * *", function(){
//  bj.backupJob();
//});

// set port, listen for requests
const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
