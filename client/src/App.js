import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Home from "./components/home/Home.js";
import Pricing from "./components/home/Pricing.js";
import Resources from "./components/home/Resources.js";
import SignUp from "./components/auth/signUp.js";
import Login from "./components/auth/Login.js";

import Users from "./components/Users.js";
import Dashboard from "./components/auth/Dashboard.js";

class App extends Component {
  render() {
    return (
      <Router>
        <div id="app">
          <Route exact path="/" component={Home}/>
          <Route exact path="/pricing" component={Pricing} />
          <Route exact path="/resources" component={Resources} />
          <Route exact path="/sign_up" component={SignUp} />
          <Route exact path="/login" component={Login} />
          {//Logout 
          }

          <Route path="/users" exact strict component={Users}/>
          
        </div>
        <div id="#app-dashboard">
          <Route path="/dashboard" exact strict component={Dashboard}/>
        </div>
      </Router>
    );
  }
}

export default App;