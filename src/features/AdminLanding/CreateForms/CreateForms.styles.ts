import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';

type ClassNames = 'root' | 'section';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    '&>*': {
      width: '75%',
      margin: `${theme.spacing.unit}px 0 ${theme.spacing.unit}px 0`,
      [theme.breakpoints.down('sm')]: {
        width: '100%'
      }
    }
  },
  section: {
    marginTop: theme.spacing.unit * 3,
    display: 'flex',
    flexDirection: 'column',
    '&>*': {
      marginTop: theme.spacing.unit
    }
  }
});

export type FormStyleProps = WithStyles<ClassNames>;

export default withStyles(styles);
