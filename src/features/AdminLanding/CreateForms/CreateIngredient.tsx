import Typography from '@material-ui/core/Typography';
import { RouteComponentProps } from '@reach/router';
import React from 'react';
import { compose } from 'recompose';

import Button from 'src/components/Button';
import Select, { Option } from 'src/components/Select';
import TextField from 'src/components/TextField';

import withFormStyles, { FormStyleProps } from './CreateForms.styles';

import { createIngredient, IngTypes } from 'src/services/ingredients';
import { APIError } from 'src/services/types';

interface State {
  ingName: string;
  ingType: IngTypes;
  isCreatingIngredient: boolean;
  error?: APIError;
}

const options: Option<IngTypes, IngTypes>[] = [
  {
    value: 'Liquor',
    label: 'Liquor'
  },
  {
    value: 'Fruit',
    label: 'Fruit'
  },
  {
    value: 'Juice',
    label: 'Juice'
  },
  {
    value: 'Misc',
    label: 'Misc'
  }
];

type CombinedProps = RouteComponentProps & FormStyleProps;

class CreateIngredientForm extends React.PureComponent<CombinedProps, State> {
  state: State = {
    ingName: '',
    ingType: '',
    isCreatingIngredient: false
  };

  handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ingName: e.target.value });
  };

  handleChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ ingType: e.target.value as IngTypes });
  };

  handleCreateIngredient = () => {
    const { ingName, ingType } = this.state;

    this.setState({
      isCreatingIngredient: true,
      error: undefined
    });

    return createIngredient({
      name: ingName,
      ing_type: ingType
    })
      .then(response => {
        this.setState({ isCreatingIngredient: false });
        console.log(`ingredient ${response.name} created`);
      })
      .catch((error: APIError) => {
        this.setState({
          isCreatingIngredient: false,
          error
        });
        console.log(error);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <form className={classes.root}>
        <Typography variant="h4">
          Creating Ingredient {this.state.ingName}
        </Typography>
        <TextField
          onChange={this.handleChangeName}
          placeholder="Name of Ingredient"
        />
        <Select
          options={options}
          onChange={this.handleChangeType}
          defaultText="Select Ingredient Type"
        />
        <Button
          onClick={this.handleCreateIngredient}
          isLoading={this.state.isCreatingIngredient}
        >
          Create Ingredient
        </Button>
      </form>
    );
  }
}

export default compose<CombinedProps, RouteComponentProps>(
  withFormStyles,
  React.memo
)(CreateIngredientForm);
