import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Link, RouteComponentProps, Router } from '@reach/router';
import React from 'react';
import { compose } from 'recompose';

import Button from 'src/components/Button';
import CreateCocktailForm from './CreateForms/CreateCocktail';
import CreateIngredientForm from './CreateForms/CreateIngredient';

import withAccount, { AccountProps } from 'src/contaners/withAccount';

type ClassNames = 'root' | 'tabs' | 'warning';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    margin: theme.spacing.unit
  },
  warning: {
    margin: '0 auto',
    width: '90%',
    marginTop: theme.spacing.unit * 6,
    textAlign: 'center'
  },
  tabs: {
    marginBottom: theme.spacing.unit * 2,
    '&>button': {
      margin: theme.spacing.unit * 2,
      padding: theme.spacing.unit * 2
    }
  }
});

type CombinedProps = WithStyles<ClassNames> &
  RouteComponentProps &
  AccountProps;

const AdminLanding: React.SFC<CombinedProps> = props => {
  const navigateToIngForm = () => {
    props.navigate!('ingredients/create');
  };

  const navigateToCocktailForm = () => {
    props.navigate!('cocktails/create');
  };

  if ((!props.accountLoading && !props.account) || !props.isLoggedIn) {
    return (
      <Typography variant="h4" className={props.classes.warning}>
        Hey! You shouldn't be here. Try <Link to="/login">logging in</Link>{' '}
        first.
      </Typography>
    );
  }

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
  withAccount,
  React.memo
)(AdminLanding);
