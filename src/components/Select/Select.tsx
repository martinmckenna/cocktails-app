import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import React from 'react';
import { compose } from 'recompose';

import Select from 'react-select';
import { Props as SelectProps } from 'react-select/lib/Select';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {}
});

export interface Option<V = string | number, L = string | number> {
  value: V;
  label: L;
  disabled?: boolean;
}

interface Props extends Omit<SelectProps, 'options' | 'onChange'> {
  options: Option[];
  defaultOption?: string;
  handleSelect: (value: any, actionMeta: any) => void;
}

type CombinedProps = Props & WithStyles<ClassNames>;

const _Select: React.SFC<CombinedProps> = props => {
  const { classes, options, defaultOption, handleSelect, ...rest } = props;

  const interceptedOptions: Option[] = defaultOption
    ? [
        {
          label: defaultOption,
          value: defaultOption,
          disabled: true
        },
        ...options
      ]
    : options;

  return (
    <Select
      {...rest}
      classNamePrefix="react-select"
      options={interceptedOptions as any}
      placeholder={
        defaultOption
          ? `${interceptedOptions[0].label}`
          : props.placeholder
          ? props.placeholder
          : 'Select an Option'
      }
      onChange={handleSelect}
      isOptionDisabled={(option: Option) => option.disabled || false}
    />
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, SelectProps & Props>(
  styled,
  React.memo
)(_Select);
