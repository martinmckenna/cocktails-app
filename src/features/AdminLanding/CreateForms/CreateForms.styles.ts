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
      margin: theme.spacing.unit
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
