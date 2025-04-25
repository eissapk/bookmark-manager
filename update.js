const { prompt, modulesPath } = require("./olum");
const colors = require(modulesPath + "/colors");
const fs = require("fs");
const path = require("path");

function updateEntry(db, filteredEntries) {
  if (filteredEntries.length) {
    const entry = filteredEntries[0];
    const dbPath = path.resolve(__dirname, "./db.json");
    if (!fs.existsSync(dbPath)) return console.error(colors.red("DB doesn't exist @: " + dbPath));

    prompt([{ type: "confirm", name: "question", message: "The entry will be " + colors.yellow("updated") + ", Are you sure" }], function (data) {
      if (!data.question) return;

      const id = entry.id;
      const newEntry = { name: null, url: null, section: null, id };

      // ask for new values
      prompt([{ type: "input", name: "name", message: "Add name: " }], function (data2) {
        const name = data2.name.trim();
        if (name != "") newEntry.name = name;
        prompt([{ type: "input", name: "url", message: "Add url: " }], function (data3) {
          const url = data3.url.trim();
          if (url != "") newEntry.url = url;
          prompt([{ type: "input", name: "section", message: "Add section: " }], function (data4) {
            const section = data4.section.trim();
            if (section != "") newEntry.section = section;
            next();
          });
        });
      });

      // update values
      function next() {
        db.bookmarks.find((obj) => {
          if (obj.id == id) {
            if (newEntry.name) obj.name = newEntry.name;
            if (newEntry.url) obj.url = newEntry.url;
            if (newEntry.section) obj.section = newEntry.section;
          }
        });
        console.log(colors.yellow("[+] Updated entry."));

        try {
          fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
          console.log(colors.yellow("[+] Updated db."));
        } catch (err) {
          console.log(colors.red("Error while updating entry!"), err);
        }
      }
    });
  }
}

module.exports = updateEntry;
