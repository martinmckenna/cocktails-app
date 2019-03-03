import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import React from 'react';
import { compose } from 'recompose';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {}
});

interface Props {}

type CombinedProps = Props & WithStyles<ClassNames>;

const Login: React.SFC<CombinedProps> = props => {
  return <div>hello world</div>;
};

const styled = withStyles(styles);

export default compose<CombinedProps, {}>(
  styled,
  React.memo
)(Login);
