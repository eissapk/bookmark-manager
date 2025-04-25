const fs = require("fs");
const { modulesPath } = require("./olum");
const { JSDOM } = require(modulesPath + "/jsdom");
const { argv } = require("process");
const inputPath = argv[2];
const outputPath = argv[3];

// Read the bookmarks HTML file
const bookmarksHtml = fs.readFileSync(inputPath, "utf8");
const dom = new JSDOM(bookmarksHtml);
const document = dom.window.document;

// Array to store the parsed bookmarks
const bookmarks = [];
let id = 1;

// Process all DL elements (folders)
const processFolder = (dlElement, folderName = "standalone") => {
  // Get all direct DT children of this DL
  const dtElements = dlElement.querySelectorAll(":scope > dt");

  dtElements.forEach((dt) => {
    // Check if this is a folder
    const h3 = dt.querySelector("h3");

    if (h3) {
      // This is a folder, process its contents with the folder name
      const subFolder = h3.textContent;
      const subDl = dt.querySelector("dl");
      if (subDl) {
        processFolder(subDl, subFolder);
      }
    } else {
      // This is a bookmark
      const a = dt.querySelector("a");
      if (a && a.href) {
        bookmarks.push({
          url: a.href,
          section: folderName,
          name: a.textContent,
          id: id++,
        });
      }
    }
  });
};

// Start processing from the main DL element
const mainDl = document.querySelector("dl");
if (mainDl) {
  processFolder(mainDl);
} else {
  console.error("No bookmark structure found. Make sure the file has proper HTML structure.");
}

// Write the results to a JSON file
fs.writeFileSync(outputPath, JSON.stringify({bookmarks}, null, 2));

console.log(`Successfully converted ${bookmarks.length} bookmarks to JSON format.`);
