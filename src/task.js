var Web3 = require('web3');
const execFile = require('child_process').execFile;
const execFileSync = require('child_process').execFileSync;
var net = require('net');
var taskLogger = require('./taskLogger')
var accounts = require('../config/accounts')
var nodes = require('../config/nodes')
var web3 = new Web3(nodes[0].url, net);

const PowerLimit = 50515982000000000;
const TransPerBatch = 50;
const CheckNodePeriod = 2000;
const SendcoinPeriod = 299;
const TaskRestartPeriod = 2 * 60 * 60 * 1000;

class RepeatBatchSendCoin {
    constructor() {
        this.availbleAccounts = new Set();
        this.power = new Map();
        this.nonce = new Map();
        this.sended = 0;
        this.isAvailble = true;
        this.uptime = 0;
    }

    // refreshAvailbleAddress() {
    //     for (let address of accounts.keys()) {
    //         try {
    //             execFile(`/root/go-etherzero/build/bin/geth`, ['attach', '/root/.etztest/geth.ipc', '--exec', `eth.getPower("${address}")`], (error, stdout, stderr) => {
    //               if (error) {
    //                 throw error;
    //               }
    //               let power = Number(stdout);
    //               this.power.set(address, power);
    //               // console.log(address + ':' + power);
    //               if (power < PowerLimit) {
    //                   this.availbleAccounts.delete(address);
    //               } else {
    //                   this.availbleAccounts.add(address);
    //               }
    //             });
    //             // let power = await web3.eth.getPower(address);
    //         } catch (e) {
    //             taskLogger.error(e.toString());
    //         }
    //     }
    //     console.log(this.availbleAccounts);
    //     // taskLogger.info('sended: ' + this.sended);
    //     console.log('sended: ' + this.sended);
    // }
    async checkSyncing() {
      let syncing = await web3.eth.isSyncing();
      console.log(syncing);
      if (syncing == false) {
        return
      } else {    
        process.exit(1);
      }
    }

    checkNode() {
        try {
          if (this.uptime > TaskRestartPeriod) {
            process.exit(1);
          }
          this.uptime += CheckNodePeriod;
            execFile(`/root/go-etherzero/build/bin/geth`, ['attach', '/root/.etztest/geth.ipc', '--exec', 'txpool.status'], (error, stdout, stderr) => {
              if (error) {
                throw error;
              }
              let data = eval('(' + stdout + ')')
              if (data.pending + data.queued > 5000) {
                  console.log(new Date() + ": task fail");
                  process.exit(1);
              }
              if (data.pending + data.queued > 3000) {
                  // if (this.intervalId != null) {
                  //   clearInterval(this.intervalId)
                  //   this.intervalId = null;
                  //   taskLogger.info('task stop');
                  // }
                  if (this.isAvailble) {
                      this.isAvailble = false;
                      taskLogger.info('task stop');
                  }
              } else if (!this.isAvailble) {
                  taskLogger.info('task restart');
                  this.isAvailble = true
              }
              console.log(data);
            });
        } catch (e) {
            taskLogger.error(e.toString());
            taskLogger.error(data.toString());
            if (this.isAvailble) {
                this.isAvailble = false;
                taskLogger.info('task stop');
            }
        }
    }

    async refreshNonce(address) {
        let nonce = await web3.eth.getTransactionCount(address, 'pending');
        this.nonce.set(address, nonce);
        console.log(this.nonce);
    }

    async sendcoin() {
        try {
            if (this.isAvailble) {
                let batch = new web3.eth.BatchRequest()
                let batchSize = 0;
                for (let address of this.availbleAccounts) {
                    for (let i = 0; i < TransPerBatch; i++) {
                        try {
                            let txObject = await web3.eth.accounts.signTransaction({
                                to: '0xAABe8da4AF6CCC2d8DeF6F4e22DcE92B0cc845bd',
                                value: '1',
                                chainId: 90,
                                gas: '210000',
                                gasPrice: '1000000000',
                                nonce: this.nonce.get(address),
                            }, accounts.get(address))
                            this.nonce.set(address, this.nonce.get(address) + 1),
                            this.sended++;
                            batchSize++;
                            batch.add(web3.eth.sendSignedTransaction.request(txObject.rawTransaction))
                        } catch (e) {
                            taskLogger.error(e.toString());
                        }
                    }
                }
                if (batchSize > 0) {
                  try {
                    const batchResults = await batch.execute();
                  } catch (e) {
                    // console.log(e);
                  }
                  console.log('sended: ' + this.sended);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    async start() {
        for (let address of accounts.keys()) {
            await this.refreshNonce(address);
        }
        for (let address of accounts.keys()) {
          this.availbleAccounts.add(address);
        }
        console.log(this.nonce);
        // await this.refreshAvailbleAddress()
        // console.log(this.availbleAccounts);
        // setInterval(this.refreshAvailbleAddress.bind(this), 1000)
        setInterval(this.checkSyncing.bind(this), 10000)
        setInterval(this.checkNode.bind(this), CheckNodePeriod);
        setInterval(this.sendcoin.bind(this), SendcoinPeriod);
    }
}

var task = new RepeatBatchSendCoin()
task.start()
