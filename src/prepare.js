var Web3 = require('web3');
// const execFile = require('child_process').execFile;
var net = require('net');
var accounts = require('../config/accounts')
var nodes = require('../config/nodes')
var web3 = new Web3(new Web3.providers.IpcProvider(nodes[0].url, net));
// var web3 = new Web3(new Web3.providers.WebsocketProvider(nodes[0].url));

// const PowerLimit = 1509715260000000
// const transPerBatch = 1

const addrBase = '0xAABe8da4AF6CCC2d8DeF6F4e22DcE92B0cc845bd';
const baseprivate = '6ecdc5bb03831a540119d871bbb7ce12876b6aa5964fb9f90d7984bbb84c863f';

class RepeatBatchSendCoin {
  // constructor (){
  //   this.availbleAccounts = new Set();
  //   this.power = new Map();
  //   this.nonce = new Map();
  // }

  // async refreshAvailbleAddress() {
  //   for(let address of accounts.keys()) {
  //     let power = await web3.eth.getPower(address);
  //     this.power.set(address, power);
  //     if (power < PowerLimit) {
  //       this.availbleAccounts.delete(address);
  //     } else {
  //       this.availbleAccounts.add(address);
  //     }
  //   }
  // }

  // checkNode() {
  //   const ls = execFile(`/root/go-etherzero/build/bin/geth`, ['attach', '--datadir', '/data/node1', '--exec',  'txpool.status']);
  //   ls.stdout.on('data', (data) => {
  //     if (data.pending + data.queued > 700) {
  //       clearInterval(this.intervalId)
  //       this.intervalId = null;
  //     } else if (this.intervalId == null) {
  //       this.intervalId = setInterval(this.sendcoin.bind(this), interval)
  //     }
  //   });
  // }

  async refreshNonce(address) {
    this.nonce = await web3.eth.getTransactionCount(addrBase);
    let balance = await web3.eth.getBalance(addrBase);
    console.log(balance);
    console.log(this.nonce);
  }

  async sendcoin() {
    // let batch = new web3.eth.BatchRequest()
    for (let address of accounts.keys()) {
        let txObject = await web3.eth.accounts.signTransaction({
          to: address,
          value: '10000000000000000000000000000',
          // value: '1000',
          chainId: 90,
          gas: '21000', //100个地址的话差不多时两百万左右，具体可以测试的时候看下交易的gas used做调整
          gasPrice:'1000000000',
          nonce: this.nonce++,
        },baseprivate)
        web3.eth.sendSignedTransaction(txObject.rawTransaction)
        .once('transactionHash', console.log)
        // .once('confirmation', console.log)
        .once('error', console.log)
        //"0xf86580843b9aca008303345094b41b3986c377a8f914bf0a6da54b6f7a60610819018081d8a02e06a377269bbfd14e39b4b41caaf199e15ef190cf8f4897bd90e8bc8c2cd485a04e4084014386b6b8c49bb18e3977e0cc58180b8ebe1575e660c3957e4fb636ff"
        // batch.add(web3.eth.sendSignedTransaction.request(txObject.rawTransaction))
    }
    // batch.execute()
  }

  async start() {
    await this.refreshNonce(addrBase)
    await this.sendcoin()
  }
}

var task = new RepeatBatchSendCoin()
task.start()
