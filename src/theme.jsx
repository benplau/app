import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5b7a7c",
    },
    secondary: {
      main: "#f6f3e8",
    },
    error: {
      main: "#f44336",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#ffffff",
          margin: 0,
          fontFamily: "Arial, sans-serif",
        },
        a: {
          textDecoration: "none",
          color: "inherit",
        },
      },
    },
  },
});

export default theme;
