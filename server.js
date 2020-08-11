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

const fs = require('fs-extra');

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
 
// https://stackoverflow.com/questions/41941724/nodejs-sendfile-with-file-name-in-download
// send the .unitypackage back
app.get("/package", async (request, response, next) => {
  
  let file = __dirname + "/DO-NOT-TOUCH/" + "archtemp.tar.gz";
  let tmpPath = '/tmp/my_package_folder';
  let tmpFile = '/tmp/my_package_file.tar.gz';
  
  fs.ensureDir(tmpPath);
                
  // https://stackoverflow.com/a/56119188
  // decompress files from tar.gz archive
  function decompressPromise = new Promise((resolve, reject) => {
    targz.decompress({
      src: file,
      dest: tmpPath
    }, function(err){
        if(err) {
            console.log(err);
            reject(err);
        } else {
            console.log("Done decompressing!");
            resolve(tmpPath);
        }
    })
  });;
  
  let targetPath = await decompressPromise();
  
  fs.ensureFile(tmpFile, err => {
    console.log("Error in ensure file " + tmpFile + ": " + err) // => null
    // file has now been created, including the directory it is to be placed in
  });
  
  console.log("after decompress before compress");
  
  // compress files into tar.gz archive
  targz.compress({
      src: tmpPath,
      dest: tmpFile
  }, function(err){
      if(err) {
          console.log(err);
      } else {
          console.log("Done compressing!");
      }
  });
  
  console.log("after compress before decompress");
  
  // express helps us take JS objects and send them as JSON
  // response.sendFile('archtemp.unitypackage', { root: __dirname });
  response.download(tmpFile, "my_package.unitypackage");
  
  // response.sendFile("https://cdn.glitch.com/ea155149-e3d1-4828-bc6a-2e46ba8cf214%2Farchtemp.unitypackage?v=1597175110752");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
