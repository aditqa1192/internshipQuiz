import { Box, Button, Container, Divider, Link, Typography } from "@mui/material";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { clearAdminToken } from "../utils/adminApi";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Questions", path: "/admin/questions" },
  { label: "Submissions", path: "/admin/submissions" },
  { label: "Settings", path: "/admin/settings" },
];

function AdminLayout({ title, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.paper" }}>
      <Box sx={{ bgcolor: "primary.main", color: "common.white", py: 1.5, px: 3 }}>
        <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Admin Portal
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.8)">
              Manage questions, review submissions, and update quiz settings.
            </Typography>
          </Box>
          <Button variant="outlined" color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "background.default", py: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {title || "Admin"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                component={NavLink}
                to={item.path}
                underline="none"
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  color: "text.primary",
                  bgcolor: location.pathname === item.path ? "primary.light" : "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {item.label}
              </Link>
            ))}
          </Box>

          <Box>{children}</Box>
        </Container>
      </Box>
    </Box>
  );
}

export default AdminLayout;
