import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    text: {
      primary: '#000',
      secondary: '#fff'
    },
    primary: {
      main: '#3b96fb'
    },
    secondary: {
      main: '#fff'
    }
  }
});

export default theme;
