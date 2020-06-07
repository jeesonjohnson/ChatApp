import React, { useEffect, useState } from "react";
import './Navbar.css';
import axios from 'axios';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    axios('/users/status')
    .then(res =>{
      if (res.status === 200){
        setLoggedIn(true)
        setUser(res.data.data.name) 
      }
    })
  }, [loggedIn]);

  const logout = e =>{
    axios('/users/logout')
    .then(res => {
      window.location.href = "/"
    })
  }

  return (
    <div className="navbar-fixed">
      <nav>
          <div id="navbar" className="nav-wrapper">
              <img id="logo" className="brand-logo" src="logo.png" height="50" width="50" alt=""/>
              <ul id="left-navbar-list">
                  <li className="left-navbar-button"><a href="/">Why Oogwai?</a></li>
                  <li className="left-navbar-button"><a href="/pricing">Pricing</a></li>
                  <li className="left-navbar-button"><a href="/resources">Resources</a></li>
              </ul>
              
              <ul id="right-navbar-list" >
                  <li><a href="https://twitter.com/"><img className="social-media-icons" src="icon_twitter.png" alt="Twitter"/></a></li>
                  <li><a href="https://www.facebook.com/"><img className="social-media-icons" src="icon_facebook.png" alt="Facebook"/></a></li>
                  <li><a href="https://www.instagram.com/"><img className="social-media-icons" src="icon_instagram.png" alt="Instagram"/></a></li>
                  
                  {loggedIn ?
                  <li><a href="/dashboard">{user}</a></li>
                  :
                  <li><a href="/sign_up">Sign up</a></li>
                  }
                  
                  {loggedIn ?
                  <li><a onClick={logout}>Log out</a></li> 
                  :
                  <li><a href="/login">Login</a></li>
                  }
              </ul>
          </div>
      </nav>
    </div>
  );
};