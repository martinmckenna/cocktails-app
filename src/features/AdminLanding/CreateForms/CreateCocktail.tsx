import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import { RouteComponentProps } from '@reach/router';
import React from 'react';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {}
});

interface Props {}

interface State {}

type CombinedProps = Props & WithStyles<ClassNames> & RouteComponentProps;

class CreateCocktail extends React.PureComponent<CombinedProps, State> {
  state: State = {};

  render() {
    return <div>hello world</div>;
  }
}

const styled = withStyles(styles);

export default styled(CreateCocktail);
