import Paper from '@material-ui/core/Paper';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Link } from '@reach/router';
import React from 'react';
import { compose } from 'recompose';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    width: '48%',
    margin: theme.spacing.unit,
    '&>*': {
      padding: theme.spacing.unit * 2
    }
  }
});

interface Props {
  name: string;
  href: string;
}

type CombinedProps = Props & WithStyles<ClassNames>;

const SearchResultCard: React.FC<CombinedProps> = props => {
  return (
    <Link to={props.href} className={props.classes.root}>
      <Paper>
        <Typography>{props.name}</Typography>
      </Paper>
    </Link>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, Props>(
  styled,
  React.memo
)(SearchResultCard);
