import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Home from "./components/home/Home.js";
import Pricing from "./components/home/Pricing.js";
import Resources from "./components/home/Resources.js";
import SignUp from "./components/auth/signUp.js";
import Login from "./components/auth/Login.js";
import Dashboard from "./components/dashboard/Dashboard.js";

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

export default function App() {
    const theme = createMuiTheme({
      palette: {
        type: 'dark',
        primary: {
          // light: will be calculated from palette.primary.main,
          main: '#202225',
          // dark: will be calculated from palette.primary.main,
          // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
          light: '#f1b92e',
          main: '#725bda',
          // dark: will be calculated from palette.secondary.main,
          contrastText: '#ffcc00',
        },
        delete: {
          main: "#f1b92e",
        },
        // Used by `getContrastText()` to maximize the contrast between
        // the background and the text.
        contrastThreshold: 3,
        // Used by the functions below to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.2,
      },
      
    });

    return (
      <ThemeProvider theme={theme}>
        <Router>
          <div id="app" style={{fontFamily:"Roboto"}}>
            <Route exact path="/" component={Home}/>
            <Route exact path="/pricing" component={Pricing} />
            <Route exact path="/resources" component={Resources} />
            <Route exact path="/sign_up" component={SignUp} />
            <Route exact path="/login" component={Login} />
          </div>
          <div id="#app-dashboard" style={{overflow:"hidden"}}>
            <Route exact path="/dashboard" component={Dashboard}/>
          </div>
          
        </Router>
      </ThemeProvider>
    );
}
