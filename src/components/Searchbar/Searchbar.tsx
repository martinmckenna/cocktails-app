import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import { equals } from 'ramda';
import React from 'react';
import Select, { components } from 'react-select';
import { Props as SelectProps } from 'react-select/lib/Select';
import { compose } from 'recompose';

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
  ingredientsCount?: number;
  index?: number;
}

type CombinedProps = Props & WithStyles<ClassNames> & SelectProps;

const Searchbar: React.SFC<CombinedProps> = props => {
  const {
    handleChange,
    dropDownOptions,
    loading,
    handleSelect,
    handleSubmit
  } = props;

  const [query, setQuery] = React.useState<string>('');

  const inputRef = React.useCallback(
    node => {
      const { ingredientsCount, index } = props;
      if (node && ingredientsCount && index && ingredientsCount === index + 1) {
        node.focus();
      }
    },
    [props.ingredientsCount]
  );

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
      inputValue={query}
      key={props.index || 0}
      options={filteredOptions as any}
      name="ingredients"
      onInputChange={onInputChange}
      isLoading={loading}
      isClearable={true}
      ref={inputRef}
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
            tabIndex={0}
            style={{
              width: '100%',
              paddingTop: '1em',
              paddingBottom: '1em',
              backgroundColor: '#E0E0E0',
              color: '#000',
              textDecoration: 'underline'
            }}
            onClick={props.handleSubmit}
            plain
          >
            Search (CMD + Enter or Ctrl + Enter)
          </Button>
        )}
      </components.MenuList>
    </React.Fragment>
  );
};

const styled = withStyles(styles);

const memoized = (component: React.FC<CombinedProps>) =>
  React.memo(component, (prevProps, nextProps) => {
    return (
      equals(prevProps.dropDownOptions, nextProps.dropDownOptions) &&
      prevProps.loading === nextProps.loading &&
      prevProps.ingredientsCount === nextProps.ingredientsCount
    );
  });

export default compose<CombinedProps, Props & SelectProps>(
  memoized,
  styled
)(Searchbar);
