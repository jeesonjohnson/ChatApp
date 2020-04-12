import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Home from "./components/home/Home.js";
import Pricing from "./components/home/Pricing.js";
import Resources from "./components/home/Resources.js";
import SignUp from "./components/auth/signUp.js";
import Login from "./components/auth/Login.js";

import Users from "./components/Users.js";

class App extends Component {
  render() {
    const currentUser = "";
    return (
      <Router>
        <div id="app">
          <Route exact path="/" component={Home} />
          <Route exact path="/pricing" component={Pricing} />
          <Route exact path="/resources" component={Resources} />
          <Route exact path="/sign_up" component={SignUp} />
          <Route exact path="/login" component={Login} />
          {//Logout 
          }

          <Route path="/users" exact strict component={  Users}/>
        </div>
      </Router>
    );
  }
}

export default App;