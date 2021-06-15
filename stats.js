(function() {
  const fs = require("fs");
  const dbPath = ".data/stats.json";
  let db = {};

  module.exports.setupApp = function(app) {
    load();

    app.get("/private/magick/stats", (request, response) => {
      console.log(request);
      module.exports.register({ name: "com.needle.test", version: "1.0.0" });
      response.json(db);
    });
  };

  module.exports.register = function(data) {
    if(data === undefined) return;
    const { name, version } = data;
    if (name === undefined || version === undefined) return;
    if (db[name] === undefined) db[name] = { downloads: 1 };
    else db[name].downloads += 1;
    const pack = db[name];
    if(pack[version] === undefined) pack[version] = { downloads: 1};
    else pack[version].downloads += 1;
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
