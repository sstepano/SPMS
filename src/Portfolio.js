import React, {Component} from "react";
import $ from "jquery";
import StockPopupForm from './StockPopupForm';
import Performance from './Performance';

class Portfolio extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedStocks: [],
            list: [],
            rate: 1,
            //portfolio: ""
        };
        this.removeSelected = this.removeSelected.bind(this);
        this.checked = this.checked.bind(this);
        this.rateClick = this.rateClick.bind(this);
        this.sortBy = this.sortBy.bind(this);
        this.compareBy = this.compareBy.bind(this);
        //this.add = this.add.bind(this);
    }
    count = 0;
    portfolios =[];
    flag = false;
    showPort() {
        var key = this.props.portfolio;
        if(typeof(Storage) !== "undefined") {
            if (localStorage[key]) { // if list exists in the local storage
                this.state.list = JSON.parse(localStorage.getItem(key)); // retrieves the list (string) from the local storage and parses it into Javascript array
            }
        } else {
            document.getElementById("container").innerHTML = "Sorry, your browser does not support web storage...";
        }
    }

    checked(e) {
        var id = e.target.id.substring(1);
        this.state.selectedStocks[id] = e.target.checked;
        for(var j=0; j<this.state.list.length && !this.state.selectedStocks[j]; j++ );
        if(j < this.state.list.length) {
            this._remove.disabled = false;
            this._remove.style.cursor = 'pointer';
            this._remove.style.opacity = '0.8';
            var self=this;
            $(this._remove).hover(function(){self._remove.style.opacity = '1';}, function(){self._remove.style.opacity = '0.8';});
        } else {
            this._remove.disabled = true;
            this._remove.style.cursor = 'none';
            this._remove.style.opacity = '0.3';
            $(this._remove).hover(function(){});
        }
    }
    removeSelected(e) {
        this._remove.disabled = true;
        this._remove.style.cursor = 'none';
        this._remove.style.opacity = '0.3';
        $(this._remove).hover(function(){});
        var key = this.props.portfolio;
        var newlist=[];
        for(var i=0; i<this.state.list.length; i++) {
            if (!this.state.selectedStocks[i]) {
                newlist.push(this.state.list[i]);
            }
            $('#'+this.props.num+i).prop('checked', false);
        }
        this.state.list = newlist.slice();
        this.setState({selectedStocks: this.state.selectedStocks});
        if(typeof(Storage) !== "undefined") {
            if (localStorage[key]) { // if list exists in the local storage
                localStorage.setItem(key, JSON.stringify(this.state.list));  // converts Javascript array (list) into string and stores it into local storage
            }
        } else {
            document.getElementById("container").innerHTML = "Sorry, your browser does not support web storage...";
        }
    }

    rateClick(e) {
        if (this._euro.checked === true) {
            this.state.rate = 1;
            this.setState({rate: this.state.rate});
        } else {
            this.findRate();
            this.setState({rate: this.rate});
        }
    }

    findRate() {
        if(typeof(Storage) !== "undefined") {
            if (sessionStorage["rate"]) { // if list exists in the local storage
                this.rate = sessionStorage.getItem("rate"); // retrieves the list (string) from the local storage and parses it into Javascript array
            }
        } else {
            document.getElementById("container").innerHTML = "Sorry, your browser does not support web storage...";
        }
    }

    compareBy = (key) => {
        return function(a, b) {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        };
    };

    sortBy = (key) => {
        let arrayCopy = this.state.list.slice();
        arrayCopy.sort(this.compareBy(key));
        this.setState({list: arrayCopy});
    };

    componentWillMount() {
        this.showPort();
    }
    componentDidMount() {
        this._euro.checked = true;
    }

    render() {
        var tdc={colSpan: 5};
        var self=this;
        var stocks = [];
        var totalvalue=0;
        var symbols = [];
        var currency = "&euro;";
        if(this.state.rate === 1) {
            currency = '\u20AC';
        } else {
            currency = '$';//\u0024';
        }
        for (var ii = 0; ii < this.state.list.length; ii++) {
            var symbol = this.state.list[ii]["symbol"];
            symbols.push(symbol);
            var unitvalue = parseFloat(this.state.list[ii]["unitvalue"]*this.state.rate).toFixed(2);
            var quantity = this.state.list[ii]["quantity"];
            var totalvalueStock = parseFloat(this.state.list[ii]["totalvalue"]*this.state.rate).toFixed(2);
            var stock = (
                <tr key={ii}>
                    <td>{symbol}</td>
                    <td>{unitvalue+currency}</td>
                    <td>{quantity}</td>
                    <td>{totalvalueStock+currency}</td>
                    <td><input id={this.props.num.toString()+ii} type="checkbox" onChange={this.checked}/></td>
                </tr>
            );
            totalvalue += Number(totalvalueStock);
            stocks.push(stock);
        }
        totalvalue = parseFloat(totalvalue.toString()).toFixed(2);
        var disabled = this.state.list.length === 0;
        var disabledAddingStocks = this.state.list.length === 50;

        return (
            <div className={"col portfolio rel"}>
                <div className="row">
                    <div className="col-12 col-sm-4 title">
                        <p>{this.props.portfolio}</p>
                    </div>
                    <div className="col col-sm-7">
                        <p>
                            Show in &euro;&nbsp;<input type="radio" disabled={disabled} name={this.props.portfolio} ref={function(e4){self._euro = e4;}}  onChange={this.rateClick} />&ensp;
                            Show in $&nbsp;<input type="radio" disabled={disabled} name={this.props.portfolio} ref={function(e5){self._checked = e5;}} onChange={this.rateClick} />
                        </p>
                    </div>
                    <div className="col-1 px-1">
                        <p><button id={this.props.num} type="submit" className="button" onClick={this.props.removePort} key={(this.count++).toString()}>x</button></p>
                    </div>
                </div>
                <div className="row horizscroll">
                    <div className="col-12">
                        <table className="portfoliotable" id={"table"+this.props.num}>
                            <thead id={"thead"+this.props.num}>
                            <tr>
                                <th onClick={() => this.sortBy("symbol")}>Name</th>
                                <th onClick={() => this.sortBy("unitvalue")}>Unit value</th>
                                <th onClick={() => this.sortBy("quantity")}>Quantity</th>
                                <th onClick={() => this.sortBy("totalvalue")}>Total value</th>
                                <th>Select</th>
                            </tr>
                            </thead>
                            <tbody id={"thead"+this.props.num} ref={function(e7){self["_table"] = e7;}}>
                            {stocks}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row py-1">
                    <div className="col-12 title">
                        <p>Total value of {this.props.portfolio}: {totalvalue+currency}</p>
                    </div>
                </div>
                <div className="row"><br/><br/></div>
                <div className="row down">
                    <StockPopupForm num={this.props.num} portfolio={this.props.portfolio} disabled={disabledAddingStocks} class="col-6 col-md"/>
                    <Performance num={this.props.num} portfolio={this.props.portfolio} symbols={symbols} class="col-6 col-md" disabled={disabled}/>
                    <div className="col-6 col-md">
                        <button className="open-button-remove downbut3" ref={function(e6){self._remove = e6;}} onClick={this.removeSelected}>Remove selected</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Portfolio;