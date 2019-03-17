import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import React from 'react';
import { compose } from 'recompose';

import _TextField, { TextFieldProps } from '@material-ui/core/TextField';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {}
});

type CombinedProps = TextFieldProps & WithStyles<ClassNames>;

const TextField: React.SFC<CombinedProps> = props => {
  const { ...rest } = props;
  return <_TextField {...rest} />;
};

const styled = withStyles(styles);

export default compose<CombinedProps, TextFieldProps>(
  styled,
  React.memo
)(TextField);
