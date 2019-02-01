import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { parse } from 'querystring';
import React from 'react';
import { compose } from 'recompose';

import { getCocktails } from '../../services/cocktails';
import { Cocktail } from '../../services/types';

import withLoadingAndError, {
  Props as LoadingAndErrorProps
} from '../../components/WithLoadingAndError';
import NoResults from './NoResults';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {}
});

interface State {
  cocktails?: Cocktail[];
}

type CombinedProps = LoadingAndErrorProps & WithStyles<ClassNames>;

class SearchLanding extends React.PureComponent<CombinedProps, State> {
  state: State = {
    cocktails: undefined
  };
  componentDidMount() {
    /** @todo if willShop is true, exclude ice fro the GET request */

    /** 0 character is the "?" */
    const queryParams = parse(location.search.substr(1));
    this.props.setLoadingAndClearErrors();

    const willShop =
      queryParams.willShop && queryParams.willShop === 'true' ? true : false;

    getCocktails({
      ingList: queryParams.ing_list as string,
      willShop
    })
      .then(response => {
        this.setState({ cocktails: response.data });
        this.props.clearLoadingAndErrors();
      })
      .catch(e => {
        this.props.setErrorAndClearLoading('There was an error');
      });
  }

  render() {
    const { cocktails } = this.state;
    const { loading, error } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>There was an error.</div>;
    }

    if (!cocktails || cocktails.length === 0) {
      return <NoResults />;
    }
    return (
      <React.Fragment>
        <Typography variant="h5">
          Here are the cocktails you can make:
        </Typography>
        {cocktails.map(eachCocktail => {
          return <div key={eachCocktail.id}>{eachCocktail.name}</div>;
        })}
      </React.Fragment>
    );
  }
}

const styled = withStyles(styles);

export default compose<CombinedProps, {}>(
  styled,
  withLoadingAndError
)(SearchLanding);
