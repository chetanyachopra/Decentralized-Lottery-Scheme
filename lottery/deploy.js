const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile.js');
const fs = require('fs');

const infuraEndPoint = 'https://rinkeby.infura.io/v3/67f490d65ef541db88540c6c1d5df13a';
let  secretMnemonic = "use clock excess chuckle return enact net credit raw board wild recipe";

const provider = new HDWalletProvider(secretMnemonic, infuraEndPoint);
const web3 = new Web3(provider);

fs.writeFile('../lottery-abi', interface, (err) => {console.log("@cheti - err- " + err)});

const deploy = async () => {
    let accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy contract from account = " + accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: '0x'+bytecode })
        .send({ from: accounts[0]});
    fs.writeFile('../lottery-address', await result.options.address, (err)=> {console.log(err)});
    console.log('Contract deployed to = ', await result.options.address);
};
deploy().then(value => console.log(value)).catch( e => console.log(e));