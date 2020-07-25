import Web3 from 'web3';
let web3;

// authenticate metamask to inject web3 in browser
const authenticate = async() => {
    if(window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
        } catch (error) {
            console.log("user is denied Access error = "+ error);
        }
    }
    else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    }
    else {
        console.log("non ethereum browser detected");
    }
}

authenticate();


export default web3;