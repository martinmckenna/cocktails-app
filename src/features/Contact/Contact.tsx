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
    marginTop: theme.spacing.unit * 2,
    '&>*': {
      width: '85%',
      margin: '0 auto',
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit
    }
  }
});

interface Props {}

type CombinedProps = Props & WithStyles<ClassNames> & RouteComponentProps;

const Contact: React.FC<CombinedProps> = props => {
  const { classes } = props;
  return (
    <form className={classes.root}>
      <Typography variant="h3">Contact Me</Typography>
      <TextField placeholder="Full name" />
      <TextField type="email" placeholder="Email" />
      <TextField placeholder="Message" />
      <Button>Submit</Button>
    </form>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, RouteComponentProps>(
  styled,
  React.memo
)(Contact);
