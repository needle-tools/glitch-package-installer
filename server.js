// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const fs = require('fs-extra');
const yaml = require('js-yaml');
const targz = require('targz');

const app = express();

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});
 

            
// https://stackoverflow.com/a/56119188
// decompress files from tar.gz archive
function decompressPromise(file, tmpPath) {
  return new Promise((resolve, reject) => {
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
})};

function compressPromise(tmpPath, tmpFile) {
    return new Promise((resolve, reject) => {
      // compress files into tar.gz archive
        targz.compress({
            src: tmpPath,
            dest: tmpFile
        }, function(err){
            if(err) {
              reject(err);
                console.log(err);
            } else {
                resolve(tmpFile);
                console.log("Done compressing!");
            }
        });
    });
  }
  
app.get("/test/:registry/:name/:version", async (request, response, next) => {
  response.json(request.query);
});

// http://package-installer.glitch.me/v1/install/needle/com.needle.compilation-visualizer/1.0.0?registry=https://packages.needle.tools&scope=com.needle
// http://package-installer.glitch.me/v1/install/OpenUPM/elzach.leveleditor/0.0.7?registry=https://package.openupm.com&scope=elzach.leveleditor&scope=elzach.extensions

// https://stackoverflow.com/questions/41941724/nodejs-sendfile-with-file-name-in-download
// send the .unitypackage back
// https://techeplanet.com/express-path-parameter/
app.get("/v1/install/:registry/:name@:version", async (request, response, next) => {

  console.log(request.params.scope + " - " + request.params.name + " - " + request.params.version);
  console.log(request.query.registry);
  
  let registryName = request.params.registry;
  let packageName = request.params.name;
  let packageVersion = request.params.version;
  
  let registryScope = request.query.scope;
  let registryUrl = request.query.registry;
  
  let file = __dirname + "/DO-NOT-TOUCH/" + "archtemp.tar.gz";
  let tmpPath = '/tmp/my_package_folder';
  let tmpFile = '/tmp/my_package_file.tar.gz';
  
  fs.ensureDir(tmpPath);
    
  let targetPath = await decompressPromise(file, tmpPath);
  
  /// MODIFY PACKAGE CONTENT
  
  // GUID of PackageData.asset:
  let dataGuid = "54e893365203989479ba056e0bf3174a";
  let assetFile = tmpPath + "/" + dataGuid + "/" + "asset";
  var data = fs.readFileSync(assetFile, 'utf8');
  
  const splitLines = str => str.split(/\r?\n/);
  let split_lines = splitLines(data);
  
  let some_lines = split_lines.slice(3);  
  let startWithBrokenYamlTag = split_lines.slice(0, 3).join("\n");
  
  let yamlData = yaml.load(some_lines.join("\n"));
  /*
  yamlData["MonoBehaviour"]["registries"] = [{
    name: "pfc",
    url: "https://prefrontalcortex.de",
    scope: [
      "com.pfc"
    ]
  }];
  yamlData["MonoBehaviour"]["packages"] = [{
    name: "com.pfc.dialoguesystem",
    version: "1.0.0",
    installType: 1
  }];
  */
  
  yamlData["MonoBehaviour"]["registries"] = [{
    name: registryName,
    url: registryUrl
  }];
  yamlData["MonoBehaviour"]["registries"].scope = Array.isArray(registryScope) ? registryScope : [ registryScope ];
  yamlData["MonoBehaviour"]["packages"] = [{
    name: packageName,
    version: packageVersion,
    installType: 1
  }];
  
  let combinedFile = startWithBrokenYamlTag + "\n" + yaml.dump(yamlData);
  
  fs.writeFileSync(assetFile, combinedFile, 'utf8')
  
  /// END MODIFY PACKAGE CONTENT  
  
  let compressPath = await compressPromise(tmpPath, tmpFile);  
  response.download(compressPath, "Install-" + packageName + "-" + packageVersion + ".unitypackage");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
