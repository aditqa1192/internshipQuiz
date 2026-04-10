import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { getAdminToken, clearAdminToken } from "../utils/adminApi";

function AdminGuard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = getAdminToken();
      if (!token) {
        // No token, redirect to login
        navigate("/admin/login", { replace: true });
      } else {
        // Token exists, allow access
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const token = getAdminToken();

  if (isChecking || !token) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default"
        }}
      >
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Checking admin access...
        </Typography>
        {!token && (
          <Button variant="contained" onClick={() => navigate("/admin/login", { replace: true })}>
            Go to Login
          </Button>
        )}
      </Box>
    );
  }

  return children;
}

export default AdminGuard;