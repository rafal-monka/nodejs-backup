//gdrive
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const backupStatus = require("./backup-status");

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, folder, filename, tablename) {    
// console.log('authorize...');
    try {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback, folder, filename, tablename);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client, folder, filename, tablename);
        });
    } catch (e) {
        console.log('ERROR', e.toString());
    }
}




/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback, folder, filename, tablename) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    //--
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);            
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client, folder, filename, tablename);
        });

        oAuth2Client.on('tokens', (tokens) => {
            if (tokens.refresh_token) {
              // store the refresh_token in my database!
              console.log("refresh_token: ",tokens.refresh_token);
            }
            console.log("access_token", tokens.access_token);
        });
    });
    //---
}

  /**
* upload. Describe with given media and metaData and upload it using google.drive.create method()
*/ 
function uploadFile(auth, folder, filename, tablename) {
console.log('uploadFile: '+filename+' from folder '+folder);
    const drive = google.drive({version: 'v3', auth});
    const fileMetadata = {
        'name': filename,
        parents: ['1bNgIa_tlBrRyNcU42p7yzchrP3qzrCk5'] //monka.rafal@gmail.com -> My drive / Private / Backup
    };
    const media = {
        mimeType: 'text/csv',
        body: fs.createReadStream(folder+'/'+filename)
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, (err, file) => {
        if (err) {
            // Handle error
            console.error(err);
            backupStatus.setUploaded(tablename, false);            
            backupStatus.setStatus(tablename, false);
        } else {
            console.log('File.id: ', file.data.id);
            backupStatus.setUploaded(tablename, true);
            backupStatus.setStatus(tablename, true);
        }
    });
}

exports.uploadGDrive = (folder, filename, tablename) => {    
console.log('uploadGDrive...'+folder+'/'+filename);
    // Load client secrets from a local file.
    fs.readFile('./app/config/gdrive-credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Drive API.
// console.log(JSON.stringify(JSON.parse(content)));
        authorize(
            JSON.parse(content), 
            uploadFile,
            folder,
            filename,
            tablename            
        );
    });      
}


//---------------------------------------------------
// const http = require('http');
// const https = require('https');
// const email = require("./email");
// var urlParse = require('url-parse');
/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
// function listFiles(auth) {
//     console.log('listFiles...');
//     const drive = google.drive({version: 'v3', auth});
//     drive.files.list({
//       pageSize: 10,
//       fields: 'nextPageToken, files(id, name)',
//     }, (err, res) => {
//       if (err) return console.log('The API returned an error: ' + err);
//       const files = res.data.files;
//       if (files.length) {
//         console.log('Files:');
//         files.map((file) => {
//           console.log(`${file.name} (${file.id})`);
//         });
//       } else {
//         console.log('No files found.');
//       }
//     });
//   }


// console.log(authUrl);
//     var url = urlParse(authUrl);
//     // console.log(url.hostname);
//     // console.log(url.protocol);
//     // console.log(url.pathname);
//     // console.log(url.query);
    
//     //return;

//     //---get
//     const options = {
//         hostname: url.hostname, //'accounts.google.com',
//         port: 443,
//         path: url.pathname,
//         method: 'GET'
//     }
    
//     const port = options.port == 443 ? https : http;

//     const req = port.request(options, res => {
//         console.log(`statusCode: ${res.statusCode}`)
        
//         res.on('data', d => {
//             console.log('DATA:', JSON.parse(d));
//             let data = JSON.parse(d);
//             let code = data.code;
//             console.log('code:', code);            
//         })
//     })
    
//     req.on('error', error => {
//         console.error('ERROR:',error)
//     })
    
//     req.end();
//     //---get
//     return;