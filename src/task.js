var Web3 = require('web3');
var accounts = require('../config/accounts')
var nodes = require('../config/nodes')
var web3 = new Web3(new Web3.providers.WebsocketProvider(nodes[1].url));

const PowerLimit = 1509715260000000

class RepeatBatchSendCoin {
  constructor (){
    this.availbleAccounts = new Set();
    this.power = new Map();
    this.nonce = new Map();
  }

  refreshAvailbleAddress() {
    for(address of accounts.keys()) {
      let power = await web3.eth.getPower(address);
      this.power.set(address, power);
      if (power < PowerLimit) {
        this.availbleAccounts.delete(address);
      } else {
        this.availbleAccounts.add(address);
      }
    }
  }

  refreshNonce(address) {
    let nonce = await web3.eth.getTransactionCount(address);
    this.nonce.set(address, nonce);
  }

  async sendcoin() {
    for (address of this.availbleAccounts) {
      let txObject = await web3.eth.accounts.signTransaction({
        to: accounts[1].address,
        value: 1,
        gas: 210000, //100个地址的话差不多时两百万左右，具体可以测试的时候看下交易的gas used做调整
        gasPrice:'1000000000',
        nonce: this.nonce[i]++,
      },accounts[i].privateKey)
      this.currentPendingAmount++
      web3.eth.sendSignedTransaction(txObject.rawTransaction)
    }
  }

  async start() {
    refreshAvailbleAddress()
    for (address of accounts) {
      refreshNonce(address)
    }
    console.log(this.power);
    console.log(this.nonce);
    setInterval(this.refreshAvailbleAddress.bind(this), 3000)
    // setInterval(this.sendcoin.bind(this), 0)
    // this.intervalId = setInterval(this.sendcoin.bind(this), interval)
  }
}

var task = new RepeatBatchSendCoin()
task.start()
