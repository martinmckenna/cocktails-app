import { MuiThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import SnackbarProvider from 'src/components/SnackbarProvider';
import store from 'src/store';
import { initAnalytics } from './analytics';
import App from './App';
import './index.css';
import theme from './theme';

initAnalytics();

ReactDOM.render(
  <SnackbarProvider
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    autoHideDuration={2000}
  >
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </Provider>
  </SnackbarProvider>,
  document.getElementById('root')
);
