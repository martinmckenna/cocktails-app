import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import React from 'react';
import Select from 'react-select';
import { compose, StateHandlerMap, withStateHandlers } from 'recompose';
import { debounce } from 'throttle-debounce';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {}
});

export interface ResolvedData {
  label: string;
  value: number;
  key: number;
  isFixed?: boolean;
}

interface Props {
  handleChange: (value: string) => void;
  loading: boolean;
  dropDownOptions?: ResolvedData[];
  handleSelect: (value: any, action: any) => void;
}

type CombinedProps = Props &
  WithStyles<ClassNames> &
  SearchState &
  SearchStateSetters;

const Searchbar: React.SFC<CombinedProps> = props => {
  const handleInputChange = (value: string, action: any) => {
    /** don't clear the input when we blur the input field */
    if (
      action.action !== 'input-blur' &&
      action.action !== 'menu-close' &&
      action.action !== 'set-value'
    ) {
      props.setQuery(value);
      props.handleChange(value);
    }
    if (action.action === 'set-value') {
      props.setQuery('');
    }
  };
  const filteredOptions = props.dropDownOptions
    ? props.dropDownOptions.filter(
        eachSelectObj => eachSelectObj.label.toLowerCase() !== 'ice'
      )
    : [];
  return (
    <Select
      isMulti
      inputValue={props.query}
      options={filteredOptions}
      name="ingredients"
      onInputChange={handleInputChange}
      isLoading={props.loading}
      isClearable={true}
      onChange={props.handleSelect}
    />
  );
};

interface SearchState {
  query: string;
}

interface SearchStateSetters {
  setQuery: (query: string) => void;
}

type StateAndSetters = StateHandlerMap<SearchState> & SearchStateSetters;

const withSearchFunctions = withStateHandlers<SearchState, StateAndSetters, {}>(
  {
    query: ''
  },
  {
    setQuery: () => query => ({ query })
  }
);

const styled = withStyles(styles);

export default compose<CombinedProps, Props>(
  withSearchFunctions,
  styled,
  React.memo
)(Searchbar);
