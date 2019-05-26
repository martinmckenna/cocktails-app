import Typography from '@material-ui/core/Typography';
import { assoc, equals } from 'ramda';
import React from 'react';
import { compose } from 'recompose';
import { debounce } from 'throttle-debounce';

import Button from 'src/components/Button';
import Searchbar, { ResolvedData } from 'src/components/Searchbar';
import Select, { Option } from 'src/components/Select';
import TextField from 'src/components/TextField';
import { ActionType } from 'src/services/cocktails';
import { getIngredients } from 'src/services/ingredients';
import { transformAPIResponseToReactSelect } from 'src/utils/transformAPIResponseToReactSelect';

interface Props {
  setIngredientsCount: (count: number) => void;
  index: number;
  ounces: Record<string, number>;
  setOunces: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  selectedActions: Record<string, ActionType>;
  setActions: React.Dispatch<React.SetStateAction<Record<string, ActionType>>>;
  unit: Record<string, string>;
  setUnit: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  // handleChange: (values: ResolvedData, { action }: any, index: number) => void;
  ingredientIDs: Record<string, number>;
  setIngredientIDs: (
    value: React.SetStateAction<Record<string, number>>
  ) => void;
  ingredientLabels: Record<string, string>;
  setIngredientLabels: (
    value: React.SetStateAction<Record<string, string>>
  ) => void;
  ingredientsCount: number;
  className?: string;
  loadingMessage: () => string;
  noOptionsMessage: () => string;
}

const createOptions = (list: string[]): Option<string, string>[] =>
  list.map(eachOption => ({
    label: eachOption,
    value: eachOption
  }));

const actions: string[] = ['Add', 'Muddle', 'Squeeze', 'Garnish', 'Rim'];

const units: string[] = [
  'Ounce',
  'None',
  'Dash',
  'Tablespoon',
  'Teaspoon',
  'Splash',
  'Pinch'
];

const Form: React.FC<Props> = props => {
  const {
    index,
    ounces,
    ingredientsCount,
    setActions,
    selectedActions,
    setIngredientIDs,
    ingredientIDs,
    loadingMessage,
    noOptionsMessage,
    setOunces,
    unit,
    setUnit,
    setIngredientsCount,
    ingredientLabels,
    setIngredientLabels,
    className
  } = props;

  const [dropDownOptions, setDropDownOptions] = React.useState<ResolvedData[]>(
    []
  );
  const [isFetchingIngredient, setIsFetchingIngredient] = React.useState<
    boolean
  >(false);

  /*
   * handler for selecting or removing an option
   */
  const selectIngredient = (values: ResolvedData, { action }: any) => {
    switch (action) {
      case 'remove-value':
      case 'pop-value':
      case 'select-option':
        setIngredientIDs(assoc(`${index}`, values.key, ingredientIDs));
        setIngredientLabels(assoc(`${index}`, values.label, ingredientLabels));
      default:
        return;
    }
  };

  const removeIngredient = () => {
    /** set parent state */
    setUnit(filterOutDeletedIndex(unit, index));
    setIngredientIDs(filterOutDeletedIndex(ingredientIDs, index));
    setIngredientLabels(filterOutDeletedIndex(ingredientLabels, index));
    setActions(filterOutDeletedIndex(selectedActions, index));
    setOunces(filterOutDeletedIndex(ounces, index));

    return setIngredientsCount(ingredientsCount - 1);
  };

  const _handleSearch = (value: string) => {
    return handleSearch(value);
  };

  const fetchIngredient = (value: string) => {
    return getIngredients({
      name: value
    })
      .then(response => {
        const firstFive = {
          ...response,
          data: response.data.filter((eachIng, filterInd) => filterInd < 5)
        };

        setIsFetchingIngredient(false);
        setDropDownOptions(transformAPIResponseToReactSelect(firstFive));
      })
      .catch((e: Error) => {
        setIsFetchingIngredient(false);
        setDropDownOptions([]);
      });
  };

  const debouncedFetch = debounce(400, false, fetchIngredient);

  const handleSearch = (value: string) => {
    setIsFetchingIngredient(true);
    debouncedFetch(value);
  };

  return (
    <div className={className} key={index}>
      <Typography variant="h6">Ingredient {index + 1}</Typography>
      <Searchbar
        className="react-select-container"
        classNamePrefix="react-select"
        dropDownOptions={dropDownOptions}
        defaultValue={ingredientLabels[index] as any}
        loading={isFetchingIngredient}
        handleChange={_handleSearch}
        isClearable={false}
        handleSelect={selectIngredient}
        loadingMessage={loadingMessage}
        noOptionsMessage={noOptionsMessage}
        placeholder="Search for an ingredient"
        ingredientsCount={ingredientsCount}
        index={index}
        key={index}
      />
      <UnitField
        selectedUnits={unit}
        index={index}
        setUnit={setUnit}
        ingCount={ingredientsCount}
      />
      <AmountField
        selectedAmounts={ounces}
        index={index}
        setAmount={setOunces}
        ingCount={ingredientsCount}
      />
      <ActionsField
        selectedActions={selectedActions}
        index={index}
        setActions={setActions}
        ingCount={ingredientsCount}
      />
      {index > 0 && (
        <Button onClick={removeIngredient} variant="secondary">
          Remove Ingredient
        </Button>
      )}
    </div>
  );
};

