import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { equals } from 'ramda';
import React from 'react';
import { compose } from 'recompose';

import _TextField, { InputBaseProps } from '@material-ui/core/InputBase';

type ClassNames = 'root' | 'input';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    '& > div': {
      width: '100%'
    }
  },
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
  inputClass?: string;
  label?: string;
}

type CombinedProps = WithStyles<ClassNames> & Props;

const TextField: React.SFC<CombinedProps> = props => {
  const { label, className, classes, inputClass, error, ...rest } = props;
  return (
    <div className={`${classes.root} ${className}`}>
      {label && <Typography>{label}</Typography>}
      <_TextField
        {...rest}
        classes={{
          input: `${classes.input} ${inputClass}`
        }}
      />
      {props.error && <p style={{ color: 'red' }}>{props.error}</p>}
    </div>
  );
};

const styled = withStyles(styles);

const memoized = (component: React.FC<CombinedProps>) =>
  React.memo(component, (prevProps, nextProps) => {
    return equals(prevProps.error, nextProps.error);
  });

export default compose<CombinedProps, Props>(
  memoized,
  styled
)(TextField);
