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
    position: 'absolute',
    bottom: 0,
    height: '50px',
    paddingRight: theme.spacing.unit * 2,
    color: '#000',
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});

type CombinedProps = WithStyles<ClassNames>;

const Footer: React.SFC<CombinedProps> = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <div>
        <Typography>
          Copyright {new Date().getFullYear()} &hearts;&nbsp;
          <a target="_blank" href="https://atmarty.com">
            Martin McKenna
          </a>
        </Typography>
      </div>
    </div>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, {}>(
  styled,
  React.memo
)(Footer);
