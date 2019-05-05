import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import React from 'react';
import { compose } from 'recompose';

import _TextField, { InputBaseProps } from '@material-ui/core/InputBase';

type ClassNames = 'root' | 'input';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {},
  input: {
    [theme.breakpoints.down('xs')]: {
      '&::placeholder': {
        fontSize: '.75em'
      }
    }
  }
});

type CombinedProps = InputBaseProps & WithStyles<ClassNames>;

const TextField: React.SFC<CombinedProps> = props => {
  const { classes, ...rest } = props;
  return (
    <_TextField
      {...rest}
      classes={{
        input: classes.input
      }}
    />
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, InputBaseProps>(
  styled,
  React.memo
)(TextField);
