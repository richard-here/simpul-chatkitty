import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#281876',
    },
    contrastThreshold: 4.5,
  },
  typography: {
    fontFamily: [
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'sans-serif',
    ].join(','),
    fontSize: 12,
    h1: {
      fontSize: '1.5em',
      fontWeight: 'bold',
    },
    h2: {
      fontSize: '1.2em',
      fontWeight: 'bold',
    },
    h3: {
      fontSize: '1.1em',
    },
    subtitle1: {
      fontSize: '1em',
      marginTop: 0,
      lineHeight: 1.75,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1400,
      },
    },
  },
});

export default theme;
