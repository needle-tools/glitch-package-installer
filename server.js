// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

const targz = require('targz');
 
// compress files into tar.gz archive
targz.compress({
    src: 'path_to_files',
    dest: 'path_to_compressed_file'
}, function(err){
    if(err) {
        console.log(err);
    } else {
        console.log("Done!");
    }
});
 
// decompress files from tar.gz archive
targz.decompress({
    src: 'path_to_compressed file',
    dest: 'path_to_extract'
}, function(err){
    if(err) {
        console.log(err);
    } else {
        console.log("Done!");
    }
});

// https://stackoverflow.com/questions/41941724/nodejs-sendfile-with-file-name-in-download
// send the .unitypackage back
app.get("/package", (request, response) => {
  // express helps us take JS objects and send them as JSON
  // response.sendFile('archtemp.unitypackage', { root: __dirname });
  // response.download(__dirname + "/" + "archtemp.unitypackage", "my_package.unitypackage");
  response.download("https://cdn.glitch.com/ea155149-e3d1-4828-bc6a-2e46ba8cf214%2Farchtemp.unitypackage?v=1597175110752", "my_package.unitypackage");
  
  // response.sendFile("https://cdn.glitch.com/ea155149-e3d1-4828-bc6a-2e46ba8cf214%2Farchtemp.unitypackage?v=1597175110752");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
