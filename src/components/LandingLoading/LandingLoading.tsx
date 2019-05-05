import CircularProgress from '@material-ui/core/CircularProgress';
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
    width: '100%',
    textAlign: 'center',
    '&>*': {
      marginTop: theme.spacing.unit * 3
    }
  }
});

interface Props {
  message?: string;
}

type CombinedProps = Props & WithStyles<ClassNames>;

const LandingLoading: React.FC<CombinedProps> = props => {
  const [isVisible, setVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 750);
  }, []);

  return isVisible ? (
    <div className={props.classes.root}>
      <CircularProgress style={{ width: '75px', height: '75px' }} />
      {props.message && <Typography variant="h6">{props.message}</Typography>}
    </div>
  ) : (
    <React.Fragment />
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, Props>(
  styled,
  React.memo
)(LandingLoading);
