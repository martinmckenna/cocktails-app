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
import { isProduction } from 'src/constants';

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

type CombinedProps = WithStyles<ClassNames>;

const Header: React.SFC<CombinedProps> = props => {
  const { classes } = props;
  return (
    <Grid container className={classes.root}>
      <Grid item xs={3}>
        <Button onClick={goHome} variant="primary" plain>
          Home
        </Button>
      </Grid>
      {!isProduction && (
        <Grid item className={classes.profile} xs={9}>
          {/* <Button variant="primary">
            My Profile
          </Button> */}
          <Button onClick={goToAdmin} variant="primary" plain>
            Admin
          </Button>
          <Button variant="primary" onClick={goToContact} plain>
            Contact
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

const goHome = () => {
  navigate('/');
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
  React.memo
)(Header);
