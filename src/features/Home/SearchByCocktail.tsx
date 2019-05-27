import Grid from '@material-ui/core/Grid';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import { RouteComponentProps } from '@reach/router';
import React from 'react';
import { compose } from 'recompose';

import Button from 'src/components/Button';
import Searchbar, { ResolvedData } from '../../components/Searchbar';

import { getCocktails } from '../../services/cocktails';

import { transformCocktailResponseToReactSelect } from 'src/utils/transformAPIResponseToReactSelect';

type ClassNames = 'searchbar' | 'searchButton';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  searchbar: {
    textAlign: 'center',
    marginTop: theme.spacing.unit * 3
  },
  searchButton: {
    margin: '0 auto',
    marginTop: theme.spacing.unit * 1,
    marginBottom: theme.spacing.unit,
    padding: theme.spacing.unit,
    width: '50%',
    textAlign: 'center'
  }
});

type CombinedProps = RouteComponentProps & WithStyles<ClassNames>;

const SearchByCocktail: React.FC<CombinedProps> = props => {
  const fetchCocktails = (value: string) => {
    return getCocktails({ name: value })
      .then(response => {
        const firstFive = {
          ...response,
          data: response.data.filter((e, index) => index < 5)
        };
        return transformCocktailResponseToReactSelect(firstFive);
      })
      .catch(e => {
        return Promise.reject(e);
      });
  };

  const handleSelectOption = (option: ResolvedData) => {
    if (option) {
      props.navigate!(`/cocktails/${option.key}`);
    }
  };

  const { classes } = props;
  return (
    <React.Fragment>
      <Grid className={classes.searchbar} item xs={12}>
        <Searchbar
          className="react-select-container"
          classNamePrefix="react-select"
          handleInputChange={fetchCocktails}
          handleSelect={handleSelectOption}
          loadingMessage={() => 'Fetching cocktails...'}
          noOptionsMessage={() => 'No Cocktails Found'}
          placeholder='Search cocktails (e.g "Aperol Spritzer" or "Mojito")'
        />
      </Grid>
      <Button className={classes.searchButton} style={{ marginTop: '1em' }}>
        Search
      </Button>
    </React.Fragment>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, RouteComponentProps>(
  styled,
  React.memo
)(SearchByCocktail);
