import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import React from 'react';
import { compose } from 'recompose';

import _Button, { ButtonBaseProps } from '@material-ui/core/ButtonBase';

type ClassNames = 'root' | 'secondary';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    color: '#000'
  },
  secondary: {
    color: '#fff'
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
      ? classes.root
      : classes.secondary
    : classes.root;

  return (
    <_Button className={className} disableRipple={true} {...rest}>
      {isLoading ? 'Loading...' : children}
    </_Button>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, Props>(
  styled,
  React.memo
)(Button);
