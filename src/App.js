import React, {Component} from 'react';
import './App.css';
import Portfolio from './Portfolio';
import PortfolioPopupForm from './PortfolioPopupForm';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      list: []
    };
    this.removePortfolio = this.removePortfolio.bind(this);
  }
  count = 0;
  list = [];
  show() {
    if(typeof(Storage) !== "undefined") {
      if (localStorage.portfolios) { // if list exists in the local storage
        this.list = JSON.parse(localStorage.getItem("portfolios")); // retrieves the list (string) from the local storage and parses it into Javascript array
      }
    } else {
      document.getElementById("container").innerHTML = "Sorry, your browser does not support web storage...";
    }
  }
  rateInit() {
    var request = "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=USD&apikey=85YZX4JTG68SG4B2";
    var client = new XMLHttpRequest();
    client.open("GET", request, true);
    window.self=this;
    client.onreadystatechange = function() {
      if (client.readyState === 4) {
        var obj = JSON.parse(client.responseText); // Parses the data with JSON.parse(), and the data becomes a JavaScript object.
        if (!obj || !obj['Realtime Currency Exchange Rate'] || typeof(obj['Realtime Currency Exchange Rate']['5. Exchange Rate']) === "undefined") {
          alert("The exchange rate service is not responding. Wait 30 seconds and try again or reload the page");
          setTimeout(window.self.rateInit, 30000);
          return;
        }
        var rate = Number(obj['Realtime Currency Exchange Rate']['5. Exchange Rate']);
        App.showRate(rate);
      }
    };
    client.send();
  }
  static showRate(rate) {
    if(typeof(Storage) !== "undefined") {
      if (!sessionStorage["rate"]) { // if list exists in the local storage
        sessionStorage.setItem("rate", rate);
      }
    } else {
      document.getElementById("container").innerHTML = "Sorry, your browser does not support web storage...";
    }
  }

  removePortfolio(e) {
    var key = "portfolios";
    var id = Number(e.target.id);
    var portfolio = this.list[id];
    var newlist = [];
    for(var i=0; i<this.list.length; i++) {
      if (i !== id) {
        newlist.push(this.list[i]);
      }
    }
    this.list = newlist.slice();
    this.setState({list: newlist});
    if(typeof(Storage) !== "undefined") {
      if (localStorage[portfolio]) { // if list exists in the local storage
        localStorage.removeItem(portfolio);  // converts Javascript array (list) into string and stores it into local storage
      }
      if (localStorage[key]) { // if list exists in the local storage
        localStorage.setItem(key, JSON.stringify(this.list));  // converts Javascript array (list) into string and stores it into local storage
      }
    } else {
      document.getElementById("container").innerHTML = "Sorry, your browser does not support web storage...";
    }
  }
  componentWillMount() {
    this.rateInit();
  }

  render() {
    this.show();
    var portfolios = [];
    for (var ii = 0; ii < this.list.length; ii++) {
      if (ii % 3 === 0 && ii < this.list.length-2 ){
        portfolios.push(<div className="row" key={ii}><Portfolio num={ii} portfolio={this.list[ii]} rate={this.rate} removePort={this.removePortfolio} key={ii}/><Portfolio num={ii+1} portfolio={this.list[ii+1]}  rate={this.rate} removePort={this.removePortfolio} key={ii+1}/><Portfolio num={ii+2} portfolio={this.list[ii+2]} rate={this.rate} removePort={this.removePortfolio} key={ii+2}/></div>);
      } else if ((ii % 3 === 0) && (ii === this.list.length-2)) {
        portfolios.push(<div className="row" key={ii}><Portfolio num={ii} portfolio={this.list[ii]} rate={this.rate} removePort={this.removePortfolio} key={ii}/><Portfolio num={ii+1} portfolio={this.list[ii+1]} rate={this.rate} removePort={this.removePortfolio} key={ii+1}/></div>);
      } else if ((ii % 3 === 0) && (ii === this.list.length-1)) {
        portfolios.push(<div className="row" key={ii}><Portfolio num={ii} portfolio={this.list[ii]} rate={this.rate} removePort={this.removePortfolio} key={ii}/></div>);
      }
    }
    var disabledAddingPortfolios = this.list.length === 10;
    return(
        <div>
          <div className="row abs">
            <PortfolioPopupForm disabled={disabledAddingPortfolios} class="col-12 py-3"/>
          </div>
          <div>{portfolios}</div>
        </div>
    )
  }
}

export default App;
