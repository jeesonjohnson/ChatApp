import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./Home.css"

import Navbar from "../layout/Navbar.js";
import Footer from "../layout/Footer.js";

import { Carousel, Tabs, Tab, Button, Card, Row, Col } from 'react-materialize';

class Home extends Component {
  render() {
    return (
      <div id="cl">
        <Navbar/>
        <div style={{  }} className="container valign-wrapper">
          <div className="row">
            <div className="col s12 center-align" >
              <br/>
              <i>For Developers By Developers</i>
              <Carousel carouselId="Carousel-2" images={['icon_twitter.png', 'icon_facebook.png', 'icon_instagram.png']} options={{ dist: -200, duration: 200, fullWidth: false, indicators: true, noWrap: false, numVisible: 5, onCycleTo: null, padding: 0, shift: 0 }}/>
              <div style={{paddingTop:100, paddingBottom: 50}}>
                <h5>What is Oogwai?</h5>
                <p>Oogwai provides effective communication and organisation within a company. Providing a variety of unique tools specifically designed for developers of both software and hardware.</p>
              </div>
              <br/>
              <Tabs className="tabs z-depth-1 grey darken-4" style={{ backgroundColor: "#2f3136" }}>
                <Tab active options={{ duration: 300, onShow: null, responsiveThreshold: Infinity, swipeable: false }} title="Tools" >
                  <div className="row" style={{backgroundColor: "#2f3136", margin: 0}}>
                    <img className="col s2" src="icon_translate.png"/>
                    <p className="col s10">Google Translate allows you to seamlessly communicate with anyone across the world</p>
                  </div>
                  <div className="row" style={{backgroundColor: "#2f3136", margin: 0}}>
                    <img className="col s2" src="icon_weather.png"/>
                    <p className="col s10">With weather support you can plan your meetings and tasks with respect to your environment</p>
                  </div>
                  <div className="row" style={{backgroundColor: "#2f3136", margin: 0}}>
                    <img className="col s2" src="icon_morningstar.png"/>
                    <p className="col s10">Whether you are tracking your own company, your competitors, or monitoring the market</p>
                  </div>
                </Tab>
                <Tab options={{ duration: 300, onShow: null, responsiveThreshold: Infinity, swipeable: false }} title="Communication">
                <div className="row" style={{backgroundColor: "#2f3136", margin: 0}}>
                    <img className="col s2" src="icon_twitter.png"/>
                    <p className="col s10">Placeholder</p>
                  </div>
                </Tab>
                <Tab options={{ duration: 300, onShow: null, responsiveThreshold: Infinity, swipeable: false }} title="Organisation">
                <div className="row" style={{backgroundColor: "#2f3136", margin: 0}}>
                    <img className="col s2" src="icon_twitter.png"/>
                    <p className="col s10">Placeholder</p>
                  </div>
                </Tab>
              </Tabs>
              <div className="col s6">
                <Link to="/sign_up" style={{width: "140px", borderRadius: "3px", letterSpacing: "1.5px"}} className="btn btn-large waves-effect waves-light hoverable blue accent-3">Register</Link>
              </div>
              <div className="col s6">
                <Link to="/login" style={{width: "140px", borderRadius: "3px", letterSpacing: "1.5px"}} className="btn btn-large waves-effect hoverable white black-text">Log In</Link>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default Home;