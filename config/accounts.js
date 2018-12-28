// var accounts = [
//   {address: '0xb41b3986c377A8F914BF0A6DA54B6F7a60610819', privateKey: '0x683b9443fae9942a56041af43fea01b544eaa33142e3224fca324eb00a8e23e7', isAvailble: true},
//   {address: '0x2Fa047F243F4016932bB1a26a4ea3EC6F7222941', privateKey: '0x7e97a06c7b1ecf5abddb581c3f0eff7f0f49c256636d48392a7bd17f2ba139ae', isAvailble: true},
//   {address: '0xE0EABE408dEB2aBF756790D1a94f4E24Fb2e84D9', privateKey: '0xa89903adc50de3f1988781712be959ba358c6f415d9b33c06a08bbc9910d5aff', isAvailble: true},
//   {address: '0x5E3399d767F7604Ef742d0D27788C774430aa45b', privateKey: '0x6affbbc6f45929c5a631f1e96fafaf606b6f755aa88f9c2547789e4332a554db', isAvailble: true},
//   {address: '0xE2ACa5fF095fc28527577dA0e6c698795c52164c', privateKey: '0x9d1958ef1705f3f038cc13635cc162e868dd56bbc4494c06de373c7ec11270ae', isAvailble: true},
//   {address: '0x4576821ecB2A9aE48023e95a290D2518213f3eaC', privateKey: '0xe4681b1fe2f84287f891cf0b8ea8d4c70d9fb303cf62dd7fa47e51ac969f5884', isAvailble: true},
//   {address: "0x59658AfE14a47B6951A11fc03eF0f1f0cCc7D512", privateKey: "0x937db4af8d6f0f761e132491585a01407e93591817fdae3974077680bce62237", isAvailble: true},
//   {address: "0x68B6d3F2a05d692fb99a8F37ba0c945C2f9d797D", privateKey: "0xb5ec95d27f97f3f283d184bc36baceb507990494364554d8ce7ca1a860667f2e", isAvailble: true},
//   {address: "0xD85675A6C9F887f3181A3d6FdC0f7da021fdF5C7", privateKey: "0x4db4062eb7a4eebdae6f5f7cb216c4c6c8ce95497ecdece64e1ffc62bd35e574", isAvailble: true},
//   {address: "0x0d69886fdD828E8Ad590fdbE3509102F99503A08", privateKey: "0x445a806517157bc42751a7f98e87795ccb038c0f884152b6b2755a3d123d5295", isAvailble: true},
//   {address: "0xa5E79a01056Fe58Fb1Cd21e2a3e7327Fb6110c6A", privateKey: "0x3a56da2e7e759a2fd3a0102665aeed520db264552186027b2939809445438174", isAvailble: true},
// ]
var accounts = new Map()
accounts.set('0xb41b3986c377A8F914BF0A6DA54B6F7a60610819', '0x683b9443fae9942a56041af43fea01b544eaa33142e3224fca324eb00a8e23e7')
accounts.set('0x2Fa047F243F4016932bB1a26a4ea3EC6F7222941', '0x7e97a06c7b1ecf5abddb581c3f0eff7f0f49c256636d48392a7bd17f2ba139ae')
accounts.set('0xE0EABE408dEB2aBF756790D1a94f4E24Fb2e84D9', '0xa89903adc50de3f1988781712be959ba358c6f415d9b33c06a08bbc9910d5aff')
accounts.set('0x5E3399d767F7604Ef742d0D27788C774430aa45b', '0x6affbbc6f45929c5a631f1e96fafaf606b6f755aa88f9c2547789e4332a554db')
accounts.set('0xE2ACa5fF095fc28527577dA0e6c698795c52164c', '0x9d1958ef1705f3f038cc13635cc162e868dd56bbc4494c06de373c7ec11270ae')
accounts.set('0x4576821ecB2A9aE48023e95a290D2518213f3eaC', '0xe4681b1fe2f84287f891cf0b8ea8d4c70d9fb303cf62dd7fa47e51ac969f5884')
accounts.set('0x59658AfE14a47B6951A11fc03eF0f1f0cCc7D512', '0x937db4af8d6f0f761e132491585a01407e93591817fdae3974077680bce62237')
accounts.set('0x68B6d3F2a05d692fb99a8F37ba0c945C2f9d797D', '0xb5ec95d27f97f3f283d184bc36baceb507990494364554d8ce7ca1a860667f2e')
accounts.set('0xD85675A6C9F887f3181A3d6FdC0f7da021fdF5C7', '0x4db4062eb7a4eebdae6f5f7cb216c4c6c8ce95497ecdece64e1ffc62bd35e574')
accounts.set('0x0d69886fdD828E8Ad590fdbE3509102F99503A08', '0x445a806517157bc42751a7f98e87795ccb038c0f884152b6b2755a3d123d5295')
accounts.set('0xa5E79a01056Fe58Fb1Cd21e2a3e7327Fb6110c6A', '0x3a56da2e7e759a2fd3a0102665aeed520db264552186027b2939809445438174')

// for (var i = 0; i < accounts.length; i++) {
//   console.log(`accounts.set('${accounts[i].address}', '${accounts[i].privateKey}')`);
// }

module.exports = accounts;
