import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { RouteComponentProps } from '@reach/router';
import React from 'react';
import { compose } from 'recompose';

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

type CombinedProps = WithStyles<ClassNames> & RouteComponentProps;

const Login: React.SFC<CombinedProps> = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Typography variant="h3">Login</Typography>
      <TextField label="Username" placeholder="Email" />
      <TextField label="Password" type="password" placeholder="Password" />
      <Button variant="primary">Login</Button>
    </div>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, RouteComponentProps>(
  styled,
  React.memo
)(Login);
