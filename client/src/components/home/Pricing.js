import React, { Component } from "react";
import Navbar from "../layout/Navbar.js";
import Footer from "../layout/Footer.js";
import "./Home.css"

class Pricing extends Component {
    render() {
        return (
          <div>
            <Navbar />
            <div style={{ height: "75vh" }} className="container valign-wrapper">
              <div className="row">
                <div className="col s12 center-align">
                  <h4><span style={{ fontFamily: "monospace" }}>Pricing</span></h4>
                  <p className="flow-text grey-text text-darken-1">Since this application is currently in beta, this does not reflect the final pricing of the application, currently all aspects of the application are free</p>
                  <br />
                  <table class="responsive-table white-text">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Company Account</th>
                        <th>User Account</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td><td>Live Chats</td><td>Live Chats</td>
                      </tr>
                      <tr>
                        <td>2</td><td>Do Tasks</td><td>Do Tasks</td>
                      </tr>
                      <tr>
                        <td>3</td><td>Workspace Management</td><td>Workspace Management</td>
                      </tr>
                      <tr>
                        <td>4</td><td>Different Projects</td><td>Different Projects</td>
                      </tr>
                      <tr>
                        <td>5</td><td>Fun :)</td><td>Fun :)</td>
                      </tr>
                      <tr>
                        <td>Prices</td><td>£20./month</td><td>£1.0/month per son</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <Footer/>
          </div>
        );
      }
}

export default Pricing;