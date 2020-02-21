import React, {Component} from "react";

class PortfolioPopupForm extends Component {
    constructor(props, context) {
        super(props, context);
        this.add = this.add.bind(this);
    }

    add(evt) {
        var list, portfolio, portField;
        portField = document.getElementById("name_id");
        portfolio = document.getElementById("name_id").value;
        if (portfolio.length === 0) {
            alert("The portfolio name is mandatory");
            return;
        }
        if(typeof(Storage) !== "undefined") {
            if (localStorage.portfolios) { // if list already exists
                list = JSON.parse(localStorage.getItem("portfolios")); // retrieves the list (string) from the local storage and parses it into Javascript array

                if (list.length >= 10) { // if list has 10 or more elements
                    alert("You can create only 10 portfolios");
                    return;
                } else if (list.includes(portfolio)) { // already includes the same portfolio
                    portField.value = "";
                    portField.focus();
                    alert("This portfolio already exists");
                    evt.preventDefault();
                    return;
                } else {
                    list.push(portfolio); // adds new element to the end of the list
                }
                localStorage.setItem("portfolios", JSON.stringify(list)); // converts Javascript array (list) into string and stores it into local storage
            } else { // if list does not exist
                //list.unshift(portfolio); // first element of the list
                localStorage.setItem("portfolios", JSON.stringify([portfolio]));
            }
        } else {
            document.getElementById("container").innerHTML = "Sorry, your browser does not support web storage...";
        }
    }
    render() {

        var self = this;
        //this.show();
        var buttonStyle = {};
        if (this.props.disabled) {
            buttonStyle = {cursor: 'none', opacity: 0.3};
        }
        return (
            <div className={this.props.class}>
                <button style={buttonStyle} className="open-button port" disabled={this.props.disabled} data-toggle="modal" data-target="#exampleModalCenter">Add new portfolio</button>
                <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalCenterTitle">Portfolio</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form className="form-container" id="form1">
                                    <label htmlFor="name_id"><b>name</b></label>
                                    <input type="text" placeholder="Enter portfolio" id="name_id" required/>
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

export default PortfolioPopupForm;