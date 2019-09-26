var Web3 = require('web3');
var nodes = require('../config/nodes');
var net = require('net');
var web3 = new Web3(nodes[0].url, net);
var accounts = require('../config/accounts')
class RepeatBatchSendCoin {
  constructor() {
      this.availbleAccounts = new Set();
      this.power = new Map();
      this.nonce = new Map();
      this.sended = 0;
      this.isAvailble = true;
      this.uptime = 0;
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
                        try {
                          let balance = await web3.eth.getBalance(address);
                            let txObject = await web3.eth.accounts.signTransaction({
                                to: '0x763edBB7A33c2D9Ed6775D5b24225A469673BE99',
                                value: balance,
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
        console.log("finshed nonce:", this.nonce);
        await this.checkSyncing();
        await this.checkNode();
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
