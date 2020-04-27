import React, { Component } from "react";
import './Navbar.css';
import axios from 'axios';

class Navbar extends Component {
  constructor(){
    super()
    this.state = {
      loggedIn: false,
      user: ""
    }
  };

  componentDidMount() {
    axios('/users/status')
    .then(res =>{
      if (res === false){
        this.setState({
          loggedIn: false
        })
      }
      else {
        this.setState({
          loggedIn: true,
          user: res.data.data.name
        })
        
      }
    })
    .catch(err => {
      console.log('Error from getting user status')
    })

  }

  logout = e =>{
    axios('/users/logout')
    .then(res => {
      window.location.href = "/"
    })
  }

  render() {
    const loggedIn = this.state.loggedIn;
    const user = this.state.user;
    var button1 = null;
    var button2 = null;

    if(loggedIn) { 
      button1 = <li><a >{user}</a></li>
      button2 = <li><a onClick={this.logout.bind(this)}>Log out</a></li> 
    }
    else {
      button1 = <li><a href="/sign_up">Sign up</a></li>
      button2 = <li><a href="/login">Login</a></li>
    }

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
                    {button1}
                    {button2}
                </ul>
            </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;