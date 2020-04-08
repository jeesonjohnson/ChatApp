import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import Home from "./components/home/Home.js";
import Pricing from "./components/home/Pricing.js";
import Resources from "./components/home/Resources.js";

class App extends Component {
  render() {
    return (
      <Router>
        <div id="app" className="App">
          <Route exact path="/" component={Home} />
          <Route exact path="/pricing" component={Pricing} />
          <Route exact path="/resources" component={Resources} />
        </div>
      
      </Router>
    );
  }
}

export default App;
