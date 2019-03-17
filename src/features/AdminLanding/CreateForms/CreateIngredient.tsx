import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import { RouteComponentProps } from '@reach/router';
import React from 'react';
import { compose } from 'recompose';

import Button from '@material-ui/core/Button';
import TextField from 'src/components/TextField';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {}
});

type CombinedProps = RouteComponentProps & WithStyles<ClassNames>;

interface State {
  ingName: string;
  ingType: '' | 'juice' | 'liquor' | 'fruit';
}

class CreateIngredientForm extends React.PureComponent<CombinedProps, State> {
  state: State = {
    ingName: '',
    ingType: ''
  };

  handleChangeName = (e: any) => {
    this.setState({ ingName: e.taret.value });
  };

  handleChangeType = (e: any) => {
    this.setState({ ingType: e.taret.value });
  };

  render() {
    return (
      <form>
        <TextField onChange={this.handleChangeName} />
        <TextField onChange={this.handleChangeType} />
        <Button>Create Ingredient</Button>
      </form>
    );
  }
}

const styled = withStyles(styles);

export default compose<CombinedProps, RouteComponentProps>(
  styled,
  React.memo
)(CreateIngredientForm);
