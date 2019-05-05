import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ThumbDown from '@material-ui/icons/ThumbDown';
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
  message: string;
}

type CombinedProps = Props & WithStyles<ClassNames>;

const LandingError: React.SFC<CombinedProps> = props => {
  return (
    <div className={props.classes.root}>
      <ThumbDown style={{ width: '75px', height: '75px' }} />
      <Typography variant="h6">{props.message}</Typography>
    </div>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, Props>(
  styled,
  React.memo
)(LandingError);
