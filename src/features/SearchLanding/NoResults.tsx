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
    marginTop: theme.spacing.unit * 3
  }
});

type CombinedProps = WithStyles<ClassNames>;

const NoResults: React.SFC<CombinedProps> = props => {
  const [isVisible, setVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(true);
    }, 250);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const { classes } = props;
  return isVisible ? (
    <div className={classes.root}>
      <Typography variant="h5">No results found.</Typography>
    </div>
  ) : (
    <React.Fragment />
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, {}>(
  styled,
  React.memo
)(NoResults);
