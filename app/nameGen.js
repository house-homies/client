var randomname = require("starwars-names-mb");

function getName() {
  return randomname.random();
}

module.exports = getName;
