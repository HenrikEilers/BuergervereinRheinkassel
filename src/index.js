import React from "react";
import ReactDOM from "react-dom";
import Appdrawer from "./Appdrawer";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

import { BrowserRouter as Router } from "react-router-dom";

import "./styles.css";
import { MuiThemeProvider } from "@material-ui/core";
import blue from "@material-ui/core/colors/blue";
import red from "@material-ui/core/colors/red";

class App extends React.Component {
  render() {
    const theme = createMuiTheme({
      palette: {
        primary: blue,
        secondary: red
      }
    });

    return (
      <div className="App">
        <MuiThemeProvider theme={theme}>
          <Router basename="/Test">
            <Appdrawer />
          </Router>
        </MuiThemeProvider>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
