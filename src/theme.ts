import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    text: {
      primary: '#fff',
      secondary: '#000'
    },
    primary: {
      main: '#3b96fb'
    },
    secondary: {
      main: '#FF69B4'
    }
  }
});

export default theme;