const filterOutDeletedIndex = (obj: Record<string, any>, index: number) => {
  return Object.keys(obj).reduce((acc, eachKey) => {
    return +eachKey === index
      ? acc
      : {
          ...acc,
          /** only subract one from the key if the key is not already 0 */
          [+eachKey !== 0 ? +eachKey - 1 : eachKey]: obj[eachKey]
        };
  }, {});
};

const memoized = (component: React.FC<Props>) =>
  React.memo(component, (prevProps, nextProps) => {
    return (
      equals(prevProps.selectedActions, nextProps.selectedActions) &&
      equals(prevProps.ounces, nextProps.ounces) &&
      equals(prevProps.unit, nextProps.unit) &&
      equals(prevProps.ingredientIDs, nextProps.ingredientIDs) &&
      equals(prevProps.ingredientLabels, nextProps.ingredientLabels) &&
      equals(prevProps.ingredientsCount, nextProps.ingredientsCount)
    );
  });

export default compose<Props, Props>(memoized)(Form);

const UnitField = React.memo(
  (props: {
    ingCount: number;
    selectedUnits: Record<string, string>;
    index: number;
    setUnit: (value: React.SetStateAction<Record<string, string>>) => void;
  }) => {
    const { selectedUnits, index, setUnit } = props;
    const updateUnits = (value: Option<string, string>) => {
      return setUnit(assoc(`${index}`, value.label, selectedUnits));
    };
    return (
      <Select
        options={createOptions(units)}
        handleSelect={updateUnits}
        defaultOption="Select Unit of Measurement"
        value={
          selectedUnits[index]
            ? {
                label: selectedUnits[index] as string,
                value: `${index}` as string
              }
            : undefined
        }
      />
    );
  },
  (prevProps, nextProps) =>
    equals(prevProps.selectedUnits, nextProps.selectedUnits) &&
    equals(prevProps.ingCount, nextProps.ingCount)
);

const AmountField = React.memo(
  (props: {
    ingCount: number;
    selectedAmounts: Record<string, number>;
    index: number;
    setAmount: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  }) => {
    const { selectedAmounts, index, setAmount } = props;
    const updateAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
      return setAmount(assoc(`${index}`, e.target.value, selectedAmounts));
    };
    return (
      <TextField
        type="number"
        onChange={updateAmount}
        // label="Ounces"
        placeholder="How many servings to your measurement"
        value={selectedAmounts[index] || ''}
      />
    );
  },
  (prevProps, nextProps) =>
    equals(prevProps.selectedAmounts, nextProps.selectedAmounts) &&
    equals(prevProps.ingCount, nextProps.ingCount)
);

const ActionsField = React.memo(
  (props: {
    ingCount: number;
    selectedActions: Record<string, ActionType>;
    index: number;
    setActions: (
      value: React.SetStateAction<Record<string, ActionType>>
    ) => void;
  }) => {
    const { selectedActions, index, setActions } = props;
    const updateActions = (value: Option<string, ActionType>) => {
      return setActions(assoc(`${index}`, value.label, selectedActions));
    };
    return (
      <Select
        options={createOptions(actions)}
        handleSelect={updateActions}
        defaultOption="Select Action"
        value={
          selectedActions[index]
            ? {
                label: selectedActions[index] as string,
                value: `${index}` as string
              }
            : undefined
        }
      />
    );
  },
  (prevProps, nextProps) =>
    equals(prevProps.selectedActions, nextProps.selectedActions) &&
    equals(prevProps.ingCount, nextProps.ingCount)
);
