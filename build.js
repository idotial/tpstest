var fs = require("fs");
var Web3 = require('web3');
var web3 = new Web3();

if (!fs.existsSync('config/accounts.js')) {
  var data = `var accounts = new Map();
`
  for (var i = 0; i < 3; i++) {
    let account = web3.eth.accounts.create();
    data += `accounts.set('${account.address}', '${account.privateKey}');
`
  }
  data += `module.exports = accounts;
`
  fs.writeFileSync('config/accounts.js', data);
}
