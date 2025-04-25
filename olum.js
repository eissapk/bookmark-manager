function getModulesPath () {
  const os = require("os");
  let currentOs = null;
  ["linux", "android"].includes(os.platform()) ? (currentOs = "linux") : os.platform() == "darwin" ? (currentOs = "mac") : (currentOs = "win");
  return "./node/" + currentOs + "/node_modules";
}
const modulesPath = getModulesPath();
module.exports.modulesPath = modulesPath;

function isAndroid() {
  return require("os").platform() === "android";
}
module.exports.isAndroid = isAndroid;

const inquirer = require(modulesPath + "/inquirer");
inquirer.registerPrompt("autocomplete", require(modulesPath + "/inquirer-autocomplete-prompt"));
const bcrypt = require(modulesPath + "/bcryptjs"); // bcrypt is faster, but we use bcryptjs because it is slow which will make the brute force attack slow also

function prompt(data, cb) {
  inquirer
    .prompt(data)
    .then((res) => {
      if (cb) cb(res);
    })
    .catch(console.error);
}

function exists(pwd, secrets) {
  var matched = false;
  for (let i = 0; i < secrets.length; i++) {
    if (bcrypt.compareSync(pwd, secrets[i])) {
      matched = true;
      break;
    }
  }
  return matched;
}

function hashPwd(pwd) {
  return bcrypt.hashSync(pwd, bcrypt.genSaltSync(10));
}

function normalize(input) {
  input = input.toLowerCase().trim();
  return input
    // remove signs
    .replace(/\u0610/g, "") //ARABIC SIGN SALLALLAHOU ALAYHE WA SALLAM
    .replace(/\u0611/g, "") //ARABIC SIGN ALAYHE ASSALLAM
    .replace(/\u0612/g, "") //ARABIC SIGN RAHMATULLAH ALAYHE
    .replace(/\u0613/g, "") //ARABIC SIGN RADI ALLAHOU ANHU
    .replace(/\u0614/g, "") //ARABIC SIGN TAKHALLUS

    // Remove koranic anotation
    .replace(/\u0615/g, "") //ARABIC SMALL HIGH TAH
    .replace(/\u0616/g, "") //ARABIC SMALL HIGH LIGATURE ALEF WITH LAM WITH YEH
    .replace(/\u0617/g, "") //ARABIC SMALL HIGH ZAIN
    .replace(/\u0618/g, "") //ARABIC SMALL FATHA
    .replace(/\u0619/g, "") //ARABIC SMALL DAMMA
    .replace(/\u061A/g, "") //ARABIC SMALL KASRA
    .replace(/\u06D6/g, "") //ARABIC SMALL HIGH LIGATURE SAD WITH LAM WITH ALEF MAKSURA
    .replace(/\u06D7/g, "") //ARABIC SMALL HIGH LIGATURE QAF WITH LAM WITH ALEF MAKSURA
    .replace(/\u06D8/g, "") //ARABIC SMALL HIGH MEEM INITIAL FORM
    .replace(/\u06D9/g, "") //ARABIC SMALL HIGH LAM ALEF
    .replace(/\u06DA/g, "") //ARABIC SMALL HIGH JEEM
    .replace(/\u06DB/g, "") //ARABIC SMALL HIGH THREE DOTS
    .replace(/\u06DC/g, "") //ARABIC SMALL HIGH SEEN
    .replace(/\u06DD/g, "") //ARABIC END OF AYAH
    .replace(/\u06DE/g, "") //ARABIC START OF RUB EL HIZB
    .replace(/\u06DF/g, "") //ARABIC SMALL HIGH ROUNDED ZERO
    .replace(/\u06E0/g, "") //ARABIC SMALL HIGH UPRIGHT RECTANGULAR ZERO
    .replace(/\u06E1/g, "") //ARABIC SMALL HIGH DOTLESS HEAD OF KHAH
    .replace(/\u06E2/g, "") //ARABIC SMALL HIGH MEEM ISOLATED FORM
    .replace(/\u06E3/g, "") //ARABIC SMALL LOW SEEN
    .replace(/\u06E4/g, "") //ARABIC SMALL HIGH MADDA
    .replace(/\u06E5/g, "") //ARABIC SMALL WAW
    .replace(/\u06E6/g, "") //ARABIC SMALL YEH
    .replace(/\u06E7/g, "") //ARABIC SMALL HIGH YEH
    .replace(/\u06E8/g, "") //ARABIC SMALL HIGH NOON
    .replace(/\u06E9/g, "") //ARABIC PLACE OF SAJDAH
    .replace(/\u06EA/g, "") //ARABIC EMPTY CENTRE LOW STOP
    .replace(/\u06EB/g, "") //ARABIC EMPTY CENTRE HIGH STOP
    .replace(/\u06EC/g, "") //ARABIC ROUNDED HIGH STOP WITH FILLED CENTRE
    .replace(/\u06ED/g, "") //ARABIC SMALL LOW MEEM

    //Remove tatweel
    .replace(/\u0640/g, "")

    //Remove tashkeel
    .replace(/\u064B/g, "") //ARABIC FATHATAN
    .replace(/\u064C/g, "") //ARABIC DAMMATAN
    .replace(/\u064D/g, "") //ARABIC KASRATAN
    .replace(/\u064E/g, "") //ARABIC FATHA
    .replace(/\u064F/g, "") //ARABIC DAMMA
    .replace(/\u0650/g, "") //ARABIC KASRA
    .replace(/\u0651/g, "") //ARABIC SHADDA
    .replace(/\u0652/g, "") //ARABIC SUKUN
    .replace(/\u0653/g, "") //ARABIC MADDAH ABOVE
    .replace(/\u0654/g, "") //ARABIC HAMZA ABOVE
    .replace(/\u0655/g, "") //ARABIC HAMZA BELOW
    .replace(/\u0656/g, "") //ARABIC SUBSCRIPT ALEF
    .replace(/\u0657/g, "") //ARABIC INVERTED DAMMA
    .replace(/\u0658/g, "") //ARABIC MARK NOON GHUNNA
    .replace(/\u0659/g, "") //ARABIC ZWARAKAY
    .replace(/\u065A/g, "") //ARABIC VOWEL SIGN SMALL V ABOVE
    .replace(/\u065B/g, "") //ARABIC VOWEL SIGN INVERTED SMALL V ABOVE
    .replace(/\u065C/g, "") //ARABIC VOWEL SIGN DOT BELOW
    .replace(/\u065D/g, "") //ARABIC REVERSED DAMMA
    .replace(/\u065E/g, "") //ARABIC FATHA WITH TWO DOTS
    .replace(/\u065F/g, "") //ARABIC WAVY HAMZA BELOW
    .replace(/\u0670/g, "") //ARABIC LETTER SUPERSCRIPT ALEF
    .replace(/ࣰ/g, "")
    .replace(/ࣱ/g, "")
    .replace(/ࣲ/g, "")
    .replace(/ࣳ/g, "")
    .replace(/ﱢ/g, "")
    .replace(/ﱠ/g, "")

    // handle special letter
    .replace(/ی|ى/g, "ي") // here two letters look the same but actually they are not
    .replace(/ﻻ/g, "لا")
    .replace(/آ|إ|أ|ٱ/g, "ا")
    .replace(/ڛ/g, "س")
    .replace(/چ/g, "ج")
}

module.exports.prompt = prompt;
module.exports.exists = exists;
module.exports.hashPwd = hashPwd;
module.exports.normalize = normalize;
