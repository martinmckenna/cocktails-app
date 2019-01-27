import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    padding: theme.spacing.unit * 2
  }
});

type CombinedProps = WithStyles<ClassNames> & RouteComponentProps<any>;

const Header: React.SFC<CombinedProps> = props => {
  const { classes } = props;
  const goHome = () => {
    props.history.push('/');
  };
  return (
    <div onClick={goHome} className={classes.root}>
      App name here
    </div>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, {}>(
  styled,
  React.memo,
  withRouter
)(Header);
