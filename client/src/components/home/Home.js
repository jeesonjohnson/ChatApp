import React, { Component } from "react";
import "./Home.css"
import Navbar from "../layout/Navbar";

class Home extends Component {
  render() {
    return (
      <div>
        <Navbar/>
        <div style={{ height: "50vh" }} className="container valign-wrapper">
          <div className="row">
            <div className="col s12 center-align">
              <h4>This is the {" "}<span style={{ fontFamily: "monospace" }}>Home</span> page</h4>
            <p className="flow-text grey-text text-darken-1">Placeholder text</p>
            <br />
            <div className="col s6">
              <a to="/register" style={{width: "140px", borderRadius: "3px", letterSpacing: "1.5px"}} className="btn btn-large waves-effect waves-light hoverable blue accent-3">Register</a>
              </div>
              <div className="col s6">
                <a to="/login" style={{width: "140px", borderRadius: "3px", letterSpacing: "1.5px"}} className="btn btn-large btn-flat waves-effect white black-text">Log In</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;