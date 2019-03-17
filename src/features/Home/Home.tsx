import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { RouteComponentProps } from '@reach/router';
import { stringify } from 'querystring';
import React from 'react';
import { compose, StateHandlerMap, withStateHandlers } from 'recompose';
import { debounce } from 'throttle-debounce';

import Checkbox from '../../components/Checkbox';
import Searchbar, { ResolvedData } from '../../components/Searchbar';

import { getIngredients } from '../../services/ingredients';
import { APIError, Ingredient, PaginatedData } from '../../services/types';

type ClassNames = 'root' | 'header' | 'searchbar' | 'disclaimer';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    width: '70%',
    margin: '0 auto',
    paddingTop: theme.spacing.unit * 3
  },
  header: {
    textAlign: 'center',
    color: '#000'
  },
  searchbar: {
    textAlign: 'center',
    marginTop: theme.spacing.unit * 3
  },
  disclaimer: {
    margin: '0 auto',
    marginTop: theme.spacing.unit * 2
  }
});

type CombinedProps = WithStyles<ClassNames> &
  SearchState &
  SearchStateSetters &
  SelectedOptions &
  OptionSelectHandler &
  RouteComponentProps<any>;

interface State {
  willShop: boolean;
}

class Home extends React.PureComponent<CombinedProps, State> {
  state: State = {
    willShop: false
  };
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
    console.log(values);
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
    const { selectedOptions, navigate } = this.props;

    /**
     * if we are willing to shop for more ings
     * AKA we want to see results for cocktails we can't make
     * exclude ice from the params or we'll get SO MANY results
     */
    const maybeExcludeIce = !!this.state.willShop
      ? selectedOptions.filter(eachIng => !eachIng.isFixed)
      : selectedOptions;

    const ingList = maybeExcludeIce
      ? maybeExcludeIce.map(eachIng => eachIng.value)
      : [];

    const queryParams = {
      ing_list: ingList.join(','),
      willShop: this.state.willShop
    };
    navigate!(`/search?${stringify(queryParams)}`);
  };

  toggleWillShop = () => {
    this.setState({ willShop: !this.state.willShop });
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
            loadingMessage={() => 'Fetching ingredients...'}
            noOptionsMessage={() => 'No Ingredients Found'}
            placeholder='Search ingredients (e.g "Vodka" and "Orange Juice")'
          />
        </Grid>
        <Grid className={classes.searchbar} item sm={2} xs={12}>
          <Button onClick={this.handleSubmit} color="primary">
            Search
          </Button>
        </Grid>
        <Grid item xs={8} className={classes.disclaimer}>
          <Typography>
            Thanks for using Barcart - please keep in mind this app is still a
            work-in-progress. If you'd like to get an idea about what this app
            does, try typing in 'orange juice' and 'vodka' in the search field
            above and watch the magic. Feel free to{' '}
            <a target="_blank" href="https://atmarty.com#contact">
              contact me
            </a>{' '}
            with any questions.
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.searchbar}>
          <Checkbox
            onChange={this.toggleWillShop}
            checked={this.state.willShop}
            label="Don't have all the ingredients?"
            helperText={`For example, if you only have Gin, but you'd still
            like to see suggestions for a Gin and Tonic and other drinks
            you could make with additional ingredients, check this box.`}
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

export default compose<CombinedProps, RouteComponentProps>(
  /** responsible for setting the drop down options */
  withSearchFunctions,
  /** responsible for setting the filter for GET /cocktails/ */
  withSelectOptionHandling,
  styled
)(Home);
