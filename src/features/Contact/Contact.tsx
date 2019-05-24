import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { RouteComponentProps } from '@reach/router';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React from 'react';
import { compose } from 'recompose';

import Button from 'src/components/Button';
import TextField from 'src/components/TextField';

import {
  Contact as ContactPayload,
  contactSchema,
  sendEmail
} from 'src/services/contact';

import { Field, Form, Formik } from 'formik';

type ClassNames = 'root' | 'form' | 'desc';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    margin: '0 auto',
    marginTop: theme.spacing.unit * 4,
    width: '85%'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing.unit * 2,
    '&>*': {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit
    }
  },
  desc: {
    paddingTop: theme.spacing.unit * 1.5
  }
});

type CombinedProps = WithStyles<ClassNames> &
  RouteComponentProps &
  WithSnackbarProps;

const Contact: React.FC<CombinedProps> = props => {
  const { classes } = props;
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleEmail = (values: ContactPayload, reset: () => void) => {
    setLoading(true);
    sendEmail(values)
      .then(() => {
        reset();
        setLoading(false);
        props.enqueueSnackbar('Message sent successfully.', {
          variant: 'success'
        });
      })
      .catch(e => {
        setLoading(false);
        props.enqueueSnackbar('Error sending message', {
          variant: 'error'
        });
      });
  };
  return (
    <div className={classes.root}>
      <Typography variant="h3">Contact Me</Typography>
      <Formik
        initialValues={{
          name: '',
          email: '',
          desc: ''
        }}
        validationSchema={contactSchema}
        onSubmit={(values, actions) => handleEmail(values, actions.resetForm)}
      >
        {({ errors, handleChange, values }) => {
          return (
            <Form className={classes.form}>
              <TextField
                label={'Full Name (required)'}
                error={errors.name}
                value={values.name}
                name="name"
                onChange={handleChange}
                placeholder="Full name (required)"
              />
              <TextField
                label={'Email (required)'}
                error={errors.email}
                value={values.email}
                name="email"
                onChange={handleChange}
                type="email"
                placeholder="Email (required)"
              />
              <TextField
                label={'Description (required)'}
                error={errors.desc}
                inputClass={classes.desc}
                value={values.desc}
                name="desc"
                onChange={handleChange}
                placeholder="Message (required)"
                inputComponent="textarea"
                rows={5}
              />
              <Button type="submit" isLoading={loading}>
                Submit
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

const styled = withStyles(styles);

export default compose<CombinedProps, RouteComponentProps>(
  styled,
  withSnackbar,
  React.memo
)(Contact);
