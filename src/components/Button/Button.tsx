import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import React from 'react';
import { compose } from 'recompose';

import _Button, { ButtonBaseProps } from '@material-ui/core/ButtonBase';

type ClassNames = 'root' | 'secondary' | 'primary';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    borderRadius: 3
  },
  primary: {
    color: '#fff',
    backgroundColor: 'rgba(0,107,224,.98)',
    '-webkit-box-shadow': '0 7px 0px 0px #0051a9',
    boxShadow: '0 7px 0px 0px #0051a9',
    '-webkit-transition': 'all 0.05s ease',
    '-moz-transition': 'all 0.05s ease',
    '-ms-transition': 'all 0.05s ease',
    '-o-transition': 'all 0.05s ease',
    transition: 'all 0.05s ease',
    '&:active': {
      background: '#0051a9',
      outline: 'none',
      border: 'none',
      '-webkit-box-shadow': '0 0 0 0 #006be0fa',
      boxShadow: '0 0 0 0 #006be0fa',
      '-moz-transform': 'translateY(3px)',
      '-webkit-transform': 'translateY(3px)',
      '-o-transform': 'translateY(3px)',
      '-ms-transform': 'translateY(3px)',
      transform: 'translateY(3px)'
    },
    '&:focus': {
      outline: '2px solid #fff'
    }
  },
  secondary: {
    color: '#fff',
    backgroundColor: '#ab0457db',
    '-webkit-box-shadow': '0 7px 0px 0px #650233db',
    boxShadow: '0 7px 0px 0px #650233db',
    '-webkit-transition': 'all 0.05s ease',
    '-moz-transition': 'all 0.05s ease',
    '-ms-transition': 'all 0.05s ease',
    '-o-transition': 'all 0.05s ease',
    transition: 'all 0.05s ease',
    '&:active': {
      background: '#650233db',
      outline: 'none',
      border: 'none',
      '-webkit-box-shadow': '0 0 0 0 #006be0fa',
      boxShadow: '0 0 0 0 #006be0fa',
      '-moz-transform': 'translateY(3px)',
      '-webkit-transform': 'translateY(3px)',
      '-o-transform': 'translateY(3px)',
      '-ms-transform': 'translateY(3px)',
      transform: 'translateY(3px)'
    },
    '&:focus': {
      outline: '2px solid #fff'
    }
  }
});

interface Props extends ButtonBaseProps {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
}

type CombinedProps = Props & WithStyles<ClassNames>;

const Button: React.SFC<CombinedProps> = props => {
  const { isLoading, children, classes, ...rest } = props;

  const className = props.variant
    ? props.variant === 'primary'
      ? classes.primary
      : classes.secondary
    : classes.primary;

  return (
    <_Button
      {...rest}
      className={`${props.className} ${classes.root} ${className}`}
      disableRipple={true}
    >
      {isLoading ? 'Loading...' : children}
    </_Button>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, Props>(
  styled,
  React.memo
)(Button);
