const assert = require('assert');
const ganace = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganace.provider())

const { interface, bytecode } = require("../compile");

let accounts;
let lottery;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: '0x'+bytecode })
        .send({ from: accounts[0], gas: '1000000'})
});

describe('Lottery Contract ', () => {
   it('deploys a contract', () => {
       assert.ok(lottery.options.address);
   });

   it('allow players to enter', async () => {
       await lottery.methods.enter().send({
           from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
       });

       const players = await lottery.methods.getPlayers().call({
           from: accounts[0]
       });

       assert.equal(accounts[0], players[0]);
       assert.equal(1, players.length);
   });

   it('do not enter if payble is less than .01 ether', async ()=> {
       try {
           await lottery.methods.enter().send({
               from: accounts[0], value: web3.utils.toWei('0.001', 'ether')
           });
           assert(false);
       }catch(err) {
          assert.ok(err);
       }
       const players = await lottery.methods.getPlayers().call({from: accounts[0]});
       assert.equal(0, players.length);
   });

   it('only manager calls pick function', async ()=> {
       try {
           await lottery.methods.pickWinner().call( { from: accounts[1] });
           assert(false);
       }catch (err) {
           assert.ok(err);
       }
   });
});

