import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#455a64", // Blue Grey 700
            light: "#718792",
            dark: "#1c313a",
        },
        secondary: {
            main: "#607d8b", // Blue Grey 500
            light: "#8eacbb",
            dark: "#34515e",
        },
        background: {
            default: "#f5f7fa",
            paper: "#ffffff",
        },
        success: {
            main: "#2e7d32",
        },
        error: {
            main: "#d32f2f",
        },
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        h4: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                    padding: "10px 24px",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                },
            },
        },
    },
});

export default theme;
