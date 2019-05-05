import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Router } from '@reach/router';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import theme from './theme';

import store from 'src/store';

import Admin from 'src/features/AdminLanding';
import CocktailDetail from 'src/features/CocktailDetail';
import Footer from 'src/features/Footer';
import Login from 'src/features/Login';
import Header from './features/Header';
import Home from './features/Home';
import SearchLanding from './features/SearchLanding';

import SnackbarProvider from 'src/components/SnackbarProvider';

class App extends Component {
  render() {
    return (
      <SnackbarProvider
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={2000}
      >
        <Provider store={store}>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            <Router>
              <Home path="/" />
              <SearchLanding path="search" />
              <Login path="login" />
              <Admin path="admin/*" />
              <CocktailDetail path="cocktails/*" />
            </Router>
            <Footer />
          </MuiThemeProvider>
        </Provider>
      </SnackbarProvider>
    );
  }
}

export default App;
