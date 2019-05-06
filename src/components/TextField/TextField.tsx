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

interface Props extends Omit<InputBaseProps, 'error'> {
  error?: string;
}

type CombinedProps = WithStyles<ClassNames> & Props;

const TextField: React.SFC<CombinedProps> = props => {
  const { classes, error, ...rest } = props;
  return (
    <React.Fragment>
      <_TextField
        {...rest}
        classes={{
          input: classes.input
        }}
      />
      {props.error && <p style={{ color: 'red' }}>{props.error}</p>}
    </React.Fragment>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, Props>(
  styled,
  React.memo
)(TextField);
