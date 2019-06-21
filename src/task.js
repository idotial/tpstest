var Web3 = require('web3');
const execFile = require('child_process').execFile;
const execFileSync = require('child_process').execFileSync;
var net = require('net');
var taskLogger = require('./taskLogger')
var accounts = require('../config/accounts')
var nodes = require('../config/nodes')
var web3 = new Web3(nodes[0].url, net);

const PowerLimit = 50515982000000000
const transPerBatch = 50

class RepeatBatchSendCoin {
    constructor() {
        this.availbleAccounts = new Set();
        this.power = new Map();
        this.nonce = new Map();
        this.sended = 0;
        this.isAvailble = true;
    }

    async refreshAvailbleAddress() {
        for (let address of accounts.keys()) {
            try {
                execFile(`/home/ec2-user/go-etherzero/build/bin/geth`, ['attach', '/home/ec2-user/.etztest/geth.ipc', '--exec', `eth.getPower("${address}")`], (error, stdout, stderr) => {
                  if (error) {
                    throw error;
                  }
                  let power = Number(stdout);
                  this.power.set(address, power);
                  // console.log(address + ':' + power);
                  if (power < PowerLimit) {
                      this.availbleAccounts.delete(address);
                  } else {
                      this.availbleAccounts.add(address);
                  }
                });
                // let power = await web3.eth.getPower(address);
            } catch (e) {
                taskLogger.error(e.toString());
            }
        }
        console.log(this.availbleAccounts);
        // taskLogger.info('sended: ' + this.sended);
        console.log('sended: ' + this.sended);
    }

    checkNode() {
        try {
            execFile(`/home/ec2-user/go-etherzero/build/bin/geth`, ['attach', '/home/ec2-user/.etztest/geth.ipc', '--exec', 'txpool.status'], (error, stdout, stderr) => {
              if (error) {
                throw error;
              }
              let data = eval('(' + stdout + ')')
              if (data.pending + data.queued > 2000) {
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
                    for (let i = 0; i < transPerBatch; i++) {
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
                  batch.execute();
                }
            }
        } catch (e) {
            console.log('qwer:',e);
        }

    }

    async start() {
        for (let address of accounts.keys()) {
            await this.refreshNonce(address)
        }
        console.log(this.nonce);
        await this.refreshAvailbleAddress()
        // console.log(this.availbleAccounts);
        setInterval(this.refreshAvailbleAddress.bind(this), 1000)
        setInterval(this.checkNode.bind(this), 1000)
        setInterval(this.sendcoin.bind(this), 500)
    }
}

var task = new RepeatBatchSendCoin()
task.start()
