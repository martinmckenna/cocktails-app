import CssBaseline from '@material-ui/core/CssBaseline';
import { Router } from '@reach/router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MapDispatchToProps, MapStateToProps } from 'src/store';

import { Account, APIError } from 'src/services/types';
import { getAccount as _getAccount } from 'src/store/account/account.requests';
import { initSession as _initSession } from 'src/store/authentication/authentication.actions';

import _404 from 'src/components/404';
import Admin from 'src/features/AdminLanding';
import CocktailDetail from 'src/features/CocktailDetail';
import Contact from 'src/features/Contact';
import Footer from 'src/features/Footer';
import Login from 'src/features/Login';
import Header from './features/Header';
import Home from './features/Home';
import SearchLanding from './features/SearchLanding';

class App extends Component<DispatchProps & StateProps> {
  componentDidMount() {
    this.props.initSession();
    this.props.getAccount();
  }

  componentDidUpdate(prevProps: DispatchProps & StateProps) {
    if (prevProps.token !== this.props.token) {
      this.props.getAccount();
    }
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Header />
        <Router>
          <Home path="/" />
          <SearchLanding path="search" />
          <Login path="login" />
          <Admin path="admin/*" />
          <CocktailDetail path="cocktails/:id" />
          <Contact path="contact" />
          <_404 default />
        </Router>
        <Footer />
      </React.Fragment>
    );
  }
}

interface DispatchProps {
  getAccount: () => Promise<Account | APIError>;
  initSession: () => void;
}

interface StateProps {
  token: string;
}

const mapStateToProps: MapStateToProps<StateProps, {}> = state => ({
  token: state.authState.token
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
  getAccount: () => dispatch(_getAccount() as any),
  initSession: () => dispatch(_initSession() as any)
});

const connected = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default connected(App);
