import React, { Component } from "react";
import './Navbar.css';

class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <ul id="dropdown1" class="dropdown-content">
            <li><a href="#!">one</a></li>
            <li><a href="#!">two</a></li>
            <li class="divider"></li>
            <li><a href="#!">three</a></li>
        </ul>
        <nav>
            <div class="nav-wrapper">
                <img id="logo" class="brand-logo" src="logo.png" height="64" width="62" alt=""/>
                <ul id="abc" class=" hide-on-med-and-down">
                    <li><a href="sass.html">Why Oogwai?</a></li>
                    <li><a href="sass.html">Pricing</a></li>
                    <li><a href="sass.html">Resources</a></li>
                </ul>
                
                <ul class="right hide-on-med-and-down">
                    <li><a href="https://twitter.com/"><img src="icon_twitter.png"/></a></li>
                    <li><a href="https://www.facebook.com/"><img src="icon_facebook.png"/></a></li>
                    <li><a href="https://www.instagram.com/"><img src="icon_instagram.png"/></a></li>
                    <li><a href="badges.html">Sign up</a></li>
                    <li><a href="badges.html">Login</a></li>
                </ul>
            </div>
        </nav>
      </div>
    );
  }
}export default Navbar;