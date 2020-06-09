import React, { useEffect, useState } from "react";
import './Navbar.css';
import axios from 'axios';

import { 
  Dropdown, 
  Divider, 
  Icon, 
  Button
} from 'react-materialize'

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
      {/* <nav>
          <div id="navbar" className="nav-wrapper">
              <img id="logo" className="brand-logo" src="logo.png" height="50" width="50" alt=""/>

              <ul id="left-navbar-list" style={{marginRight:"auto"}}>
                  <li className="left-navbar-button"><a href="/">Why Oogwai?</a></li>
                  <li className="left-navbar-button"><a href="/pricing">Pricing</a></li>
                  <li className="left-navbar-button"><a href="/resources">Resources</a></li>
              </ul>
              
              <ul id="right-navbar-list"  >

                  

              </ul>
          </div>
      </nav> */}

    <nav>
      <div class="nav-wrapper">
      
    <Dropdown
      id="Dropdown_menu"
      options={{
        alignment: 'left',
        autoTrigger: true,
        closeOnClick: true,
        constrainWidth: true,
        container: null,
        coverTrigger: false,
        hover: false,
        inDuration: 150,
        onCloseEnd: null,
        onCloseStart: null,
        onOpenEnd: null,
        onOpenStart: null,
        outDuration: 250
      }}
      trigger={<a className="hide-on-large-only" node="icon-button"><Icon class="material-icons">menu</Icon></a>}
    >
        <a href="/">Why Oogwai?</a>
        <a href="/pricing">Pricing</a>
        <a href="/resources">Resources</a>
        <Divider />
        {loggedIn ?
          <a href="/dashboard">{user}</a>
          :
          <a href="/sign_up">Sign up</a>
        }
        
        {loggedIn ?
          <a onClick={logout}>Log out</a> 
          :
          <a href="/login">Login</a>
        }
    </Dropdown>
      {/* <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a> */}
      
      <ul class="left hide-on-med-and-down">
        <li className="logo"><a><img id="logo" className="brand-logo" src="logo.png" height="50" width="50" alt=""/></a></li>
        <li style={{marginLeft:200}}><a href="/">Why Oogwai?</a></li>
        <li ><a href="/pricing">Pricing</a></li>
        <li ><a href="/resources">Resources</a></li>
      </ul>

      <ul class="right hide-on-med-and-down">
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

  <ul class="sidenav" id="mobile-demo">
    <li className="left-navbar-button"><a href="/">Why Oogwai?</a></li>
    <li className="left-navbar-button"><a href="/pricing">Pricing</a></li>
    <li className="left-navbar-button"><a href="/resources">Resources</a></li>
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
  );
};