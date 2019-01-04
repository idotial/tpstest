var Web3 = require('web3');
const execFile = require('child_process').execFile;
var net = require('net');
var taskLogger = require('./taskLogger')
var accounts = require('../config/accounts')
var nodes = require('../config/nodes')
var web3 = new Web3(nodes[0].url, net);

const PowerLimit = 2509715260000000
const transPerBatch = 4

class RepeatBatchSendCoin {
  constructor (){
    this.availbleAccounts = new Set();
    this.power = new Map();
    this.nonce = new Map();
    this.sended = 0;
  }

  async refreshAvailbleAddress() {
    for(let address of accounts.keys()) {
      let power = await web3.eth.getPower(address);
      this.power.set(address, power);
      if (power < PowerLimit) {
        this.availbleAccounts.delete(address);
      } else {
        this.availbleAccounts.add(address);
      }
    }
  }

  checkNode() {
    // const geth = execFile(`/root/go-etherzero/build/bin/geth`, ['attach', '--datadir', '/data/node1', '--exec',  'txpool.status']);
    // geth.stdout.on('data', (data) => {
    //   try {
    //     data = eval('(' + data + ')')
        // if (data.pending + data.queued > 2000) {
        //   if (this.intervalId != null) {
        //     clearInterval(this.intervalId)
        //     this.intervalId = null;
        //     taskLogger.info('task stop');
        //   }
        // } else if (this.intervalId == null) {
        //   taskLogger.info('task restart');
        //   this.intervalId = setInterval(this.sendcoin.bind(this), 100)
        // }
    //   } catch (e) {
    //     taskLogger.error(e.toString());
    //     taskLogger.error(data.toString());
    //     if (this.intervalId != null) {
    //       clearInterval(this.intervalId)
    //       this.intervalId = null;
    //       taskLogger.info('task stop');
    //     }
    //   }
    // });
    const geth = execFile(`/root/go-etherzero/build/bin/geth`, ['attach', '--datadir', '/data/node1', '--exec',  'txpool.status'], (error, stdout, stderr) => {
      if (error) {
        taskError.error(error);
      } else {
        try {
          let data = eval('(' + stdout + ')')
          if (data.pending + data.queued > 2000) {
            if (this.intervalId != null) {
              clearInterval(this.intervalId)
              this.intervalId = null;
              taskLogger.info('task stop');
            }
          } else if (this.intervalId == null) {
            taskLogger.info('task restart');
            this.intervalId = setInterval(this.sendcoin.bind(this), 100)
          }
        } catch (e) {
            taskLogger.error(e.toString());
            taskLogger.error(data.toString());
            if (this.intervalId != null) {
              clearInterval(this.intervalId)
              this.intervalId = null;
              taskLogger.info('task stop');
            }
        }
      }
    });
  }

  async refreshNonce(address) {
    let nonce = await web3.eth.getTransactionCount(address);
    this.nonce.set(address, nonce);
  }

  async sendcoin() {
    let batch = new web3.eth.BatchRequest()
    for (let address of this.availbleAccounts) {
      for (let i = 0; i < transPerBatch; i++) {
        try {
          let txObject = await web3.eth.accounts.signTransaction({
            to: '0x7cB5761e153CC39d618DE6D074C2a199B109671f',
            value: '1',
            chainId: '123',
            gas: '210000',
            gasPrice:'1000000000',
            nonce: this.nonce.get(address),
          },accounts.get(address))
          this.nonce.set(address, this.nonce.get(address)+1),
          this.sended ++;
          batch.add(web3.eth.sendSignedTransaction.request(txObject.rawTransaction))
        } catch (e) {
          taskLogger.error(e.toString());
        }
      }
    }
    taskLogger.info('sended: '+this.sended);
    batch.execute()
  }

  async start() {
    for (let address of accounts.keys()) {
      await this.refreshNonce(address)
    }
    // console.log(this.nonce);
    await this.refreshAvailbleAddress()
    setInterval(this.refreshAvailbleAddress.bind(this), 1000)
    setInterval(this.checkNode.bind(this), 1000)
  }
}

var task = new RepeatBatchSendCoin()
task.start()
