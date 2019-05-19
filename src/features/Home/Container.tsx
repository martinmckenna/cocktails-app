import Grid from '@material-ui/core/Grid';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Link, RouteComponentProps } from '@reach/router';
import { parse } from 'querystring';
import { pathOr } from 'ramda';
import React from 'react';
import { compose } from 'recompose';

import SearchByCocktail from './SearchByCocktail';
import SearchByIngredient from './SearchByIngredient';

type ClassNames = 'root' | 'header';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    width: '85%',
    margin: '0 auto',
    paddingTop: theme.spacing.unit * 3,
    '& > div > p': {
      textAlign: 'center',
      marginTop: theme.spacing.unit
    }
  },
  header: {
    textAlign: 'center',
    color: '#000'
  }
});

type CombinedProps = RouteComponentProps & WithStyles<ClassNames>;

const Container: React.FC<CombinedProps> = props => {
  const { classes, ...rest } = props;

  const queryParams = parse(props.location!.search.replace('?', ''));
  const type: 'byIng' | 'byCocktail' = pathOr<'byIng' | 'byCocktail'>(
    'byIng',
    ['type'],
    queryParams
  );

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h2" className={classes.header}>
          Barcart
        </Typography>
        <Typography>
          Search by {type === 'byCocktail' ? 'cocktail' : 'ingredients'}
          <Link
            to={type === 'byCocktail' ? '/?type=byIng' : '/?type=byCocktail'}
          >
            {' '}
            or by {type === 'byCocktail' ? 'ingredients.' : 'cocktail name.'}
          </Link>
        </Typography>
      </Grid>
      {type === 'byCocktail' ? (
        <SearchByCocktail {...rest} />
      ) : (
        <SearchByIngredient {...rest} />
      )}
    </Grid>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, RouteComponentProps>(
  styled,
  React.memo
)(Container);
