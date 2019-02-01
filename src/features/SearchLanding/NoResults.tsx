import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { compose } from 'recompose';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    textAlign: 'center',
    marginTop: theme.spacing.unit * 4
  }
});

interface Props {}

type CombinedProps = Props & WithStyles<ClassNames>;

const NoResults: React.SFC<CombinedProps> = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Typography variant="h5">No results found.</Typography>
    </div>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, {}>(
  styled,
  React.memo
)(NoResults);
