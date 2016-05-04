var firstNames = require("./firstNames.json")["firstNames"];
var lastNames = require("./lastNames.json")["lastNames"];

function RANDOMHORSENAME() {
  var i = Math.floor(Math.random() * firstNames.length);
  var r = Math.floor(Math.random() * lastNames.length);
  return firstNames[i] + " " + lastNames[r];
}

module.exports = {RANDOMHORSENAME: RANDOMHORSENAME};
