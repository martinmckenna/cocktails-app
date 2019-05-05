import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import { SnackbarProvider, SnackbarProviderProps } from 'notistack';
import React from 'react';
import { compose } from 'recompose';

type ClassNames = 'root' | 'success' | 'error';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {},
  success: {
    backgroundColor: 'rgba(0,107,224,.98)'
  },
  error: {
    backgroundColor: 'rgba(171,4,87,.86)'
  }
});

type CombinedProps = SnackbarProviderProps & WithStyles<ClassNames>;

const _SnackbarProvider: React.FC<CombinedProps> = props => {
  const { classes, ...rest } = props;

  return (
    <SnackbarProvider
      {...rest}
      maxSnack={3}
      classes={{
        variantError: classes.error,
        variantSuccess: classes.success
      }}
    >
      {props.children}
    </SnackbarProvider>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, SnackbarProviderProps>(
  styled,
  React.memo
)(_SnackbarProvider);
