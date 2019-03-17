import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import React from 'react';
import Select from 'react-select';
import { Props as SelectProps } from 'react-select/lib/Select';
import { compose, StateHandlerMap, withStateHandlers } from 'recompose';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {}
});

const customStyles = {
  menuList: (providedStyles: any) => ({ ...providedStyles, textAlign: 'left' })
};

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
  handleSubmit: () => void;
}

type CombinedProps = Props &
  WithStyles<ClassNames> &
  SearchState &
  SearchStateSetters &
  SelectProps;

const Searchbar: React.SFC<CombinedProps> = props => {
  const {
    handleChange,
    dropDownOptions,
    loading,
    handleSelect,
    handleSubmit,
    classes,
    query,
    setQuery
  } = props;

  const onInputChange = (value: string, action: any) => {
    /** don't clear the input when we blur the input field */
    if (
      action.action !== 'input-blur' &&
      action.action !== 'menu-close' &&
      action.action !== 'set-value'
    ) {
      setQuery(value);
      handleChange(value);
    }
    if (action.action === 'set-value') {
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    /**
     * submit form on ctrl+enter and shift+enter
     */
    if (
      (e.keyCode === 13 && e.shiftKey) ||
      (e.keyCode === 13 && e.ctrlKey) ||
      (e.keyCode === 13 && e.metaKey)
    ) {
      handleSubmit();
    }
  };

  /**
   * filter ice out of the drop down reccommendations because
   * we're adding it by default
   */
  const filteredOptions = dropDownOptions
    ? dropDownOptions.filter(
        eachSelectObj => eachSelectObj.label.toLowerCase() !== 'ice'
      )
    : [];

  return (
    <Select
      isMulti
      styles={customStyles}
      onKeyDown={handleKeyDown}
      inputValue={props.query}
      options={filteredOptions as any}
      name="ingredients"
      onInputChange={onInputChange}
      isLoading={loading}
      isClearable={true}
      onChange={handleSelect}
      {...props}
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

export default compose<CombinedProps, Props & SelectProps>(
  withSearchFunctions,
  styled,
  React.memo
)(Searchbar);
