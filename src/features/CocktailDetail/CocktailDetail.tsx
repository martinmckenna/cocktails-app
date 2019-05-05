import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { RouteComponentProps } from '@reach/router';
import React from 'react';
import { compose } from 'recompose';

import { getCocktail } from 'src/services/cocktails';
import { APIError, Cocktail } from 'src/services/types';

import Error from 'src/components/LandingError';
import Loading from 'src/components/LandingLoading';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {}
});

type CombinedProps = WithStyles<ClassNames> &
  RouteComponentProps<{ id: number }>;

const CocktailDetail: React.FC<CombinedProps> = props => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<APIError | undefined>(undefined);
  const [cocktail, setCocktail] = React.useState<Cocktail | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (!props.id) {
      return;
    }
    getCocktail(+props.id)
      .then(response => {
        console.log(response);
        setCocktail(response);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading message="Fetching this cocktail" />;
  }

  if (error) {
    return <Error message="Dangit. Something went wrong" />;
  }

  if (!cocktail) {
    return <Error message={`${`Dangit. We couldn't find this cocktail`}`} />;
  }

  return (
    <React.Fragment>
      <Typography variant="h3">{cocktail.name}</Typography>
      <Typography>Served in a {cocktail.glass} glass</Typography>
    </React.Fragment>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, RouteComponentProps>(
  styled,
  React.memo
)(CocktailDetail);
