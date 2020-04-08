import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import Home from "./components/home/Home.js";
import Pricing from "./components/home/Pricing.js";
import Resources from "./components/home/Resources.js";
import SignUp from "./components/auth/signUp.js";
import SignUpCompany from "./components/auth/signUpCompany.js";
import SignUpUser from "./components/auth/signUpUser.js";
import Login from "./components/auth/Login.js";

class App extends Component {
  render() {
    return (
      <Router>
        <div id="app" className="App" style={{backgroundcolour:"#AFAFAF"}}>
          <Route exact path="/" component={Home} />
          <Route exact path="/pricing" component={Pricing} />
          <Route exact path="/resources" component={Resources} />
          <Route exact path="/sign_up" component={SignUp} />
          <Route exact path="/sign_up/company" component={SignUpCompany} />
          <Route exact path="/sign_up/user" component={SignUpUser} />
          <Route exact path="/login" component={Login} />
        </div>
      </Router>
    );
  }
}

export default App;