import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import React from 'react';
import { compose, StateHandlerMap, withStateHandlers } from 'recompose';
import { debounce } from 'throttle-debounce';

import Searchbar, { ResolvedData } from '../../components/Searchbar';

import { getCocktails } from '../../services/cocktails';
import { getIngredients } from '../../services/ingredients';
import { APIError } from '../../services/types';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    width: '90%',
    margin: '0 auto'
  }
});

type CombinedProps = WithStyles<ClassNames> &
  SearchState &
  SearchStateSetters &
  SelectedOptions &
  OptionSelectHandler;

class Home extends React.PureComponent<CombinedProps> {
  fetchIngredient = (value: string) => {
    const { setLoadingAndError, setIngredients } = this.props;
    return getIngredients({
      name: value
    })
      .then(response => {
        setLoadingAndError(false, undefined);
        setIngredients(
          response.ingredients.map(eachIngredient => ({
            key: eachIngredient.id,
            value: eachIngredient.id,
            label: eachIngredient.name
          }))
        );
      })
      .catch((e: Error) => {
        setLoadingAndError(false, e);
        setIngredients([]);
      });
  };

  debouncedFetch = debounce(400, false, this.fetchIngredient);

  handleSearch = (value: string) => {
    const { setLoadingAndError } = this.props;
    setLoadingAndError(true, undefined);
    this.debouncedFetch(value);
  };

  handleChange = (values: ResolvedData[], action: any) => {
    console.log(action);
    if (
      action.action === 'select-option' ||
      action.action === 'remove-value' ||
      action.action === 'pop-value'
    ) {
      console.log(values);
      this.props.handleSelectOption(
        values.map(eachValue => {
          return eachValue.value;
        })
      );
    }
  };

  handleSubmit = () => {
    getCocktails({
      ingList: this.props.selectedOptions.join(',')
    })
      .then(response => console.log(response))
      .catch(e => e);
  };

  render() {
    const { loading, data, classes } = this.props;

    console.log(this.props.selectedOptions);

    return (
      <Grid container className={classes.root}>
        <Grid item xs={10}>
          <Searchbar
            dropDownOptions={data}
            loading={loading}
            handleChange={this.handleSearch}
            handleSelect={this.handleChange}
          />
        </Grid>
        <Grid item xs={2}>
          <Button onClick={this.handleSubmit} color="primary">
            Search
          </Button>
        </Grid>
      </Grid>
    );
  }
}

const styled = withStyles(styles);

interface SearchState {
  loading: boolean;
  error?: APIError;
  data?: ResolvedData[];
}

interface SearchStateSetters {
  setLoadingAndError: (isLoading: boolean, error: any) => void;
  setIngredients: (ingredient: any) => void;
}

type StateAndSetters = StateHandlerMap<SearchState> & SearchStateSetters;

const withSearchFunctions = withStateHandlers<SearchState, StateAndSetters, {}>(
  {
    loading: false
  },
  {
    setLoadingAndError: () => (isLoading, error) => ({
      loading: isLoading,
      error
    }),
    setIngredients: () => data => ({ data })
  }
);

interface SelectedOptions {
  selectedOptions: number[];
}

interface OptionSelectHandler {
  handleSelectOption: (ingIds: number[]) => void;
  handleRemoveOption: (idId: number) => void;
}

type SelectOptionStateAndSetters = StateHandlerMap<SelectedOptions> &
  OptionSelectHandler;

const withSelectOptionHandling = withStateHandlers<
  SelectedOptions,
  SelectOptionStateAndSetters,
  SearchState & SearchStateSetters
>(
  {
    selectedOptions: []
  },
  {
    handleSelectOption: state => ingIds => ({ selectedOptions: ingIds }),
    handleRemoveOption: state => ingId => ({
      selectedOptions: state.selectedOptions.filter(
        eachOption => eachOption !== ingId
      )
    })
  }
);

export default compose<CombinedProps, {}>(
  withSearchFunctions,
  withSelectOptionHandling,
  styled
)(Home);
