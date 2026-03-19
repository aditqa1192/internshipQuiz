import { Box, Paper, Typography } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import Layout from "../components/Layout";

function AlreadySubmittedPage() {
    return (
        <Layout>
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        textAlign: "center",
                        maxWidth: 480,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <BlockIcon
                        sx={{ fontSize: 56, color: "text.disabled", mb: 2 }}
                    />
                    <Typography variant="h5" gutterBottom>
                        Already Submitted
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        You have already completed this assessment. Only one attempt is
                        allowed. If you believe this is an error, please contact the
                        administrator.
                    </Typography>
                </Paper>
            </Box>
        </Layout>
    );
}

export default AlreadySubmittedPage;
