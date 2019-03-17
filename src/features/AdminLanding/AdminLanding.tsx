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

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {}
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
    <React.Fragment>
      <Button onClick={navigateToCocktailForm}>Create Cocktail</Button>
      <Button onClick={navigateToIngForm}>Create Ingredient</Button>
      <Router>
        <CreateCocktailForm path="cocktails/create" />
        <CreateIngredientForm path="ingredients/create" />
      </Router>
    </React.Fragment>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, RouteComponentProps>(
  styled,
  React.memo
)(AdminLanding);
