import React, { Component } from "react";
import { Link } from "react-router-dom";
import './Footer.css';

class Footer extends Component {
  render() {
    return (
        <footer className="page-footer">
        <div className="container">
          <div className="row">
            <div className="col l s4">
              <h5>Product</h5>
              <ul>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/api">API</Link></li>
              </ul>
            </div>
            <div className="col 4 s4">
              <h5>Company</h5>
              <ul>
                <li><Link to="/jobs">Jobs</Link></li>
                <li><Link to="/about_us">About Us</Link></li>
              </ul>
            </div>
            <div className="col 8 s4">
              <h5>More</h5>
              <ul>
                <li><Link to="/help">Help & Support</Link></li>
                <li><Link to="/about_us">About Us</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;