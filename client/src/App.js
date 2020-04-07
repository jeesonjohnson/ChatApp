import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import Home from "./components/homepage/Home.js";
import Pricing from "./components/homepage/Pricing.js";
import Resources from "./components/homepage/Resources.js";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Home} />
          <Route exact path="/pricing" component={Pricing} />
          <Route exact path="/resources" component={Resources} />
        </div>
      
      </Router>
    );
  }
}

export default App;
