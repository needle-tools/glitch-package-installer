(function() {
  const fs = require("fs");
  const dbPath = ".data/stats.json";
  let db = {};

  module.exports.setupApp = function(app) {
    // uncomment to clear all, beware
    //save();
    
    load();

    app.get("/private/magick/stats", (request, response) => {
      //module.exports.register({ name: "com.needle.test", version: "1.0.0" });
      response.json(db);
    });
  };

  module.exports.register = function(data) {
    if (data === undefined) return;
    const { name, version } = data;
    if (name === undefined || version === undefined) return;
    if (db[name] === undefined) db[name] = { downloads: 1 };
    else db[name].downloads += 1;

    const lastAccess = new Date().toUTCString();
    
    const pack = db[name];
    pack.lastAccess = lastAccess;
    
    if (pack[version] === undefined) pack[version] = { downloads: 1, lastAccess:lastAccess };
    else {
      const ver = pack[version];
      ver.downloads += 1;
      ver.lastAccess = lastAccess;
    }
    

    const req = data.request;
    if (req !== undefined) {

      
      /*
      console.log(req);
      console.log(req.path);
      console.log(req.headers.referer);
      console.log(req.headers.origin);
      */
      
      const api = req.originalUrl;
      if (pack.apis === undefined) pack.apis = {};
      if (pack.apis[api] === undefined) {
        pack.apis[api] = { downloads: 1 };
      } else pack.apis[api].downloads += 1;

      const source = req.headers.referer;
      if (source !== undefined) {
        if (pack.sources === undefined) pack.sources = {};
        if (pack.sources[source] === undefined) {
          pack.sources[source] = { downloads: 1, lastAccess:lastAccess };
        } else {
          const src = pack.sources[source];
          src.downloads += 1;
          src.lastAccess = lastAccess;
        }
      }
    }

    db[name] = pack;
    save();
  };

  const load = () => {
    fs.exists(dbPath, function(exists) {
      if (exists) {
        fs.readFile(dbPath, (err, res) => {
          if (err) throw err;
          db = JSON.parse(res);
          console.log("Loaded stats");
        });
      } else {
        console.log("Stats db does not exist yet, creating", db);
        db = {};
        save();
      }
    });
  };

  const save = () =>
    fs.writeFile(dbPath, JSON.stringify(db), err => {
      if (err) throw err;
      console.log("Saved stats");
    });
})();
