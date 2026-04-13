import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import AdminLayout from "../../components/AdminLayout";
import { adminFetch } from "../../utils/adminApi";

function SubmissionsPage() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [assessmentTypes, setAssessmentTypes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [submissionsResponse, typesResponse] = await Promise.all([
          adminFetch("/api/admin/submissions"),
          adminFetch("/api/admin/assessment-types")
        ]);
        const submissionsData = await submissionsResponse.json();
        const typesData = await typesResponse.json();
        setSubmissions(submissionsData.submissions || []);
        setAssessmentTypes(typesData.assessmentTypes || []);
        setError("");
      } catch (err) {
        if (err.message === "Unauthorized") {
          // Token is invalid, redirect to login
          navigate("/admin/login", { replace: true });
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [navigate]);

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
    <AdminLayout title="Submissions">
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <Typography>Loading submissions...</Typography>
        </Box>
      ) : (
        <>
          {error && (
            <Typography color="error.main" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Paper sx={{ border: "1px solid", borderColor: "divider" }}>
            <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>College</TableCell>
                <TableCell>Assessment</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id} hover>
                  <TableCell>{submission.studentInfo.name}</TableCell>
                  <TableCell>{submission.studentInfo.email}</TableCell>
                  <TableCell>{submission.studentInfo.collegeName}</TableCell>
                  <TableCell>{getAssessmentName(submission.assessmentType)}</TableCell>
                  <TableCell>
                    {submission.score}/{submission.totalQuestions} ({submission.percentage}%)
                  </TableCell>
                  <TableCell>{new Date(submission.submittedAt).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => openSubmission(submission)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!submissions.length && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No submissions available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
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

export default SubmissionsPage;
