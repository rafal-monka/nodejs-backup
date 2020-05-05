//gdrive
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const email = require("./email");

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
function authorize(credentials, callback, filename) {
    console.log('authorize...');
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback, filename);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client, filename);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback, filename) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
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
            callback(oAuth2Client, filename);
        });
    });
}

  /**
* upload. Describe with given media and metaData and upload it using google.drive.create method()
*/ 
function uploadFile(auth, filename) {
    console.log('uploadFile'+filename);
    const drive = google.drive({version: 'v3', auth});
    const fileMetadata = {
        'name': filename,
        parents: ['1bNgIa_tlBrRyNcU42p7yzchrP3qzrCk5'] //monka.rafal@gmail.com -> My drive / Private / Backup
    };
    const media = {
        mimeType: 'text/csv',
        body: fs.createReadStream(filename)
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, (err, file) => {
        if (err) {
            // Handle error
            console.error(err);
            email.sendEmail('[Error] Backup of '+filename, err);
        } else {
            console.log('File Id: ', file.id);
            //email
            email.sendEmail('[OK] Backup of '+filename, 'Done');
        }
    });
}

exports.uploadGDrive = (filename) => {    
console.log('uploadGDrive...'+filename);
    // Load client secrets from a local file.
    fs.readFile('./app/config/gdrive-credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Drive API.
        console.log(JSON.stringify(JSON.parse(content)));
        authorize(
            JSON.parse(content), 
            uploadFile,
            filename            
        );
    });      
}


//---------------------------------------------------
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