const { prompt, exists, hashPwd, modulesPath } = require("./olum");
const colors = require(modulesPath + "/colors");
const fs = require("fs");
const path = require("path");

// connect to db
let db = null;
const fileName = "credentials.json"
try {
  db = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./" + fileName)).toString());
} catch (err) {
  return console.error(colors.red("Couldn't connect to db!"), "\n", err);
}

prompt([{ type: "password", name: "password", message: "Choose a MASTER PASSWORD: " }], function (data) {
  const password = data.password.trim();
  prompt([{ type: "password", name: "password", message: "Re-type: " }], function (data2) {
    const password2 = data2.password.trim();
    if (password != password2) return console.log(colors.red("MASTER PASSWORD not matched"));
    if (exists(password, db.secrets)) return console.log(colors.yellow("Password exists!"));
    next(password);
  });
});

function next(password) {
  const hashedPassword = hashPwd(password);
  db.secrets.push(hashedPassword); // push new password
  console.log(colors.green("[+] Added password."));

  try {
    fs.writeFileSync(path.resolve(__dirname, "./" + fileName), JSON.stringify(db, null, 2));
    console.log(colors.green("[+] Updated db."));
  } catch (err) {
    console.log(colors.red("Error while adding password!"), err);
  }
}
