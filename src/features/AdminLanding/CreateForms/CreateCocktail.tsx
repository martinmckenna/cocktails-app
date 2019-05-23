import Typography from '@material-ui/core/Typography';
import { navigate, RouteComponentProps } from '@reach/router';
import { assocPath, equals } from 'ramda';
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
    Record<number, boolean>
  >({});
  const [dropDownOptions, setDropDownOptions] = React.useState<
    Record<number, ResolvedData[]>
  >([]);
  const [ingredientsCount, setIngredientsCount] = React.useState<number>(1);
  const [ingredientIds, setIngredientIds] = React.useState<
    Record<string, number>
  >({});
  const [ounces, setOunces] = React.useState<Record<string, number>>({});
  const [selectedActions, setActions] = React.useState<
    Record<string, ActionType>
  >({});
  const [error, setError] = React.useState<APIError | undefined>(undefined);

  const fetchIngredient = (value: string, index: number) => {
    return getIngredients({
      name: value
    })
      .then(response => {
        const firstFive = {
          ...response,
          data: response.data.filter((eachIng, filterInd) => filterInd < 5)
        };

        setIsSearchingIngredient(
          assocPath([index], false, isSearchingIngredient)
        );
        setDropDownOptions(
          assocPath(
            [index],
            transformAPIResponseToReactSelect(firstFive),
            dropDownOptions
          )
        );
      })
      .catch((e: Error) => {
        setIsSearchingIngredient(
          assocPath([index], false, isSearchingIngredient)
        );
        setDropDownOptions([]);
      });
  };

  const debouncedFetch = debounce(400, false, fetchIngredient);

  const handleSearch = (value: string, index: number) => {
    setIsSearchingIngredient(assocPath([index], true, isSearchingIngredient));
    debouncedFetch(value, index);
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
    // setLoading(true);
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

    return console.log(ingPayload);

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
              handleSearch={handleSearch}
              dropDownOptions={dropDownOptions[index]}
              isFetchingIngredient={isSearchingIngredient[index]}
              className={classes.section}
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

interface FormProps {
  setIngredientsCount: (count: number) => void;
  handleSearch: (value: string, index: number) => void;
  index: number;
  ounces: Record<string, number>;
  setOunces: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  selectedActions: Record<string, ActionType>;
  setActions: React.Dispatch<React.SetStateAction<Record<string, ActionType>>>;
  handleChange: (values: ResolvedData, { action }: any, index: number) => void;
  dropDownOptions: ResolvedData[];
  isFetchingIngredient: boolean;
  ingredientsCount: number;
  className?: string;
}

const Form: React.FC<FormProps> = React.memo(
  props => {
    const {
      index,
      dropDownOptions,
      ounces,
      handleSearch,
      ingredientsCount,
      setActions,
      selectedActions,
      isFetchingIngredient,
      handleChange,
      setOunces,
      setIngredientsCount,
      className
    } = props;

    const _setOunces = (e: React.ChangeEvent<HTMLInputElement>) => {
      return setOunces(assocPath([index], e.target.value, ounces));
    };

    const _setActions = (value: Option<ActionType, ActionType>) => {
      return setActions(assocPath([index], value.label, selectedActions));
    };

    const removeIngredient = () => {
      return setIngredientsCount(ingredientsCount - 1);
    };

    const handleChangeInput = (value: any, action: any) => {
      return handleChange(value, action, index);
    };

    const _handleSearch = (value: string) => {
      return handleSearch(value, index);
    };

    return (
      <div className={className} key={index}>
        <Typography variant="h6">Ingredient {index + 1}</Typography>
        <Searchbar
          className="react-select-container"
          classNamePrefix="react-select"
          dropDownOptions={dropDownOptions}
          loading={isFetchingIngredient}
          handleChange={_handleSearch}
          handleSelect={handleChangeInput}
          loadingMessage={() => 'Fetching ingredients...'}
          noOptionsMessage={() => 'No Ingredients Found'}
          placeholder="Search for an ingredient"
        />
        <TextField
          type="number"
          onChange={_setOunces}
          placeholder="Enter Number of Parts"
        />
        <Select
          options={createOptions(actions)}
          handleSelect={_setActions}
          defaultOption="Select Action"
        />
        {index > 0 && (
          <Button onClick={removeIngredient} variant="secondary">
            Remove Ingredient
          </Button>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      equals(
        prevProps.selectedActions[prevProps.index],
        nextProps.selectedActions[nextProps.index]
      ) &&
      equals(
        prevProps.ounces[prevProps.index],
        nextProps.ounces[nextProps.index]
      ) &&
      equals(prevProps.ingredientsCount, nextProps.ingredientsCount) &&
      equals(prevProps.isFetchingIngredient, nextProps.isFetchingIngredient) &&
      equals(prevProps.dropDownOptions, nextProps.dropDownOptions)
    );
  }
);
