import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import AdminLayout from "../../components/AdminLayout";
import { adminFetch } from "../../utils/adminApi";

function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSubmissions() {
      try {
        const response = await adminFetch("/api/admin/submissions");
        const payload = await response.json();
        setSubmissions(payload.submissions || []);
      } catch (err) {
        setError(err.message);
      }
    }
    loadSubmissions();
  }, []);

  const openSubmission = (submission) => {
    setSelected(submission);
  };

  const closeDialog = () => {
    setSelected(null);
  };

  return (
    <AdminLayout title="Submissions">
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
                  <TableCell>{submission.assessmentType}</TableCell>
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
                Assessment: {selected.assessmentType}
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
