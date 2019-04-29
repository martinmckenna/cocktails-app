import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import { RouteComponentProps } from '@reach/router';
import { parse } from 'querystring';
import React from 'react';
import { compose } from 'recompose';

import { getCocktails } from '../../services/cocktails';
import { Cocktail } from '../../services/types';

import Error from 'src/components/LandingError';
import Loading from 'src/components/LandingLoading';
import Card from 'src/components/SearchResultCard';
import NoResults from './NoResults';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flexFlow: 'row wrap',
    justifyContent: 'space-between',
    margin: theme.spacing.unit * 2
  }
});

type CombinedProps = WithStyles<ClassNames> & RouteComponentProps;

const SearchLanding: React.FC<CombinedProps> = props => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [cocktails, setCocktails] = React.useState<Cocktail[]>([]);

  React.useEffect(() => {
    /** 0 character is the "?" */
    const queryParams = parse(location.search.substr(1));
    setLoading(true);
    setError('');

    const willShop =
      queryParams.willShop && queryParams.willShop === 'true' ? true : false;

    getCocktails({
      ingList: queryParams.ing_list as string,
      willShop
    })
      .then(response => {
        setLoading(false);
        setCocktails(response.data);
      })
      .catch(e => {
        setLoading(false);
        setError('There was an error');
      });
  }, []);

  if (loading) {
    return <Loading message="Loading your cocktails..." />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (!cocktails || cocktails.length === 0) {
    return <NoResults />;
  }

  return (
    <div className={props.classes.root}>
      {cocktails.map(eachCocktail => {
        return (
          <Card
            href={`/cocktails/${eachCocktail.id}`}
            key={eachCocktail.id}
            name={eachCocktail.name}
          />
        );
      })}
    </div>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, RouteComponentProps>(styled)(
  SearchLanding
);
