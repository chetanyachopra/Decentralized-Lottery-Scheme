const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);
const {interface, bytecode}= require('../compile.js');


let accounts;
let contract;
let inbox;
const INITIAL_MESSAGE='Hi there!';

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    contract = new web3.eth.Contract(JSON.parse(interface));

    inbox = await contract.deploy({ data: bytecode, arguments: [INITIAL_MESSAGE] })
                          .send({ from : accounts[0], gas: '1000000' });
    // inbox.setProvider(provider);

});

describe('Inbox', () => {
    it('deploys a contract', ()=> {
        assert.ok(inbox.options.address);
    });

    it('Contract has a default message', async ()=> {
       const message = await inbox.methods.message().call();
       assert.equal(message, INITIAL_MESSAGE);
    });

    it('Can update Contract', async ()=> {
        const txnHash = await inbox.methods.setMessage(INITIAL_MESSAGE+'new').send({from: accounts[0]});
        console.log(txnHash);
        const updatedMessage = await inbox.methods.message().call();
        assert.equal(updatedMessage, INITIAL_MESSAGE+'new');
    });
});
//"resolve": "^1.8.1",

