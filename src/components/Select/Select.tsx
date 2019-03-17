import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import React from 'react';
import { compose } from 'recompose';

import TextField, { TextFieldProps } from '@material-ui/core/TextField';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {}
});

export interface Option<V = string | number, L = string | number> {
  value: V;
  label: L;
}

interface Props {
  options: Option[];
}

type CombinedProps = Props & TextFieldProps & WithStyles<ClassNames>;

const Select: React.SFC<CombinedProps> = props => {
  const { options, SelectProps, ...rest } = props;
  return (
    <TextField
      select
      defaultValue="Select One"
      SelectProps={{
        ...SelectProps,
        native: true
      }}
      {...rest}
    >
      <option disabled key={0} value="Select One">
        Select One
      </option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </TextField>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, TextFieldProps & Props>(
  styled,
  React.memo
)(Select);
