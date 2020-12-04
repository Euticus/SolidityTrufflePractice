const { resolve } = require("path");
const helper = require('truffle-test-helpers');

const MetaCoin = artifacts.require("MetaCoin");

contract('MetaCoin', (accounts) => {
  it('should put 10000 MetaCoin in the first account', async () => {
    const metaCoinInstance = await MetaCoin.deployed();
    const balance = await metaCoinInstance.getBalance.call(accounts[0]);

    assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
  });
  it('should send coin correctly', async () => {
    const metaCoinInstance = await MetaCoin.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber();
    const accountTwoStartingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber();

    // Make transaction from first account to second.
    const amount = 10;
    await metaCoinInstance.sendCoin(accountTwo, amount, { from: accountOne });

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber();
    const accountTwoEndingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber();


    assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
  });
  it('if no calls are made after 100 blocks, it refunds transaction', async () => {
    const metaCoinInstance = await MetaCoin.deployed();
    console.log("contract length", metaCoinInstance.constructor._json.deployedBytecode.length);

    const accountOne = accounts[0];
    const accountTwo = accounts[1];
    
    const accountOneStartingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber();
    const accountTwoStartingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber();
    console.log("accountOneStartingValue", accountOneStartingBalance)
    console.log('accountTwoStartingBalance', accountTwoStartingBalance)

    const amount = 10;

    await metaCoinInstance.sendCoin(accountTwo, amount, { from: accountOne });
    const confirmOneBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber();
    const confirmTwoBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber();
    assert.equal(confirmOneBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(confirmTwoBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");

    let block;
    let blockNumOnReceive;
    block =  await web3.eth.getBlockNumber();
    blockNumOnReceive = (await metaCoinInstance.getBlockNumber()).toNumber()

    for(let i = 0; i < 100; i++){
      helper.advanceBlock(); 
    }


    await metaCoinInstance.claimTimeout(accountTwo)
    const  accountOneEndingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber();
    const  accountTwoEndingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber();

    assert.equal(accountOneStartingBalance, accountOneEndingBalance, `Amount wasn't correctly returned`);
    assert.equal(accountTwoStartingBalance, accountTwoEndingBalance, "Amount wasn't returned properly");



      // accountOneEndingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber();
      // accountTwoEndingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber();
      // console.log("accountOneEnding", accountOneEndingBalance)
      // assert.equal(accountOneStartingBalance, accountOneEndingBalance, `Amount wasn't correctly returned`);
      // assert.equal(accountTwoStartingBalance, accountTwoEndingBalance, "Amount wasn't returned properly");


})
})