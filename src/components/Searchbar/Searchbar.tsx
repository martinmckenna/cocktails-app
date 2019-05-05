import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import React from 'react';
import Select, { components } from 'react-select';
import { Props as SelectProps } from 'react-select/lib/Select';
import { compose, StateHandlerMap, withStateHandlers } from 'recompose';

import Button from 'src/components/Button';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    padding: theme.spacing.unit
  }
});

const customStyles = {
  menuList: (providedStyles: any) => ({
    ...providedStyles,
    textAlign: 'left',
    padding: 0
  }),
  option: (providedStyles: any) => ({ ...providedStyles, padding: '1em' }),
  loadingMessage: (providedStyles: any) => ({
    ...providedStyles,
    padding: '1em'
  }),
  noOptionsMessage: (providedStyles: any) => ({
    ...providedStyles,
    padding: '1em'
  })
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
  handleSubmit?: () => void;
  filterIce?: boolean;
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
    setQuery
    // query,
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
    if (!handleSubmit) {
      return;
    }

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
    ? !!props.filterIce
      ? dropDownOptions.filter(
          eachSelectObj => eachSelectObj.label.toLowerCase() !== 'ice'
        )
      : dropDownOptions
    : [];

  return (
    <Select
      styles={customStyles}
      onKeyDown={handleKeyDown}
      inputValue={props.query}
      options={filteredOptions as any}
      name="ingredients"
      onInputChange={onInputChange}
      isLoading={loading}
      isClearable={true}
      onChange={handleSelect}
      components={{
        MenuList: componentProps =>
          _Menu({ ...componentProps, handleSubmit: props.handleSubmit })
      }}
      {...props}
    />
  );
};

const _Menu: React.FC<any> = props => {
  return (
    <React.Fragment>
      <components.MenuList {...props}>
        {props.children}
        {props.handleSubmit && (
          <Button
            style={{
              width: '100%',
              paddingTop: '1em',
              paddingBottom: '1em',
              backgroundColor: '#E0E0E0'
            }}
            onClick={props.handleSubmit}
          >
            Search with selected ingredients
          </Button>
        )}
      </components.MenuList>
    </React.Fragment>
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
