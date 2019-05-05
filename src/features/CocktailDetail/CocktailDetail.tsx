import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import { RouteComponentProps } from '@reach/router';
import React from 'react';
import { compose } from 'recompose';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {}
});

type CombinedProps = WithStyles<ClassNames> & RouteComponentProps;

const CocktailDetail: React.FC<CombinedProps> = props => {
  return <div>Feature coming soon...</div>;
};

const styled = withStyles(styles);

export default compose<CombinedProps, RouteComponentProps>(
  styled,
  React.memo
)(CocktailDetail);
