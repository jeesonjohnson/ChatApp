import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Home from "./components/home/Home.js";
import Pricing from "./components/home/Pricing.js";
import Resources from "./components/home/Resources.js";
import SignUp from "./components/auth/signUp.js";
import Login from "./components/auth/Login.js";

import Users from "./components/Users.js";
import Dashboard from "./components/dashboard/Dashboard.js";

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

class App extends Component {
  render() {
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
          light: '#0066ff',
          main: '#0044ff',
          // dark: will be calculated from palette.secondary.main,
          contrastText: '#ffcc00',
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
            {//Logout 
            }

            <Route path="/users" exact strict component={Users}/>

          </div>
          <div id="#app-dashboard">
            <Route path="/dashboard" exact strict component={Dashboard}/>
          </div>
        </Router>
      </ThemeProvider>
    );
  }
}

export default App;