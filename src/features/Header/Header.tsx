import Grid from '@material-ui/core/Grid';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import { navigate } from '@reach/router';
import React from 'react';
import { compose } from 'recompose';
import Button from 'src/components/Button';
import withAccount, { AccountProps } from 'src/contaners/withAccount';
import { handleLogout as _handleLogout } from 'src/store/authentication/authentication.actions';

type ClassNames = 'root' | 'profile';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    padding: theme.spacing.unit * 2,
    '& button': {
      padding: theme.spacing.unit * 1.5,
      margin: `0 ${theme.spacing.unit}px 0 ${theme.spacing.unit}px`
    }
  },
  profile: {
    textAlign: 'right'
    // '&>button': {
    //   margin: `0 ${theme.spacing.unit}px 0 ${theme.spacing.unit}px`,
    //   padding: theme.spacing.unit * 2,
    // }
  }
});

type CombinedProps = WithStyles<ClassNames> & AccountProps;

const Header: React.SFC<CombinedProps> = props => {
  const {
    classes,
    account,
    accountError,
    accountLoading,
    isLoggedIn,
    handleLogout
  } = props;

  return (
    <Grid container className={classes.root}>
      <Grid item xs={3}>
        <Button onClick={goHome} variant="primary" plain>
          Home
        </Button>
      </Grid>
      <Grid item className={classes.profile} xs={9}>
        {account && account.admin && (
          <Button onClick={goToAdmin} variant="primary" plain>
            Admin
          </Button>
        )}
        {((!accountLoading && !account) || (account && !account.admin)) && (
          <Button variant="primary" onClick={goToContact} plain>
            Contact
          </Button>
        )}
        {!isLoggedIn ? (
          <Button onClick={goToLogin} variant="primary" plain>
            Login
          </Button>
        ) : (
          <Button onClick={handleLogout} variant="primary" plain>
            Logout
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

const goHome = () => {
  navigate('/');
};

const goToLogin = () => {
  navigate('/login');
};

const goToAdmin = () => {
  navigate('/admin');
};

const goToContact = () => {
  navigate('/contact');
};

const styled = withStyles(styles);

export default compose<CombinedProps, {}>(
  styled,
  withAccount,
  React.memo
)(Header);
