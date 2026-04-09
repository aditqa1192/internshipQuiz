import { useEffect, useState } from "react";
import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import AdminLayout from "../../components/AdminLayout";
import { adminFetch } from "../../utils/adminApi";

function DashboardCard({ title, value, children }) {
  return (
    <Paper sx={{ p: 3, minHeight: 140, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
      </Box>
      {children}
    </Paper>
  );
}

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await adminFetch("/api/admin/dashboard");
        const payload = await response.json();
        setStats(payload);
      } catch (err) {
        setError(err.message);
      }
    }
    loadStats();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {error ? (
        <Typography color="error.main">{error}</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title="Total Submissions" value={stats?.totalSubmissions ?? "—"} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title="Average Score" value={`${stats?.averageScore ?? "—"}%`} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title="Pass Rate" value={`${stats?.passRate ?? "—"}%`} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title="Total Questions" value={stats?.questionCount ?? "—"} />
            </Grid>
          </Grid>

          <Paper sx={{ mt: 3, p: 3, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" gutterBottom>
              Latest Submissions
            </Typography>
            {stats?.latestSubmissions?.length ? (
              stats.latestSubmissions.map((item) => (
                <Box key={item.id} sx={{ mb: 2, p: 2, bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider" }}>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {item.studentInfo.name} — {item.assessmentType}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Score: {item.score}/{item.totalQuestions} • {new Date(item.submittedAt).toLocaleString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">No submissions yet.</Typography>
            )}
          </Paper>
        </>
      )}
    </AdminLayout>
  );
}

export default DashboardPage;
