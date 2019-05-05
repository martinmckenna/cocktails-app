import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: 'Libre Baskerville,Arial,serif'
  },
  overrides: {
    MuiInputBase: {
      input: {
        backgroundColor: '#fff',
        borderRadius: 0,
        border: 'none',
        padding: '1em',
        '&:focus': {
          outline: '2px solid rgba(0,107,224,.98)'
        }
      }
    },
    MuiTypography: {
      h1: {
        fontFamily: 'Raleway,Arial,serif'
      },
      h2: {
        fontFamily: 'Raleway,Arial,serif'
      },
      h3: {
        fontFamily: 'Raleway,Arial,serif'
      },
      h4: {
        fontFamily: 'Raleway,Arial,serif'
      },
      h5: {
        fontFamily: 'Raleway,Arial,serif'
      },
      h6: {
        fontFamily: 'Raleway,Arial,serif'
      }
    },
    MuiButtonBase: {
      root: {
        padding: '.5em',
        fontSize: '1em',
        fontFamily: 'Raleway,Arial,serif',
        boxSizing: 'border-box',
        // '&:hover': {
        //   backgroundColor: '#fff'
        // },
        '&:focus': {
          // backgroundColor: 'rgba(0,107,224,.98)',
          outline: '1px solid rgba(0,107,224,.98)'
          // color: '#fff'
        }
      }
    }
  },
  palette: {
    text: {
      primary: '#000',
      secondary: '#fff'
    },
    primary: {
      main: 'rgba(0,107,224,.98)'
    },
    secondary: {
      main: '#fff'
    }
  }
});

export default theme;
