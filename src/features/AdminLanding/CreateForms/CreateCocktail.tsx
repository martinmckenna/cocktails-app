import Typography from '@material-ui/core/Typography';
import { navigate, RouteComponentProps } from '@reach/router';
import { assocPath } from 'ramda';
import React from 'react';
import { compose } from 'recompose';

import Button from 'src/components/Button';
import { ResolvedData } from 'src/components/Searchbar';
import Select, { Option } from 'src/components/Select';
import TextField from 'src/components/TextField';

import Form from './CreateCocktailForm';
import withFormStyles, { FormStyleProps } from './CreateForms.styles';

import {
  ActionType,
  createCocktail,
  Finishes,
  GlassType,
  Ingredient as POSTIngredient
} from 'src/services/cocktails';
import { APIError } from 'src/services/types';

import { withSnackbar, WithSnackbarProps } from 'notistack';

const glasses: string[] = [
  'Rocks',
  'Highball',
  'Snifter',
  'Champagne Flute',
  'Margarita Glass',
  'Martini Glasss'
];

const createOptions = (list: string[]): Option<string, string>[] =>
  list.map(eachOption => ({
    label: eachOption,
    value: eachOption
  }));

const finishes: Option<Finishes, Finishes>[] = [
  {
    label: 'Shaken',
    value: 'shaken'
  },
  {
    label: 'Stirred',
    value: 'stirred'
  }
];

type CombinedProps = FormStyleProps & RouteComponentProps & WithSnackbarProps;

const CreateCocktail: React.FC<CombinedProps> = props => {
  const [label, setLabel] = React.useState<string>('');
  const [glass, setGlass] = React.useState<GlassType>('');
  const [finish, setFinish] = React.useState<Finishes>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [ingredientsCount, setIngredientsCount] = React.useState<number>(1);
  const [ingredientIds, setIngredientIds] = React.useState<
    Record<string, number>
  >({});
  const [ounces, setOunces] = React.useState<Record<string, number>>({});
  const [selectedActions, setActions] = React.useState<
    Record<string, ActionType>
  >({});
  const [error, setError] = React.useState<APIError | undefined>(undefined);

  /*
   * handler for selecting or removing an option
   */
  const handleChange = (
    values: ResolvedData,
    { action }: any,
    index: number
  ) => {
    switch (action) {
      case 'remove-value':
      case 'pop-value':
      case 'select-option':
        setIngredientIds(assocPath([index], values.key, ingredientIds));
      default:
        return;
    }
  };

  const handleCreateCocktail = () => {
    setLoading(true);
    setError(undefined);

    const ingPayload: POSTIngredient[] = Object.keys(ingredientIds).map(
      eachIngredientId => {
        return {
          id: ingredientIds[eachIngredientId],
          step: +eachIngredientId + 1,
          ounces: +ounces[eachIngredientId] || 0,
          action: selectedActions[eachIngredientId]
        };
      }
    );

    createCocktail({
      name: label,
      glass,
      finish,
      ingredients: ingPayload
    })
      .then(response => {
        props.enqueueSnackbar(`Cocktail ${response[0].name} created`, {
          variant: 'success'
        });
        setLoading(false);
        navigate('/admin');
      })
      .catch((e: APIError) => {
        props.enqueueSnackbar(`Error ${e.error}`, {
          variant: 'error'
        });
        setLoading(false);
        setError(e);
      });
  };

  const { classes } = props;

  return (
    <form className={classes.root} key={1}>
      <Typography variant="h4">Creating Cocktail {label}</Typography>
      <TextField
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setLabel(e.target.value)
        }
        placeholder="Enter Cocktail Name"
      />
      <Select
        options={createOptions(glasses)}
        handleSelect={(value: Option<GlassType, GlassType>) =>
          setGlass(value.label)
        }
        defaultOption="Select Glass"
      />
      <Select
        options={finishes as any}
        handleSelect={(value: Option<Finishes, Finishes>) =>
          setFinish(value.label ? value.label.toLowerCase() : '')
        }
        defaultOption="Select Finish (optional)"
      />
      {Array.apply(null, Array(ingredientsCount)).map(
        (eachIteration, index) => {
          return (
            <Form
              key={index}
              index={index}
              ingredientsCount={ingredientsCount}
              setIngredientsCount={setIngredientsCount}
              ounces={ounces}
              setOunces={setOunces}
              selectedActions={selectedActions}
              setActions={setActions}
              handleChange={handleChange}
              className={classes.section}
              loadingMessage={() => 'Fetching ingredients...'}
              noOptionsMessage={() => 'No Ingredients Found'}
            />
          );
        }
      )}
      <div className={classes.buttonWrapper}>
        <Button onClick={() => setIngredientsCount(ingredientsCount + 1)}>
          Add Ingredient
        </Button>
        <Button onClick={handleCreateCocktail} isLoading={!!loading}>
          Create Cocktail
        </Button>
      </div>
    </form>
  );
};

export default compose<CombinedProps, RouteComponentProps>(
  React.memo,
  withSnackbar,
  withFormStyles
)(CreateCocktail);
