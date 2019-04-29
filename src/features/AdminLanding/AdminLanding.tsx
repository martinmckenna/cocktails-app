import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import { RouteComponentProps, Router } from '@reach/router';
import React from 'react';
import { compose } from 'recompose';

import Button from '@material-ui/core/Button';
import CreateCocktailForm from './CreateForms/CreateCocktail';
import CreateIngredientForm from './CreateForms/CreateIngredient';

type ClassNames = 'root' | 'tabs';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    margin: `${theme.spacing.unit * 2}px 0px 0px ${theme.spacing.unit * 2}px`
  },
  tabs: {
    marginBottom: theme.spacing.unit * 2
  }
});

type CombinedProps = WithStyles<ClassNames> & RouteComponentProps;

const AdminLanding: React.SFC<CombinedProps> = props => {
  const navigateToIngForm = () => {
    props.navigate!('ingredients/create');
  };

  const navigateToCocktailForm = () => {
    props.navigate!('cocktails/create');
  };

  return (
    <div className={props.classes.root}>
      <div className={props.classes.tabs}>
        <Button onClick={navigateToCocktailForm}>Create Cocktail</Button>
        <Button onClick={navigateToIngForm}>Create Ingredient</Button>
      </div>
      <Router>
        <CreateCocktailForm path="cocktails/create" />
        <CreateIngredientForm path="ingredients/create" />
      </Router>
    </div>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, RouteComponentProps>(
  styled,
  React.memo
)(AdminLanding);
