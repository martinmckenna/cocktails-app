import Typography from '@material-ui/core/Typography';
import { navigate, RouteComponentProps } from '@reach/router';
import React from 'react';
import { compose } from 'recompose';

import Button from 'src/components/Button';
import Select, { Option } from 'src/components/Select';
import TextField from 'src/components/TextField';

import withFormStyles, { FormStyleProps } from './CreateForms.styles';

import { createIngredient, IngTypes } from 'src/services/ingredients';
import { APIError } from 'src/services/types';

import { withSnackbar, WithSnackbarProps } from 'notistack';

interface State {
  ingName: string;
  ingType: string;
  isCreatingIngredient: boolean;
  error?: APIError;
}

const types: string[] = [
  'Liquor',
  'Liqueur',
  'Fruit',
  'Juice',
  'Garnish',
  'Mixer',
  'Bitters',
  'Wine',
  'Misc'
];

const options: Option<string, string>[] = types.map(eachType => ({
  label: eachType,
  value: eachType
}));

type CombinedProps = RouteComponentProps & FormStyleProps & WithSnackbarProps;

class CreateIngredientForm extends React.PureComponent<CombinedProps, State> {
  state: State = {
    ingName: '',
    ingType: '',
    isCreatingIngredient: false
  };

  handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ingName: e.target.value });
  };

  handleChangeType = (value: Option<IngTypes, IngTypes>) => {
    this.setState({ ingType: value.label });
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
        this.setState({
          isCreatingIngredient: false,
          ingName: '',
          ingType: ''
        });
        this.props.enqueueSnackbar(`ingredient ${response.name} created`, {
          variant: 'success'
        });
        navigate('/admin');
      })
      .catch((error: APIError) => {
        this.setState({
          isCreatingIngredient: false,
          error
        });
        this.props.enqueueSnackbar(error.error, {
          variant: 'error'
        });
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
          handleSelect={this.handleChangeType}
          defaultOption="Select Ingredient Type"
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
  withSnackbar,
  React.memo
)(CreateIngredientForm);
