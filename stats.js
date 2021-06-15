(function() {
  const fs = require("fs");
  const dbPath = ".data/stats.json";
  let db = {};

  module.exports.setupApp = function(app) {
    load();

    app.get("/private/magick/stats", (request, response) => {
      module.exports.register({ packageName: "com.needle.test" });
      response.json(db);
    });
  };

  module.exports.register = function(data) {
    const { packageName } = data;
    if (packageName === undefined) return;
    if (db[packageName] === undefined) db[packageName] = { downloads: 1 };
    else db[packageName].downloads += 1;
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
