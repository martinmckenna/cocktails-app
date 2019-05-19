import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import classnames from 'classnames';
import React from 'react';
import { compose } from 'recompose';

import { ReactComponent as Cocktail } from 'src/icons/cocktail.svg';
// import Cocktail from 'src/icons/cocktail.svg';

type ClassNames =
  | 'mainImage'
  | 'placeholder'
  | 'wrapper'
  | 'loaded'
  | 'root'
  | 'fadeOut';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  wrapper: {
    position: 'relative',
    // width: '75%',
    width: '100%',
    height: '100%'
    // overflow: 'hidden'
  },
  root: {},
  mainImage: {
    zIndex: 2,
    opacity: 0,
    transition: 'opacity 1s ease',
    width: '100%',
    height: 'auto',
    position: 'absolute',
    left: 0,
    top: 0
  },
  placeholder: {
    zIndex: 1,
    opacity: 1,
    transition: 'opacity 1s ease',
    width: '100%',
    height: '100%'
  },
  loaded: {
    opacity: 1
  },
  fadeOut: {
    opacity: 0
  }
});

interface Props {
  src?: string;
  imageLoading: boolean;
  imageError?: string;
  rootClass?: string;
  alt?: string;
}

type CombinedProps = Props & WithStyles<ClassNames>;

const LazyImage: React.FC<CombinedProps> = props => {
  const [imageLoading, setImageLoading] = React.useState<boolean>(true);
  const [imageError, setImageError] = React.useState<string>('');

  const { classes } = props;

  const hasError = !!props.imageError || !!imageError;
  const isLoading = props.imageLoading || imageLoading;

  return (
    <div className={`${classes.wrapper} ${props.rootClass}`}>
      <Cocktail
        className={classnames({
          [classes.placeholder]: true,
          [classes.fadeOut]: !isLoading && props.src && !hasError
        })}
      />
      <img
        className={classnames({
          [classes.loaded]: !isLoading && !hasError && props.src,
          [classes.fadeOut]: hasError,
          [classes.mainImage]: true
        })}
        src={props.src}
        onError={e => {
          setImageLoading(false);
          setImageError('There was an error.');
        }}
        onLoad={() => {
          setImageLoading(false);
          setImageError('');
        }}
      />
    </div>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, Props>(
  styled,
  React.memo
)(LazyImage);
