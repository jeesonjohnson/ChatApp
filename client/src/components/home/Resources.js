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
              <h4><span style={{ fontFamily: "monospace" }}>Resources</span></h4>
              <p className="flow-text grey-text text-darken-2">Chat application specialised for developers, where developers can both plan groups, assign tasks and communicate to complete a given project. Where the users communicate in a group chat, as well as private chat, where in private chat video conferencing is supported. The users also have ability to complete plugin specific features to the chat console.</p>
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