import Typography from '@material-ui/core/Typography';
import { assocPath, equals } from 'ramda';
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
  handleChange: (values: ResolvedData, { action }: any, index: number) => void;
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

const units: string[] = ['Ounce', 'Dash', 'Tablespoon', 'Teaspoon', 'Splash'];

const Form: React.FC<Props> = props => {
  const {
    index,
    ounces,
    ingredientsCount,
    setActions,
    selectedActions,
    handleChange,
    loadingMessage,
    noOptionsMessage,
    setOunces,
    unit,
    setUnit,
    setIngredientsCount,
    className
  } = props;

  const [dropDownOptions, setDropDownOptions] = React.useState<ResolvedData[]>(
    []
  );
  const [isFetchingIngredient, setIsFetchingIngredient] = React.useState<
    boolean
  >(false);

  const _setOunces = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setOunces(assocPath([index], e.target.value, ounces));
  };

  const _setActions = (value: Option<ActionType, ActionType>) => {
    return setActions(assocPath([index], value.label, selectedActions));
  };

  const _setUnit = (value: Option<string, string>) => {
    return setUnit(assocPath([index], value.label, unit));
  };

  const removeIngredient = () => {
    return setIngredientsCount(ingredientsCount - 1);
  };

  const handleChangeInput = (value: any, action: any) => {
    return handleChange(value, action, index);
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
        loading={isFetchingIngredient}
        handleChange={_handleSearch}
        handleSelect={handleChangeInput}
        loadingMessage={loadingMessage}
        noOptionsMessage={noOptionsMessage}
        placeholder="Search for an ingredient"
        ingredientsCount={ingredientsCount}
        index={index}
        key={index}
      />
      <Select
        options={createOptions(units)}
        handleSelect={_setUnit}
        defaultOption="Select Unit of Measurement"
      />
      <TextField
        type="number"
        onChange={_setOunces}
        // label="Ounces"
        placeholder="How many servings to your measurement"
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
};

const memoized = (component: React.FC<Props>) =>
  React.memo(component, (prevProps, nextProps) => {
    return (
      equals(
        prevProps.selectedActions[prevProps.index],
        nextProps.selectedActions[nextProps.index]
      ) &&
      equals(
        prevProps.ounces[prevProps.index],
        nextProps.ounces[nextProps.index]
      ) &&
      equals(prevProps.ingredientsCount, nextProps.ingredientsCount)
    );
  });

export default compose<Props, Props>(memoized)(Form);
