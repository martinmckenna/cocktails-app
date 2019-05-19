import Typography from '@material-ui/core/Typography';
import { navigate, RouteComponentProps } from '@reach/router';
import { assocPath } from 'ramda';
import React from 'react';
import { compose } from 'recompose';
import { debounce } from 'throttle-debounce';

import Button from 'src/components/Button';
import Searchbar, { ResolvedData } from 'src/components/Searchbar';
import Select, { Option } from 'src/components/Select';
import TextField from 'src/components/TextField';

import withFormStyles, { FormStyleProps } from './CreateForms.styles';

import {
  ActionType,
  createCocktail,
  Finishes,
  GlassType,
  Ingredient as POSTIngredient
} from 'src/services/cocktails';
import { getIngredients } from 'src/services/ingredients';
import { APIError } from 'src/services/types';

import { withSnackbar, WithSnackbarProps } from 'notistack';

import { transformAPIResponseToReactSelect } from 'src/utils/transformAPIResponseToReactSelect';

const glasses: string[] = [
  'Rocks',
  'Highball',
  'Snifter',
  'Champagne Flute',
  'Margarita Glass',
  'Martini Glasss'
];

const actions: string[] = ['Add', 'Muddle', 'Squeeze', 'Garnish', 'Rim'];

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
  const [isSearchingIngredient, setIsSearchingIngredient] = React.useState<
    boolean
  >(false);
  const [dropDownOptions, setDropDownOptions] = React.useState<ResolvedData[]>(
    []
  );
  const [ingredientsCount, setIngredientsCount] = React.useState<number>(1);
  const [ingredientIds, setIngredientIds] = React.useState<
    Record<string, number>
  >({});
  const [ounces, setOunces] = React.useState<Record<string, number>>({});
  const [selectedActions, setActions] = React.useState<
    Record<string, ActionType>
  >({});
  const [error, setError] = React.useState<APIError | undefined>(undefined);

  const fetchIngredient = (value: string) => {
    return getIngredients({
      name: value
    })
      .then(response => {
        const firstFive = {
          ...response,
          data: response.data.filter((eachIng, index) => index <= 5)
        };
        setIsSearchingIngredient(false);
        setDropDownOptions(transformAPIResponseToReactSelect(firstFive));
      })
      .catch((e: Error) => {
        setIsSearchingIngredient(false);
        setDropDownOptions([]);
      });
  };

  const debouncedFetch = debounce(400, false, fetchIngredient);

  const handleSearch = (value: string) => {
    setIsSearchingIngredient(true);
    debouncedFetch(value);
  };

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
    <form className={classes.root}>
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
            <div className={classes.section} key={index}>
              <Typography variant="h6">Ingredient {index + 1}</Typography>
              <Searchbar
                className="react-select-container"
                classNamePrefix="react-select"
                // handleSubmit={() => null}
                dropDownOptions={dropDownOptions}
                loading={isSearchingIngredient}
                handleChange={handleSearch}
                handleSelect={(value, action) =>
                  handleChange(value, action, index)
                }
                loadingMessage={() => 'Fetching ingredients...'}
                noOptionsMessage={() => 'No Ingredients Found'}
                placeholder="Search for an ingredient"
              />
              <TextField
                type="number"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setOunces(assocPath([index], e.target.value, ounces))
                }
                placeholder="Enter Number of Parts"
              />
              <Select
                options={createOptions(actions)}
                handleSelect={(value: Option<ActionType, ActionType>) => {
                  setActions(assocPath([index], value.label, selectedActions));
                }}
                defaultOption="Select Action"
              />
              {index > 0 && (
                <Button
                  onClick={() => setIngredientsCount(ingredientsCount - 1)}
                  variant="secondary"
                >
                  Remove Ingredient
                </Button>
              )}
            </div>
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
  withFormStyles,
  withSnackbar,
  React.memo
)(CreateCocktail);
