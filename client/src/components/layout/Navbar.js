import React, { Component } from "react";
import './Navbar.css';

class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <nav>
            <div id="navbar" className="nav-wrapper">
                <img id="logo" className="brand-logo" src="logo.png" height="50" width="50" alt=""/>
                <ul id="left-navbar-list" className=" hide-on-med-and-down">
                    <li className="left-navbar-button"><a href="/">Why Oogwai?</a></li>
                    <li className="left-navbar-button"><a href="/pricing">Pricing</a></li>
                    <li className="left-navbar-button"><a href="/resources">Resources</a></li>
                    <li className="left-navbar-button"><a href="/users">Users(DELETE)</a></li>
                </ul>
                
                <ul id="right-navbar-list" className="right hide-on-med-and-down">
                    <li><a href="https://twitter.com/"><img className="social-media-icons" src="icon_twitter.png" alt="Twitter"/></a></li>
                    <li><a href="https://www.facebook.com/"><img className="social-media-icons" src="icon_facebook.png" alt="Facebook"/></a></li>
                    <li><a href="https://www.instagram.com/"><img className="social-media-icons" src="icon_instagram.png" alt="Instagram"/></a></li>
                    <li><a href="/sign_up">Sign up</a></li>
                    <li><a href="/login">Login</a></li>
                </ul>
            </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;