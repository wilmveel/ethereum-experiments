var fs = require('fs');

require.extensions['.sol'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};


var contracts = {
    //app: require('./contracts/App.sol'),
    grant: require('./contracts/Grant.sol'),
    user: require('./contracts/User.sol'),
    userFactory: require('./contracts/UserFactory.sol'),
    token: require('./contracts/Token.sol'),
    getterSetter: require('./contracts/GetterSetter.sol'),
    wallet: require('./contracts/Wallet.sol'),
    //resource: require('./contracts/Resource.sol')
};

var all = ""
Object.keys(contracts).forEach(function(key) {
    all += contracts[key]
});

module.exports = all;