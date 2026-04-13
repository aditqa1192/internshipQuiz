import { useEffect, useState } from "react";
import { Box, Paper, Typography, Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
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
  const [assessmentTypes, setAssessmentTypes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [statsResponse, typesResponse] = await Promise.all([
          adminFetch("/api/admin/dashboard"),
          adminFetch("/api/admin/assessment-types")
        ]);
        const statsPayload = await statsResponse.json();
        const typesPayload = await typesResponse.json();
        setStats(statsPayload);
        setAssessmentTypes(typesPayload.assessmentTypes || []);
      } catch (err) {
        setError(err.message);
      }
    }
    loadData();
  }, []);

  const openSubmission = (submission) => {
    setSelected(submission);
  };

  const closeDialog = () => {
    setSelected(null);
  };

  const getAssessmentName = (id) => {
    const type = assessmentTypes.find(t => t.id === id);
    return type ? type.name : id;
  };

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
                <Box key={item.id} sx={{ mb: 2, p: 2, bgcolor: "background.paper", borderRadius: 1, border: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {item.studentInfo.name} — {getAssessmentName(item.assessmentType)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Score: {item.score}/{item.totalQuestions} • {new Date(item.submittedAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Button size="small" onClick={() => openSubmission(item)}>
                    View
                  </Button>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">No submissions yet.</Typography>
            )}
          </Paper>
        </>
      )}
      <Dialog open={Boolean(selected)} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>Submission details</DialogTitle>
        <DialogContent>
          {selected && (
            <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                {selected.studentInfo.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {selected.studentInfo.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                College: {selected.studentInfo.collegeName} ({selected.studentInfo.collegeId})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Assessment: {getAssessmentName(selected.assessmentType)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Submitted: {new Date(selected.submittedAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Score: {selected.score}/{selected.totalQuestions} ({selected.percentage}%)
              </Typography>
              {selected.pdfUrl && (
                <Button href={selected.pdfUrl} target="_blank" rel="noreferrer" variant="outlined">
                  Open PDF report
                </Button>
              )}
              <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Answer breakdown
                </Typography>
                {selected.results.map((item, index) => (
                  <Box key={item.id ?? index} sx={{ mb: 1, p: 1, bgcolor: item.isCorrect ? "success.lighter" : "error.lighter", borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight={700}>
                      Q{index + 1}. {item.question}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your answer: {item.studentAnswer.length ? item.studentAnswer.map((answerIndex) => item.options[answerIndex]).join(", ") : "Not answered"}
                    </Typography>
                    {!item.isCorrect && (
                      <Typography variant="body2" color="text.secondary">
                        Correct answer: {item.correctAnswers.map((answerIndex) => item.options[answerIndex]).join(", ")}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}

export default DashboardPage;
