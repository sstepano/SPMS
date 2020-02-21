import React, {Component} from "react";

class StockPopupForm extends Component {
    constructor(props, context) {
        super(props, context);
        this.add = this.add.bind(this);
    }

    add(evt) {
        var symbol, quantity, unitvalue, request, numOfPort;
        var portfolio = this.props.portfolio;
        var num = this.props.num;
        var symbolField = document.getElementById("symbol_id"+num);
        symbol = document.getElementById("symbol_id"+num).value.toUpperCase();
        if ( !(/^[a-zA-Z]+$/.test(symbol)) || symbol.length > 4) {
            document.getElementById("symbol_id"+num).focus();
            alert("The symbol must have 1, 2, 3 or 4 letters and only letters");
            evt.preventDefault();
            return true;
        }
        var quantityField = document.getElementById("quantity_id"+num);
        quantity = document.getElementById("quantity_id"+num).value;
        if (!(/^\d+$/.test(quantity))) {
            document.getElementById("quantity_id"+num).focus();
            alert("The quantity must have only digits");
            evt.preventDefault();
            return true;
        }
        quantity = Number(quantity);
        request = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=37AAP0WVUKV2LA7I";
        console.log("REQ "+request);
        var client = new XMLHttpRequest();
        client.open("GET", request, true);
        var list, stock, checklist;
        var key = portfolio;
        if (typeof(Storage) !== "undefined") {
            if (localStorage[key]) { // if list already exists
                list = JSON.parse(localStorage.getItem(key)); // retrieves the list (string) from the local storage and parses it into Javascript array
                checklist = list.map(a => a.symbol);
                if (list.length >= 50) { // if list has 50 or more elements
                    alert("You can create only 50 different stocks in the same portfolio");
                    return;
                } else if (checklist.includes(symbol)) { // already includes the same stock
                    symbolField.value = "";
                    quantityField.value = "";
                    symbolField.focus();
                    alert("This stock already exists");
                    evt.preventDefault();
                    return;
                } else {
                    client.onreadystatechange = function () {
                        if (client.readyState === 4) {
                            var obj = JSON.parse(client.responseText); // Parses the data with JSON.parse(), and the data becomes a JavaScript object.
                            if (!obj || !obj['Global Quote'] || typeof(obj['Global Quote']['02. open']) === "undefined") {
                                alert("There is no stock for the given symbol " + symbol);
                                return;
                            }
                            unitvalue = Number(obj['Global Quote']['02. open']);
                            stock = {};
                            stock["symbol"] = symbol; // creates new element of the list
                            stock["unitvalue"] = unitvalue;
                            stock["quantity"] = quantity;
                            stock["totalvalue"] = unitvalue * quantity;
                            console.log("SYM "+symbol+" "+unitvalue+" "+quantity);
                            list.push(stock); // adds new element to the end of the list
                            localStorage.setItem(key, JSON.stringify(list)); // converts Javascript array (list) into string and stores it into local storage
                        }
                    };
                }
            } else { // if list does not exist
                console.log("quantity "+quantity);
                client.onreadystatechange = function () {
                    console.log("quantity1 "+quantity);
                    if (client.readyState === 4) {
                        console.log("quantity2 "+quantity);
                        var obj = JSON.parse(client.responseText); // Parses the data with JSON.parse(), and the data becomes a JavaScript object.
                        if (!obj || !obj['Global Quote'] || typeof(obj['Global Quote']['02. open']) === "undefined") {
                            alert("There is no stock for the given symbol " + symbol);
                            return;
                        }
                        unitvalue = Number(obj['Global Quote']['02. open']);
                        stock = {};
                        stock["symbol"] = symbol; // first element of the list
                        stock["unitvalue"] = unitvalue;
                        stock["quantity"] = quantity;
                        stock["totalvalue"] = unitvalue * quantity;
                        console.log("First SYM "+symbol+" "+unitvalue+" "+quantity);
                        localStorage.setItem(key, JSON.stringify([stock]));
                    }
                };
            }
            client.send();
            //for (var i = 0; i < 1000000000; i++) ;
        } else {
            document.getElementById("container").innerHTML = "Sorry, your browser does not support web storage...";
        }
    }


    render() {
        var self = this;
        //this.show();
        var num = this.props.num;
        var buttonStyle = {};
        if (this.props.disabled) {
            buttonStyle = {cursor: 'none', opacity: 0.3};
        }
        return (
            <div className={this.props.class}>
                <button style={buttonStyle} className="open-button" disabled={this.props.disabled} data-toggle="modal" data-target={"#exampleModalCenterStock"+num}>Add stock</button>
                <div className="modal fade" id={"exampleModalCenterStock"+num} tabIndex="-1" role="dialog" aria-labelledby={"exampleModalCenterTitleStock"+num} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={"exampleModalCenterTitleStock"+num}>Stock</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form className="form-container" id="formStock">
                                    <label htmlFor="symbol_id"><b>symbol</b></label>
                                    <input type="text" placeholder="Enter stock" id={"symbol_id"+num} required/>
                                    <label htmlFor="quantity_id"><b>quantity</b></label>
                                    <input type="text" placeholder="Enter quantity" id={"quantity_id"+num} required/>
                                    <button type="submit" className="btn" onClick={this.add}>Add</button>
                                    <button type="button" className="btn cancel" data-dismiss="modal">Close</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default StockPopupForm;