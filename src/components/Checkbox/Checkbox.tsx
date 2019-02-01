import _Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { compose } from 'recompose';

type ClassNames = 'root' | 'container' | 'popper' | 'toolTip';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    color: theme.palette.primary.main
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  toolTip: {
    backgroundColor: '#eee'
  },
  popper: {
    cursor: 'pointer'
  }
});

interface Props extends CheckboxProps {
  helperText?: string;
  label: string;
}

type CombinedProps = Props & WithStyles<ClassNames>;

const Checkbox: React.SFC<CombinedProps> = props => {
  /** rest in this case being the rest of the checkbox props */
  const { classes, label, helperText, ...rest } = props;
  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <_Checkbox
            {...rest}
            classes={{
              root: classes.root
            }}
            color="primary"
          />
        }
        label={label}
      />
      {helperText && (
        <Tooltip
          disableTouchListener
          classes={{
            tooltip: classes.toolTip
          }}
          title={<Typography>{helperText}</Typography>}
        >
          <Typography className={classes.popper}>Huh?</Typography>
        </Tooltip>
      )}
    </div>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, Props>(
  styled,
  React.memo
)(Checkbox);
