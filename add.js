const { modulesPath } = require("./olum")
const colors = require(modulesPath + "/colors");
const fs = require("fs");
const path = require("path");

function mkEntryId(arr) {
  if (!arr.length) return 1;
  let ids = [];
  arr.forEach((obj) => ids.push(obj.id)); // push all ids
  ids.sort((a, b) => a - b); // ascending order
  const currentMaxId = ids.pop();
  const nextId = currentMaxId + 1; // get max number + 1
  //   console.log({ currentMaxId });
  //   console.log({ nextId });
  return nextId;
}

function addEntry(db, entry) {
  const dbPath = path.resolve(__dirname, "./db.json");
  if (!fs.existsSync(dbPath)) return console.error(colors.red("DB doesn't exist @: " + dbPath));

  const entryExists = db.bookmarks.find((obj) => {
    if (entry["name"] == obj["name"] && entry["url"] == obj["url"] && entry["section"] == obj["section"]) return obj;
  });
  if (entryExists) return console.log(colors.yellow("Entry exists!"));

  entry.id = mkEntryId(db.bookmarks);
  // console.log(entry);
  db.bookmarks.push(entry); // push new entry
  console.log(colors.green("[+] Added entry."));

  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log(colors.green("[+] Updated db."));
  } catch (err) {
    console.log(colors.red("Error while adding entry!"), err);
  }
}

module.exports = addEntry;
