import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import React from 'react';
import { compose } from 'recompose';

import _Button, { ButtonProps } from '@material-ui/core/Button';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {}
});

interface Props extends ButtonProps {
  isLoading?: boolean;
}

type CombinedProps = Props & WithStyles<ClassNames>;

const Button: React.SFC<CombinedProps> = props => {
  const { isLoading, children, ...rest } = props;
  return <_Button {...rest}>{isLoading ? 'Loading...' : children}</_Button>;
};

const styled = withStyles(styles);

export default compose<CombinedProps, Props>(
  styled,
  React.memo
)(Button);
