import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import React from 'react';
import { compose } from 'recompose';

import _TextField, { InputBaseProps } from '@material-ui/core/InputBase';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {}
});

type CombinedProps = InputBaseProps & WithStyles<ClassNames>;

const TextField: React.SFC<CombinedProps> = props => {
  const { ...rest } = props;
  return <_TextField {...rest} />;
};

const styled = withStyles(styles);

export default compose<CombinedProps, InputBaseProps>(
  styled,
  React.memo
)(TextField);
