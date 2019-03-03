import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import React, { Component } from 'react';
// import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import theme from './theme';

// import store from 'src/store';

import Footer from 'src/features/Footer';
import Login from 'src/features/Login';
import Header from './features/Header';
import Home from './features/Home';
import SearchLanding from './features/SearchLanding';

class App extends Component {
  render() {
    return (
      // <Provider store={store}>
      <Router>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/search" component={SearchLanding} />
            <Route path="/login" component={Login} />
          </Switch>
          <Footer />
        </MuiThemeProvider>
      </Router>
      // </Provider>
    );
  }
}

export default App;
