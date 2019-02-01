import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

type ClassNames = 'root' | 'profile';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    padding: theme.spacing.unit * 2
  },
  profile: {
    textAlign: 'right'
  }
});

type CombinedProps = WithStyles<ClassNames> & RouteComponentProps<any>;

const Header: React.SFC<CombinedProps> = props => {
  const { classes } = props;
  const goHome = () => {
    props.history.push('/');
  };
  return (
    <Grid container className={classes.root}>
      <Grid item xs={3}>
        <Button>Home</Button>
      </Grid>
      <Grid item className={classes.profile} xs={9}>
        <Button>My Profile</Button>
        {true && <Button>Admin</Button>}
      </Grid>
    </Grid>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, {}>(
  styled,
  React.memo,
  withRouter
)(Header);
