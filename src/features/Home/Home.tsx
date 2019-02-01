import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { stringify } from 'querystring';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose, StateHandlerMap, withStateHandlers } from 'recompose';
import { debounce } from 'throttle-debounce';

import Checkbox from '../../components/Checkbox';
import Searchbar, { ResolvedData } from '../../components/Searchbar';

import { getIngredients } from '../../services/ingredients';
import { APIError, Ingredient, PaginatedData } from '../../services/types';

type ClassNames = 'root' | 'header' | 'searchbar';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    width: '70%',
    margin: '0 auto',
    marginTop: theme.spacing.unit * 3
  },
  header: {
    textAlign: 'center',
    color: '#000'
  },
  searchbar: {
    textAlign: 'center',
    marginTop: theme.spacing.unit * 3
  }
});

type CombinedProps = WithStyles<ClassNames> &
  SearchState &
  SearchStateSetters &
  SelectedOptions &
  OptionSelectHandler &
  RouteComponentProps<any>;

class Home extends React.PureComponent<CombinedProps> {
  componentDidMount() {
    /** pre-poplate the GET /cocktails filter with ice */
    getIngredients({ name: 'ice' })
      .then(response => {
        /**
         * ensure we're only getting the first "ice" result
         * the issue here is that "orange juice" also gets
         * returned in the response since it contains "ice"
         */
        const filteredResponse = {
          ...response,
          ingredients: response.data.filter(
            eachIng => eachIng.name.toLowerCase() === 'ice'
          )
        };
        this.props.handleSelectOption([
          {
            /** ingredients[0] is ice */
            key: filteredResponse.ingredients[0].id,
            label: filteredResponse.ingredients[0].name,
            value: filteredResponse.ingredients[0].id,
            isFixed: true
          }
        ]);
      })
      .catch(e => e);
  }

  fetchIngredient = (value: string) => {
    const { setLoadingAndError, setIngredients } = this.props;
    return getIngredients({
      name: value
    })
      .then(response => {
        const firstFive = {
          ...response,
          data: response.data.filter((eachIng, index) => index <= 5)
        };
        setLoadingAndError(false, undefined);
        setIngredients(transformAPIResponseToReactSelect(firstFive));
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

  /**
   * handler for selecting or removing an option
   */
  handleChange = (values: ResolvedData[], { action, removedValue }: any) => {
    switch (action) {
      case 'remove-value':
      case 'pop-value':
      case 'select-option':
        return this.props.handleSelectOption(values);
      default:
        return;
    }
  };

  handleSubmit = () => {
    const { selectedOptions, history } = this.props;

    const ingList = selectedOptions
      ? selectedOptions.map(eachIng => eachIng.value)
      : [];

    const queryParams = {
      ing_list: ingList.join(',')
    };
    history.push(`/search?${stringify(queryParams)}`);
  };

  render() {
    const { loading, dropDownData, classes } = this.props;

    return (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Typography variant="h2" className={classes.header}>
            Barcart
          </Typography>
        </Grid>
        <Grid className={classes.searchbar} item sm={10} xs={12}>
          <Searchbar
            handleSubmit={this.handleSubmit}
            dropDownOptions={dropDownData}
            loading={loading}
            handleChange={this.handleSearch}
            handleSelect={this.handleChange}
          />
        </Grid>
        <Grid className={classes.searchbar} item sm={2} xs={12}>
          <Button onClick={this.handleSubmit} color="primary">
            Search
          </Button>
        </Grid>
        <Grid item xs={12} className={classes.searchbar}>
          <Checkbox
            label="Willing to shop for more items?"
            value="fdsaf"
            helperText={`Check this if you want to see results for cocktails
            that you don't have all the ingredients to. For example, if you have Gin,
            you will see 'Gin and Tonic' in the results`}
          />
        </Grid>
      </Grid>
    );
  }
}

const styled = withStyles(styles);

interface SearchState {
  loading: boolean;
  error?: APIError;
  dropDownData?: ResolvedData[];
}

interface SearchStateSetters {
  setLoadingAndError: (isLoading: boolean, error: any) => void;
  setIngredients: (payload: ResolvedData[]) => void;
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
    setIngredients: () => dropDownData => ({ dropDownData })
  }
);

interface SelectedOptions {
  selectedOptions: ResolvedData[];
}

interface OptionSelectHandler {
  handleSelectOption: (data: ResolvedData[]) => void;
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
    handleSelectOption: state => selectedOptions => ({
      selectedOptions: [
        /** we want to keep the selectedOptions that have an isFixed flag no matter what */
        ...state.selectedOptions.filter(eachOption => !!eachOption.isFixed),
        ...selectedOptions
      ]
    })
  }
);

export const transformAPIResponseToReactSelect = (
  response: PaginatedData<Ingredient>
) => {
  return response.data.map(eachIngredient => ({
    key: eachIngredient.id,
    value: eachIngredient.id,
    label: eachIngredient.name
  }));
};

export default compose<CombinedProps, {}>(
  /** responsible for setting the drop down options */
  withSearchFunctions,
  /** responsible for setting the filter for GET /cocktails/ */
  withSelectOptionHandling,
  styled,
  withRouter
)(Home);
