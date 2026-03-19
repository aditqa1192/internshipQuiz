import { Box, Container, Typography } from "@mui/material";

const LOGO_PATH = "/quanhack-logo.png";

function Layout({ children }) {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.default",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    py: 0.75, // Reduced from 2
                    px: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
            >
                <Box
                    component="img"
                    src={LOGO_PATH}
                    alt="QuanHack Logo"
                    sx={{
                        height: 36,
                        width: "auto",
                        objectFit: "contain",
                        bgcolor: "white",
                        borderRadius: 1.5,
                        p: 0.5,
                    }}
                    onError={(e) => {
                        e.target.style.display = "none";
                    }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                    Intern Assessment
                </Typography>
            </Box>

            {/* Main Content */}
            <Container
                maxWidth="md"
                sx={{
                    flex: 1,
                    py: 1.5, // Reduced from 4
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {children}
            </Container>

            {/* Footer */}
            <Box
                sx={{
                    bgcolor: "primary.main",
                    color: "rgba(255,255,255,0.7)",
                    py: 1.5,
                    textAlign: "center",
                }}
            >
                <Typography variant="body2">
                    © {new Date().getFullYear()} Quanhack Solutions Pvt. Ltd. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}

export default Layout;
