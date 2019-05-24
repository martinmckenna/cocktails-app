import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { RouteComponentProps } from '@reach/router';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { APIError } from 'src/services/types';
import { MapDispatchToProps, MapStateToProps } from 'src/store';
import { handleLogin } from 'src/store/authentication/authentication.requests';

import Button from 'src/components/Button';
import TextField from 'src/components/TextField';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
    margin: '0 auto',
    '& > div': {
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2
    },
    '& > h3': {
      textAlign: 'center',
      marginTop: theme.spacing.unit * 3
    },
    [theme.breakpoints.down('sm')]: {
      width: '90%'
    }
  }
});

type CombinedProps = WithStyles<ClassNames> &
  RouteComponentProps &
  DispatchProps &
  ReduxProps &
  WithSnackbarProps;

const Login: React.SFC<CombinedProps> = props => {
  const { classes, _handleLogin, isLoggingIn, loginError } = props;

  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const handleSubmit = (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    _handleLogin(username, password)
      .then(response => {
        props.navigate!('/');
      })
      .catch((e: APIError) => {
        props.enqueueSnackbar(e.error, {
          variant: 'error'
        });
      });
  };

  return (
    <form className={classes.root}>
      <Typography variant="h3">Login</Typography>
      <TextField
        onChange={e => setUsername(e.target.value)}
        label="Username"
        placeholder="Username"
      />
      <TextField
        onChange={e => setPassword(e.target.value)}
        label="Password"
        type="password"
        placeholder="Password"
      />
      <Button
        type="submit"
        variant="primary"
        onClick={handleSubmit}
        isLoading={isLoggingIn}
      >
        Login
      </Button>
    </form>
  );
};

const styled = withStyles(styles);

interface ReduxProps {
  isLoggingIn: boolean;
  loginError?: APIError;
}

interface DispatchProps {
  _handleLogin: (username: string, password: string) => Promise<string>;
}

const mapStateToProps: MapStateToProps<ReduxProps, RouteComponentProps> = (
  state,
  ownProps
) => ({
  isLoggingIn: state.authState.isLoggingIn,
  loginError: state.authState.loginError
});

const mapDispatchToProps: MapDispatchToProps<
  DispatchProps,
  RouteComponentProps
> = dispatch => ({
  _handleLogin: (username, password) =>
    dispatch(handleLogin(username, password) as any)
});

const connected = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose<CombinedProps, RouteComponentProps>(
  connected,
  withSnackbar,
  React.memo,
  styled
)(Login);
