import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import theme from './theme';

import Header from './features/Header';

class App extends Component {
  render() {
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Switch>
            <Route path="/" component={Header} />
          </Switch>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;
