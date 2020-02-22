import React, {Component} from "react";
import moment from "moment";
import {Chart} from "react-chartjs-2";

class Performance extends Component {
    constructor(props, context) {
        super(props, context);
        this.perf = this.perf.bind(this);
    }
    datasets;
    list = [];
    perf(evt){
        var  symbol, quantity, unitvalue, request, numOfPort;
        numOfPort = this.props.num;
        var portfolio = this.props.portfolio;
        //var symbols=["NOK","MSFT","AAPL","MIN","MIC","MIL","MIX","BMV","DAX","SAR","SAS","SIM"];
        var date1=document.getElementById("date1"+numOfPort);
        var date2=document.getElementById("date2"+numOfPort);
        var symbols=this.props.symbols;//["NOK","MSFT","AAPL"];
        var portfolio = this.props.portfolio;
        var d1;//=new Date("2018-12-25");
        var d2;//=new Date("2019-01-02");
        var i;
        document.getElementById("myLargeModalLabel"+numOfPort).innerHTML = portfolio+ " performance";
        // eslint-disable-next-line no-undef
        d1= date1.value?date1.value : startDate;
        // eslint-disable-next-line no-undef
        d2= date2.value? date2.value : today;
        console.log("DATE "+d1+"-"+d2);
        if (d1 > d2) {
            alert("Starting date must be less than or equal to Ending date");
            evt.preventDefault();
            return;
        }
        //self=this;
        window.self.datasets=[];
        for(i=0; i<symbols.length; i++) {
            symbol = symbols[i];
            request = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbol + "&outputsize=full&apikey=37AAP0WVUKV2LA7I";
            var client = new XMLHttpRequest();
            client.open("GET", request, true);
            client.onreadystatechange = (function(client, symbol, i)
            {
                console.log("First");
                return function () {
                    if (client.readyState === 4) {
                        console.log("Second");
                        var obj = JSON.parse(client.responseText); // Parses the data with JSON.parse(), and the data becomes a JavaScript array.
                        if (!obj || !obj['Time Series (Daily)'] || obj['Time Series (Daily)'] === "undefined") {
                            alert("There is no history for symbol " + symbol);
                            return;
                        }
                        var dates = Object.keys(obj["Time Series (Daily)"]).reverse();
                        //var dates = keys.map(a => new Date(a));
                        var dateRange = dates.slice();
                        for (var k = dateRange.length - 1; k >= 0; k--) {
                            if (dateRange[k] > d2 || dateRange[k] < d1) {
                                dateRange.splice(k, 1);
                            }
                        }
                        var first = dates.indexOf(dateRange[0]);
                        var last = dates.indexOf(dateRange[dateRange.length - 1]);
                        var values = Object.values(obj["Time Series (Daily)"]).reverse();
                        var prices = values.map(a => a["4. close"]);
                        var priceRange = prices.slice(first, last + 1);
                        var rgb = "rgb(" + parseInt(255/symbols.length) * i + ", " + parseInt(255/symbols.length) * (symbols.length - i) + ", " + parseInt(255/symbols.length) * i + ")";
                        var dataset = {
                            label: symbol,
                            backgroundColor: rgb,
                            borderColor: rgb,
                            data: priceRange,
                            fill: false
                        };
                        window.self.datasets.push(dataset);
                        if (window.self.datasets.length === symbols.length) {
                            console.log("Third");
                            Performance.show(dateRange, window.self.datasets, numOfPort);
                        }
                    }
                };
            }(client, symbol, i));
            client.send();
        }
    }
    static show(dateRange, datasets, numOfPort) {
        console.log("datasetes", datasets );
        console.log("dateRange", dateRange );
        console.log("numofPort", numOfPort);
        var labels = dateRange.map(a => moment(a));
        //document.getElementById("myLargeModalLabel").innerHTML = portfolio;
        console.log("PORT "+numOfPort);
        var ctx = document.getElementById('myChart'+numOfPort).getContext('2d');
        console.log("CTX "+ctx);
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: labels,
                datasets: datasets,
            },
            // Configuration options go here
            options: {
                animation: {
                    duration: 0, // general animation time
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        /*time: {
                            unit: 'day'
                        }*/
                    }]
                }
            }
        });
    }

    static formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    render() {
        var num = this.props.num;
        var today = Performance.formatDate(new Date());
        var startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        startDate = Performance.formatDate(startDate);
        var buttonStyle = {};
        if (this.props.disabled) {
            buttonStyle = {cursor: 'none', opacity: 0.3};
        }
        return (
            <div className={this.props.class}>
                <button type="button" style={buttonStyle} className="open-button perf" disabled={this.props.disabled} data-toggle="modal" data-target={"#myLargeModal"+num} onClick={this.perf}>Perf data</button>

                <div className="modal fade bd-example-modal-xl" id={"myLargeModal"+num} tabIndex="-1" role="dialog" aria-labelledby={"myLargeModalLabel"+num} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={"myLargeModalLabel" + num}/>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                            <div className="modal-body">
                                <canvas id={"myChart" + num}/>
                            </div>
                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-9 offset-3 col-md-5 offset-md-0 form-check form-check-inline py-1 py-md-0">
                                        <label className="form-check-label" htmlFor={"date1"+num}>Starting time</label>&nbsp;
                                        <input className="form-check-input" type="date" id={"date1"+num} defaultValue={startDate} min="1998-01-02" max={today}/>
                                    </div>
                                    <div className="col-9 offset-3 col-md-5 offset-md-0 form-check form-check-inline py-1 py-md-0">
                                        <label className="form-check-label" htmlFor={"date2"+num}>Ending time&nbsp;</label>&nbsp;
                                        <input className="form-check-input" type="date" id={"date2"+num} defaultValue={today} min="1998-01-02" max={today}/>
                                    </div>
                                    <div className="py-1 py-md-0">
                                        <button type="button" className="btn btn-primary" onClick={this.perf}>Show</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Performance;