import Grid from '@material-ui/core/Grid';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { RouteComponentProps } from '@reach/router';
import React from 'react';
import { compose } from 'recompose';

import { getCocktail, getCocktailImages } from 'src/services/cocktails';
import { APIError, Cocktail } from 'src/services/types';

import Error from 'src/components/LandingError';
import Loading from 'src/components/LandingLoading';
import LazyImage from 'src/components/LazyImage';

type ClassNames = 'root' | 'details';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    padding: theme.spacing.unit
  },
  details: {
    padding: theme.spacing.unit * 3,
    '& > p': {
      marginBottom: theme.spacing.unit
    },
    '& > h3': {
      marginBottom: theme.spacing.unit
    },
    '& > h5': {
      margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 4}px 0`
    }
  }
});

type CombinedProps = WithStyles<ClassNames> &
  RouteComponentProps<{ id: number }>;

const CocktailDetail: React.FC<CombinedProps> = props => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [imageLoading, setImageLoading] = React.useState<boolean>(true);
  const [imageError, setImageError] = React.useState<string>('');
  const [imageSrc, setImageSrc] = React.useState<string>('');
  const [error, setError] = React.useState<APIError | undefined>(undefined);
  const [cocktail, setCocktail] = React.useState<Cocktail | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (!props.id) {
      return;
    }
    getCocktail(+props.id)
      .then(response => {
        setCocktail(response);
        setLoading(false);

        getCocktailImages(response.name)
          .then(listOfImages => {
            setImageLoading(false);
            setImageSrc(listOfImages[2].link);
          })
          .catch(e => {
            setImageError('There was an error loading this image.');
            setImageLoading(false);
          });
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading || imageLoading) {
    return <Loading message="Fetching this cocktail" />;
  }

  if (error) {
    return <Error message="Dangit. Something went wrong" />;
  }

  if (!cocktail) {
    return <Error message={`${`Dangit. We couldn't find this cocktail`}`} />;
  }

  return (
    <React.Fragment>
      <Grid container className={props.classes.root}>
        <Grid item sm={5} xs={12}>
          <LazyImage
            src={imageSrc}
            imageError={imageError}
            imageLoading={imageLoading}
          />
        </Grid>
        <Grid item sm={7} xs={12} className={props.classes.details}>
          <Typography variant="h3">{cocktail.name}</Typography>
          <Typography>
            <em>Served in a {cocktail.glass} glass</em>
          </Typography>
          <Typography variant="h5">Serving Instructions</Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, RouteComponentProps>(
  styled,
  React.memo
)(CocktailDetail);
