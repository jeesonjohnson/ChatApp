import React, { Component } from "react";
import Navbar from "../layout/Navbar.js";
import Footer from "../layout/Footer.js";
import "./Home.css"

class Resources extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div style={{ height: "75vh" }} className="container valign-wrapper">
          <div className="row">
            <div className="col s12 center-align">
              <h4>This is the {" "}<span style={{ fontFamily: "monospace" }}>Resources</span> page</h4>
              <p className="flow-text grey-text text-darken-1">Placeholder text</p>
              <br />
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default Resources;