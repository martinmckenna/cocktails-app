import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { RouteComponentProps } from '@reach/router';
import React from 'react';
import { compose } from 'recompose';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    width: '90%',
    margin: '0 auto',
    marginTop: theme.spacing.unit * 5,
    textAlign: 'center',
    '&>h3': {
      marginBottom: theme.spacing.unit * 2,
      [theme.breakpoints.down('xs')]: {
        fontSize: '2em'
      }
    }
  }
});

type CombinedProps = WithStyles<ClassNames> & RouteComponentProps;

const _404: React.FC<CombinedProps> = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Typography variant="h3">Whatever you were looking for...</Typography>
      <Typography>This ain't it, chief</Typography>
    </div>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, RouteComponentProps>(
  styled,
  React.memo
)(_404);
