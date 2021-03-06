import Grid from '@material-ui/core/Grid';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import { RouteComponentProps } from '@reach/router';
import { stringify } from 'querystring';
import React from 'react';
import { compose, StateHandlerMap, withStateHandlers } from 'recompose';

import Button from 'src/components/Button';
import Checkbox from '../../components/Checkbox';
import Searchbar, { ResolvedData } from '../../components/Searchbar';

import { getIngredients } from '../../services/ingredients';
import { APIError } from '../../services/types';

import { transformAPIResponseToReactSelect } from 'src/utils/transformAPIResponseToReactSelect';

type ClassNames = 'searchbar' | 'checkbox' | 'searchButton' | 'blurb';

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
  },
  checkbox: {
    textAlign: 'center',
    marginTop: theme.spacing.unit * 3
    // marginBottom: theme.spacing.unit * 5,
  },
  blurb: {
    marginTop: theme.spacing.unit * 2
    // textAlign: 'center'
  }
});

type CombinedProps = WithStyles<ClassNames> &
  SelectedOptions &
  OptionSelectHandler &
  RouteComponentProps<any>;

interface State {
  willShop: boolean;
  error?: string;
}

class Home extends React.PureComponent<CombinedProps, State> {
  state: State = {
    willShop: true
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
    return getIngredients({
      name: value
    })
      .then(response => {
        const firstFive = {
          ...response,
          data: response.data.filter((eachIng, index) => index < 5)
        };
        return transformAPIResponseToReactSelect(firstFive);
      })
      .catch((e: APIError) => {
        return Promise.reject(e);
      });
  };

  /**
   * handler for selecting or removing an option
   */
  handleChange = (values: ResolvedData[], { action }: any) => {
    switch (action) {
      case 'remove-value':
      case 'pop-value':
      case 'select-option':
        this.setState({ error: undefined });
        return this.props.handleSelectOption(values);
      default:
        return;
    }
  };

  handleSubmit = () => {
    const { selectedOptions, navigate } = this.props;

    if (
      !selectedOptions ||
      selectedOptions.filter(each => !each.isFixed).length === 0
    ) {
      return this.setState({
        error: 'Please choose some ingredients.'
      });
    }

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
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Grid className={classes.searchbar} item xs={12}>
          <Searchbar
            filterIce
            isMulti
            error={this.state.error}
            className="react-select-container"
            classNamePrefix="react-select"
            handleSubmit={this.handleSubmit}
            handleInputChange={this.fetchIngredient}
            handleSelect={this.handleChange}
            loadingMessage={() => 'Fetching ingredients...'}
            noOptionsMessage={() => 'No Ingredients Found'}
            placeholder='What Ingredients do you have? (e.g "Vodka" or "Orange Juice")'
          />
        </Grid>
        <Grid item xs={12} className={classes.checkbox}>
          <Checkbox
            onChange={this.toggleWillShop}
            checked={!this.state.willShop}
            label="Only show me cocktails for which I have 100% of the ingredients."
            // helperText={`For example, if you only have Gin, but you'd still
            // like to see suggestions for a Gin and Tonic and other drinks
            // you could make with additional ingredients, check this box.`}
          />
        </Grid>
        <Button
          className={classes.searchButton}
          onClick={this.handleSubmit}
          style={{ marginTop: '1em' }}
        >
          Search
        </Button>
      </React.Fragment>
    );
  }
}

const styled = withStyles(styles);

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
  RouteComponentProps
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

export default compose<CombinedProps, RouteComponentProps>(
  /** responsible for setting the filter for GET /cocktails/ */
  withSelectOptionHandling,
  styled
)(Home);
