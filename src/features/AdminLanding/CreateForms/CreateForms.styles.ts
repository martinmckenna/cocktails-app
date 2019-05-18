import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';

type ClassNames = 'root' | 'section' | 'buttonWrapper';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    display: 'flex',
    padding: theme.spacing.unit * 2,
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
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing.unit * 8,
    '&>button': {
      width: '40%',
      margin: theme.spacing.unit,
      flexGrow: 1
    }
  }
});

export type FormStyleProps = WithStyles<ClassNames>;

export default withStyles(styles);
