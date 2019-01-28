import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import { parse } from 'querystring';
import React from 'react';

import { getCocktails } from '../../services/cocktails';
import { Cocktail } from '../../services/types';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {}
});

interface Props {}

interface State {
  cocktails?: Cocktail[];
}

type CombinedProps = Props & WithStyles<ClassNames>;

class SearchLanding extends React.PureComponent<CombinedProps, State> {
  state: State = {
    cocktails: undefined
  };
  componentDidMount() {
    /** @todo if willShop is true, exclude ice fro the GET request */

    /** 0 character is the ? */
    const queryParams = parse(location.search.substr(1));

    getCocktails({
      ingList: queryParams.ing_list as string
      // willShop: true
    })
      .then(response => this.setState({ cocktails: response.data }))
      .catch(e => e);
  }

  render() {
    const { cocktails } = this.state;

    if (!cocktails) {
      return null;
    }
    return (
      <React.Fragment>
        {cocktails.map(eachCocktail => {
          return <div key={eachCocktail.id}>{eachCocktail.name}</div>;
        })}
      </React.Fragment>
    );
  }
}

const styled = withStyles(styles);

export default styled(SearchLanding);
