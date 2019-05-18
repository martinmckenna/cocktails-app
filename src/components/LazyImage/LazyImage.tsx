import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import React from 'react';
import { compose } from 'recompose';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    width: '100%',
    height: 'auto',
    padding: theme.spacing.unit
  }
});

interface Props {
  src?: string;
  imageLoading: boolean;
  imageError?: string;
}

type CombinedProps = Props & WithStyles<ClassNames>;

const LazyImage: React.FC<CombinedProps> = props => {
  const [imageLoading, setImageLoading] = React.useState<boolean>(true);
  const [imageError, setImageError] = React.useState<string>('');

  const { classes } = props;

  if (!props.src) {
    return null;
  }

  return (
    <React.Fragment>
      <img
        className={classes.root}
        src={props.src}
        onError={() => {
          setImageLoading(false);
          setImageError('');
        }}
        onLoad={() => {
          setImageLoading(false);
        }}
      />
    </React.Fragment>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, Props>(
  styled,
  React.memo
)(LazyImage);
