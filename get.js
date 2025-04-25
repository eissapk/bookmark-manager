const { prompt, normalize, modulesPath, isAndroid } = require("./olum");
const colors = require(modulesPath + "/colors");
const deleteEntry = require("./delete");
const updateEntry = require("./update");

function showTable(arr) {
  if (!arr.length) return console.log(colors.cyan("0 Entries"));
  console.table(arr, ["id", "name", "section"]);
  console.log(arr.length >= 2 ? arr.length + " rows" : arr.length + " row");
}

function filter(arr, query) {
  const keys = Object.keys(query);
  const filteredBookmarks = [];
  arr.forEach((obj) => {
    if (keys.length === 1) {
      const key = keys[0];
      const value = query[key].toLowerCase().trim();
      if (normalize(String(obj[key]).toLowerCase().trim()).includes(value)) {
        obj.name = obj.name.length > 50 ? obj.name.slice(0, 50) + "..." : obj.name;
        filteredBookmarks.push(obj);
      }
    } else if (keys.length === 2) {
      const key = keys[0];
      const value = query[key].toLowerCase().trim();
      const key2 = keys[1];
      const value2 = query[key2].toLowerCase().trim();
      if (normalize(String(obj[key]).toLowerCase().trim()).includes(value) && normalize(String(obj[key2]).toLowerCase().trim()).includes(value2)) {
        obj.name = obj.name.length > 50 ? obj.name.slice(0, 50) + "..." : obj.name;
        filteredBookmarks.push(obj);
      }
    }
  });
  return filteredBookmarks;
}

function getEntry(db, query, opts) {
  // search within all bookmarks names and sections
  if (!Object.keys(query).length) {
    const question = {
      type: "autocomplete",
      name: "bookmark",
      message: "Select a bookmark:",
      source: (answers, input = "") => {
        input = input.toLowerCase().trim();
        return new Promise((resolve) => {
          const results = db.bookmarks
            .map((item) => {
              if (normalize(item.name).includes(input) || item.section.toLowerCase().trim().includes(input) || item.url.toLowerCase().trim().includes(input)) return item.id + ": " + item.name;
            })
            .filter((item) => item);
          resolve(results);
        });
      },
    };

    prompt([question], function (data) {
      const id = +data.bookmark.split(":")[0];
      const bookmark = db.bookmarks.find((obj) => obj.id == id);
      if (!bookmark) return console.error(colors.red("Couldn't filter bookmark!"));

      if (isAndroid()) {
          console.log(colors.green(bookmark.url));
          return process.exit(1);
      }

      var ncp = require(modulesPath + "/copy-paste");
      ncp.copy(bookmark.url, () => {
          console.log(colors.cyan("Copied url of selected bookmark to clipboard"));
          process.exit(1);
      });

    });

    return;
  }

  const filteredEntries = filter(db.bookmarks, query);
  showTable(filteredEntries); // show matched items
  // console.log({ opts });
  if (opts.update) return updateEntry(db, filteredEntries);
  if (opts.delete) return deleteEntry(db, filteredEntries);
  if (opts.copy) {
    if (filteredEntries.length) {
      let url = filteredEntries[0].url;

      if (isAndroid()) {
          console.log(colors.green(url));
          return process.exit(1);
      }

      var ncp = require(modulesPath + "/copy-paste");
      ncp.copy(url, () => {
        console.log(colors.cyan("Copied url of 1st entry to clipboard"));
        process.exit(1);
      });

    }
  }
}

module.exports = getEntry;
