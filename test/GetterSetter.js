var assert = require('assert');
var Web3 = require('web3');

var contracts = require('../src/contracts');

describe('TokenCreator', function () {


    this.timeout(60000);

    var web3 = new Web3();

    var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")

    web3.setProvider(defaultProvider);
    web3.eth.defaultAccount = web3.eth.coinbase;

    var compiled = web3.eth.compile.solidity(contracts);

    var getterSetterContract;

    it('should create GetterSetterContract', function (done) {

        var abi = compiled.GetterSetter.info.abiDefinition;
        var code = compiled.GetterSetter.code;

        web3.eth.contract(abi).new({
            gas: 500000,
            data: code
        }, function (err, contract) {
            if (err) {
                console.log("Contract creation error", err);
                done(err);
            } else if (contract.address) {
                console.log("Contract Created", contract.address);
                getterSetterContract = contract;
                done();
            }
        });
    });

    it('setName', function (done) {
        getterSetterContract.setName("Willem");
        done();
    });

    it('getName', function (done) {
        setInterval(function() {
            var bytes = getterSetterContract.getName();
            console.log("bytes", bytes);
            var buffer = new Buffer(bytes.slice(2), 'hex');
            console.log("buffer", buffer);
            var name = buffer.toString('utf8');
            console.log("name", name);
            if(name === "Willem                          ") done();
        }, 1000);
    });

});