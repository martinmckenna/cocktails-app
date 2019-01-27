import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import theme from './theme';

import Header from './features/Header';
import Home from './features/Home';
import SearchLanding from './features/SearchLanding';

class App extends Component {
  render() {
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/search" component={SearchLanding} />
          </Switch>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;
