import React, { Component } from 'react';
import './App.css';
import lottery from './lottery';
import web3 from './web3';

class App extends Component {
  
  state = {manager: '', players: [], balance: '', value: '', message: ''};


  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players  = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });

  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    console.log('accounts = ' + accounts);
    this.setState({ message: "Processing Txn"});
    await lottery.methods.enter().send({
      from: accounts[0], 
      value: web3.utils.toWei(this.state.value, 'ether')
    })

    this.setState({ message: "Txn Completed"});
  }

  pickWinner = async ()=> {
    const accounts = await web3.eth.getAccounts();
    this.setState({message: "Picking Winner...."});
    await lottery.methods.pickWinner().send({from: accounts[0]});
    this.setState({message: "Winner has been picked and Awarded with money"});

    this.forceUpdate();
  }

  render() {
    web3.eth.getAccounts().then(console.log);
    return (
      <div>
        <h2>Lottery Contract</h2><br/>
        <p>This contract is managed by {this.state.manager}<br/>
            Total Players = {this.state.players.length}<br/>
            Prize Money for Lottery Contract is {web3.utils.fromWei(this.state.balance, 'ether')} ether !
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>want to try Luck</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input value={this.state.value}
                    onChange={event => this.setState({ value: event.target.value })} />
          </div>
          <button>Enter</button>
        </form>

        <br/>
        <h2>{this.state.message}</h2><br/>
     
      <hr/>
        <h3>Pick Winner</h3><br/>
        <button onClick={this.pickWinner}>Pick Winner</button>
      <hr/>

      </div>
    
    );
  }
  
}

export default App;
