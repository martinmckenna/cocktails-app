import Grid from '@material-ui/core/Grid';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { RouteComponentProps } from '@reach/router';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { prop, sortBy } from 'ramda';
import React from 'react';
import { compose } from 'recompose';

import {
  deleteCocktail,
  getCocktail,
  getCocktailImages
} from 'src/services/cocktails';
import { APIError, Cocktail } from 'src/services/types';

import { isProduction } from 'src/constants';

import Button from 'src/components/Button';
import Error from 'src/components/LandingError';
import Loading from 'src/components/LandingLoading';
import LazyImage from 'src/components/LazyImage';

type ClassNames = 'root' | 'details' | 'steps' | 'deleteBtn' | 'imageWrapper';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    // padding: theme.spacing.unit,
    '& > div:first-child': {
      padding: theme.spacing.unit * 3
    },
    '& > div': {
      flexGrow: 1
    }
  },
  imageWrapper: {
    margin: '0 auto',
    width: '50%'
  },
  details: {
    padding: theme.spacing.unit * 3,
    paddingLeft: `${theme.spacing.unit * 5}px`,
    '& > p': {
      marginBottom: theme.spacing.unit
    },
    '& > h3': {
      marginBottom: theme.spacing.unit
    },
    '& > h5': {
      margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 4}px 0`
    }
  },
  steps: {
    marginLeft: theme.spacing.unit * 2,
    '& > p': {
      marginBottom: theme.spacing.unit
    }
  },
  deleteBtn: {
    width: '60%',
    marginTop: theme.spacing.unit * 5
  }
});

type CombinedProps = WithStyles<ClassNames> &
  RouteComponentProps<{ id: number }> &
  WithSnackbarProps;

const CocktailDetail: React.FC<CombinedProps> = props => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [imageLoading, setImageLoading] = React.useState<boolean>(true);
  const [imageError, setImageError] = React.useState<string>('');
  const [imageSrc, setImageSrc] = React.useState<string>('');
  const [error, setError] = React.useState<APIError | undefined>(undefined);
  const [cocktail, setCocktail] = React.useState<Cocktail | undefined>(
    undefined
  );
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  const handleDelete = () => {
    if (!props.id) {
      return Promise.reject('issue here');
    }
    setIsDeleting(true);
    deleteCocktail(+props.id)
      .then(response => {
        props.navigate!('/');
      })
      .catch(() => {
        setIsDeleting(false);
        props.enqueueSnackbar('There was an issue deleting this cocktail.');
      });
  };

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
            setImageSrc(listOfImages[0].link);
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

  if (loading) {
    return <Loading message="Fetching this cocktail" />;
  }

  if (error) {
    return <Error message="Dangit. Something went wrong" />;
  }

  if (!cocktail) {
    return <Error message={`${`Dangit. We couldn't find this cocktail`}`} />;
  }

  const sortedIngs = sortBy(prop('step'))(cocktail.ingredients);

  return (
    <React.Fragment>
      <Grid container className={props.classes.root}>
        <Grid item md={7} sm={12}>
          <LazyImage
            rootClass={props.classes.imageWrapper}
            src={imageSrc}
            imageError={imageError}
            imageLoading={imageLoading}
          />
        </Grid>
        <Grid item md={5} sm={12} className={props.classes.details}>
          <Typography variant="h3">{cocktail.name}</Typography>
          <Typography>
            <em>Served in a {cocktail.glass} glass</em>
          </Typography>
          <Typography variant="h5">Serving Instructions</Typography>
          <div className={props.classes.steps}>
            {sortedIngs.map(eachIng => {
              return (
                <Typography key={eachIng.id}>
                  {eachIng.step}.{' '}
                  {eachIng.action.charAt(0).toUpperCase() +
                    eachIng.action.substr(1)}{' '}
                  {eachIng.ounces === 0
                    ? eachIng.name
                    : eachIng.ounces > 1
                    ? `${eachIng.ounces} parts ${eachIng.name}`
                    : `${eachIng.ounces} part ${eachIng.name}`}
                </Typography>
              );
            })}
          </div>
          {!isProduction && (
            <Button
              isLoading={isDeleting}
              variant="secondary"
              onClick={handleDelete}
              className={props.classes.deleteBtn}
            >
              Delete
            </Button>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, RouteComponentProps>(
  styled,
  withSnackbar,
  React.memo
)(CocktailDetail);
