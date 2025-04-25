const { prompt, modulesPath } = require("./olum");
const colors = require(modulesPath + "/colors");
const fs = require("fs");
const path = require("path");

function deleteEntry(db, filteredEntries) {
  if (filteredEntries.length) {
    const entry = filteredEntries[0];
    const dbPath = path.resolve(__dirname, "./db.json");
    if (!fs.existsSync(dbPath)) return console.error(colors.red("DB doesn't exist @: " + dbPath));

    prompt([{ type: "confirm", name: "question", message: "The entry will be " + colors.yellow("deleted") + ", Are you sure" }], function (data) {
      if (!data.question) return;

      db.bookmarks = db.bookmarks.filter((obj) => obj.id != entry.id);
      console.log(colors.yellow("[-] Deleted entry."));

      try {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        console.log(colors.yellow("[+] Updated db."));
      } catch (err) {
        console.log(colors.red("Error while deleting entry!"), err);
      }
    });
  }
}

module.exports = deleteEntry;
