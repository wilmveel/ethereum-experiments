var assert = require('assert');

var Web3 = require('web3');

var contracts = require('../src/contracts');

var Watch = require('../src/watch');

describe('BlockChain', function () {

    var DEFAULT_GAS = 50000000000000;

    var web3 = new Web3();
    var watch = new Watch(web3);

    var defaultProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545")

    web3.setProvider(defaultProvider);
    web3.eth.defaultAccount = web3.eth.coinbase;

    var compiled = web3.eth.compile.solidity(contracts);

    var walletContract;

    describe('Test wallet contract', function () {

        this.timeout(60000);

        it('should create wallet contract', function (done) {

            var abi = compiled.Wallet.info.abiDefinition;
            var code = compiled.Wallet.code;

            web3.eth.contract(abi).new({
                gas: DEFAULT_GAS,
                data: code
            }, function (err, contract) {
                if (err) {
                    console.log("Contract creation error", err);
                    done(err);
                } else if (contract.address) {
                    console.log("Contract Created", contract.address);
                    walletContract = contract;
                    done();
                }
            });
        });

        it('should transfer 5 ether to wallet contract', function (done) {

            var transaction = web3.eth.sendTransaction({
                    from: web3.eth.coinbase,
                    to: walletContract.address,
                    value: web3.toWei(5, "ether"),
                    gas: DEFAULT_GAS
                }
            );

            watch(transaction, function () {
                assert.equal(5000000000000000000, web3.eth.getBalance(walletContract.address).toString());
                done();
            });
        });

        it('should create user', function (done) {

            walletContract.callUser.call(function (err, transaction) {
                watch(transaction, function () {
                    assert.equal(4000000000000000000, web3.eth.getBalance(walletContract.address).toString());
                    done();
                });
            });
        });

        it('should refund 1 ether back to coinbase', function (done) {

            walletContract.refund({
                gas: DEFAULT_GAS
            }, function (err, transaction) {
                watch(transaction, function () {
                    assert.equal(4000000000000000000, web3.eth.getBalance(walletContract.address).toString());
                    done();
                });
            });
        });

        it('should kill contract and refund all ether to coinbase', function (done) {

            walletContract.kill({
                gas: DEFAULT_GAS
            }, function (err, transaction) {
                watch(transaction, function () {
                    assert.equal(0, web3.eth.getBalance(walletContract.address).toString());
                    done();
                });
            });
        });

    });
});