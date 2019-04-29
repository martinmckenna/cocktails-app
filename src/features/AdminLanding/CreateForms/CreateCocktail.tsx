import Typography from '@material-ui/core/Typography';
import { RouteComponentProps } from '@reach/router';
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

import { transformAPIResponseToReactSelect } from 'src/utils/transformAPIResponseToReactSelect';

const glasses: Option<GlassType, GlassType>[] = [
  {
    label: 'Rocks',
    value: 'Rocks'
  },
  {
    label: 'Highball',
    value: 'Highball'
  },
  {
    label: 'Snifter',
    value: 'Snifter'
  }
];

const actions: Option<ActionType, ActionType>[] = [
  {
    label: 'Add',
    value: 'Add'
  },
  {
    label: 'Muddle',
    value: 'Muddle'
  },
  {
    label: 'Squeeze',
    value: 'Squeeze'
  }
];

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

type CombinedProps = FormStyleProps & RouteComponentProps;

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
    { action, removedValue }: any,
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
        console.log(response);
        setLoading(false);
      })
      .catch((e: APIError) => {
        console.log(e);
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
        options={glasses}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setGlass(e.target.value as GlassType)
        }
        defaultText="Select Glass"
      />
      <Select
        options={finishes as any}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setFinish(e.target.value as Finishes)
        }
        defaultText="Select Finish (optional)"
      />
      {Array.apply(null, Array(ingredientsCount)).map(
        (eachIteration, index) => {
          return (
            <div className={classes.section} key={index}>
              <Typography variant="h6">Ingredient {index + 1}</Typography>
              <Searchbar
                className="react-select-container"
                classNamePrefix="react-select"
                handleSubmit={() => null}
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
                placeholder="Enter Number of Ounces"
              />
              <Select
                options={actions}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setActions(
                    assocPath([index], e.target.value, selectedActions)
                  )
                }
                defaultText="Select Action"
              />
              {index > 0 && (
                <Button
                  onClick={() => setIngredientsCount(ingredientsCount - 1)}
                >
                  Remove Ingredient
                </Button>
              )}
            </div>
          );
        }
      )}
      <div className={classes.section}>
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
  React.memo
)(CreateCocktail);
