const { prompt, exists, modulesPath } = require("./olum");
const colors = require(modulesPath + "/colors");
const commander = require(modulesPath + "/commander");
const fs = require("fs");
const path = require("path");
const pkgJSON = require("./package.json");
const getEntry = require("./get");
const addEntry = require("./add");

// connect to db
let db = null;
let secrets = null;
try {
  db = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./db.json")).toString());
  secrets = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./credentials.json")).toString()).secrets;
} catch (err) {
  return console.error(colors.red("Couldn't connect to db!"), "\n", err);
}

const cmd = new commander.Command();

cmd.option("--id <id>", "Include bookmark id - use it with 'get/add' commands");
cmd.option("--name <name>", "Include bookmark name - use it with 'get/add' commands");
cmd.option("--url <url>", "Include bookmark url - use it with 'get/add' commands");
cmd.option("--section <section>", "Include bookmark section - use it with 'get/add' commands");

cmd.option("--copy", "Copy bookmark url to clipboard - use it with 'get' command");
cmd.option("--update", "Update bookmark in db - use it with 'get' command");
cmd.option("--delete", "Delete bookmark in db - use it with 'get' command");

cmd.command("add").description("Add bookmark").action(add);
cmd.command("get").description("display bookmark(s)").action(get);

cmd.version(pkgJSON.version).description("Bookmark Manager CLI Tool (" + pkgJSON.version + ")");
cmd.on("command:*", (operands) => {
  console.error(colors.red(`error: unknown command '${operands[0]}'\n Try running --help`));
  process.exitCode = 1;
});

cmd.parse(process.argv);

function add() {
  var obj = cmd.opts();
  if (!obj.name) return console.error(colors.red("Missing --name argument!"));
  if (!obj.url) return console.error(colors.red("Missing --url argument!"));
  if (!obj.section) return console.error(colors.red("Missing --section argument!"));

  prompt([{ type: "password", name: "password", message: "MASTER PASSWORD:" }], function (data) {
    var pwdExists = exists(data.password, secrets);
    if (!pwdExists) return console.error(colors.red("Wrong password!"));
    addEntry(db, obj);
  });
}

function get() {
  var query = {};
  var opts = cmd.opts();
  if (opts.id) query.id = opts.id;
  if (opts.name) query.name = opts.name;
  if (opts.section) query.section = opts.section;

  prompt([{ type: "password", name: "password", message: "MASTER PASSWORD:" }], function (data) {
    var pwdExists = exists(data.password, secrets);
    if (!pwdExists) return console.error(colors.red("Wrong password!"));
    getEntry(db, query, opts);
  });
}
