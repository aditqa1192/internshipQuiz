import { useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, MenuItem, Paper, Select, Switch, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AdminLayout from "../../components/AdminLayout";
import { adminFetch } from "../../utils/adminApi";

const DEFAULT_NEW_QUESTION = {
  question: "",
  options: ["", "", "", ""],
  correctAnswers: [],
  type: "single",
  assessmentType: "cybersecurity",
  enabled: true,
};

function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [assessmentTypes, setAssessmentTypes] = useState([]);
  const [filterType, setFilterType] = useState("cybersecurity");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(DEFAULT_NEW_QUESTION);
  const [newType, setNewType] = useState({ id: "", name: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState("");

  const filteredQuestions = useMemo(
    () => questions.filter((question) => question.assessmentType === filterType),
    [questions, filterType]
  );

  useEffect(() => {
    async function loadData() {
      try {
        const [questionsResponse, typesResponse] = await Promise.all([
          adminFetch("/api/admin/questions"),
          adminFetch("/api/admin/assessment-types")
        ]);
        const questionsData = await questionsResponse.json();
        const typesData = await typesResponse.json();
        setQuestions(questionsData.questions || []);
        setAssessmentTypes(typesData.assessmentTypes || []);
      } catch (err) {
        console.error('API Error:', err);
        // Use mock data for testing
        setQuestions([
          {
            id: 1,
            question: "What does the 'CIA Triad' stand for in security?",
            options: [
              "Central Intelligence Agency",
              "Confidentiality, Integrity, Availability",
              "Control, Identification, Authentication",
              "Cyber, Information, Access"
            ],
            correctAnswers: [1],
            type: "single",
            assessmentType: "cybersecurity",
            enabled: true
          },
          {
            id: 2,
            question: "Which type of attack involves an attacker sitting between two parties to eavesdrop or modify communication?",
            options: [
              "DDoS",
              "SQL Injection",
              "Man-in-the-Middle (MITM)",
              "Brute Force"
            ],
            correctAnswers: [2],
            type: "single",
            assessmentType: "cybersecurity",
            enabled: true
          }
        ]);
        setAssessmentTypes([
          { id: "cybersecurity", name: "Cybersecurity" },
          { id: "gen-ai", name: "Generative AI" },
          { id: "Sales and Marketing", name: "Sales and Marketing" }
        ]);
        setError("Using mock data - API not available");
      }
    }
    loadData();
  }, []);

  const openNewQuestion = () => {
    setActiveQuestion(DEFAULT_NEW_QUESTION);
    setIsEditMode(false);
    setDialogOpen(true);
  };

  const openEditQuestion = (question) => {
    setActiveQuestion({ ...question, options: [...question.options] });
    setIsEditMode(true);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setError("");
  };

  const handleChange = (field, value) => {
    setActiveQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index, value) => {
    const nextOptions = [...activeQuestion.options];
    nextOptions[index] = value;
    setActiveQuestion((prev) => ({ ...prev, options: nextOptions }));
  };

  const handleCorrectToggle = (index) => {
    const nextAnswers = activeQuestion.correctAnswers.includes(index)
      ? activeQuestion.correctAnswers.filter((item) => item !== index)
      : [...activeQuestion.correctAnswers, index];
    setActiveQuestion((prev) => ({ ...prev, correctAnswers: nextAnswers }));
  };

  const submitQuestion = async () => {
    setError("");

    if (!activeQuestion.question.trim()) {
      setError("Question text is required.");
      return;
    }

    const options = activeQuestion.options.map((option) => option.trim());
    if (options.some((option) => !option)) {
      setError("Fill in all answer options.");
      return;
    }

    if (!activeQuestion.correctAnswers.length) {
      setError("Select at least one correct answer.");
      return;
    }

    try {
      const method = isEditMode ? "PUT" : "POST";
      const response = await adminFetch("/api/admin/questions", {
        method,
        body: JSON.stringify(activeQuestion),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Unable to save question.");
      }

      if (isEditMode) {
        setQuestions((prev) => prev.map((item) => (item.id === payload.question.id ? payload.question : item)));
      } else {
        setQuestions((prev) => [...prev, payload.question]);
      }
      setDialogOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      const response = await adminFetch(`/api/admin/questions?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.message || "Unable to delete question.");
      }
      setQuestions((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const openAddType = () => {
    setNewType({ id: "", name: "" });
    setTypeDialogOpen(true);
  };

  const handleTypeChange = (field, value) => {
    setNewType((prev) => ({ ...prev, [field]: value }));
  };

  const submitType = async () => {
    if (!newType.id.trim() || !newType.name.trim()) {
      setError("Both ID and name are required.");
      return;
    }

    try {
      const response = await adminFetch("/api/admin/assessment-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newType),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Unable to add assessment type.");
      }
      setAssessmentTypes((prev) => [...prev, payload.assessmentType]);
      setTypeDialogOpen(false);
      setNewType({ id: "", name: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTypeClose = () => {
    setTypeDialogOpen(false);
    setNewType({ id: "", name: "" });
  };

  const deleteType = async (id) => {
    try {
      const response = await adminFetch(`/api/admin/assessment-types?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.message || "Unable to delete assessment type.");
      }
      const remainingTypes = assessmentTypes.filter((type) => type.id !== id);
      setAssessmentTypes(remainingTypes);
      // If the deleted type was selected, switch to the first available type
      if (filterType === id && remainingTypes.length > 0) {
        setFilterType(remainingTypes[0].id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout title="Questions">
      <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Select value={filterType} onChange={(event) => setFilterType(event.target.value)} sx={{ minWidth: 220 }}>
          {assessmentTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" onClick={openAddType}>
            Add Heading
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openNewQuestion}>
            Add Question
          </Button>
        </Box>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>Headings</Typography>
      <Grid container spacing={1} sx={{ mb: 3 }}>
        {assessmentTypes.map((type) => (
          <Grid item key={type.id}>
            <Paper sx={{ p: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>{type.name} ({type.id})</Typography>
              <IconButton size="small" onClick={() => deleteType(type.id)} disabled={assessmentTypes.length <= 1}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ mb: 2 }}>Questions</Typography>

      <Grid container spacing={2}>
        {filteredQuestions.map((question) => (
          <Grid item xs={12} key={question.id}>
            <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {question.question}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {question.type === "multiple" ? "Multiple answers" : "Single answer"} • {question.enabled ? "Enabled" : "Disabled"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton size="small" onClick={() => openEditQuestion(question)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => deleteQuestion(question.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {question.options.map((option, index) => (
                  <Chip key={index} label={`${index + 1}. ${option}`} size="small" />
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{isEditMode ? "Edit Question" : "Add Question"}</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 1 }}>
            <TextField
              label="Question text"
              value={activeQuestion.question}
              onChange={(e) => handleChange("question", e.target.value)}
              fullWidth
              multiline
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              {activeQuestion.options.map((option, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <TextField
                    label={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Select
                value={activeQuestion.type}
                onChange={(e) => handleChange("type", e.target.value)}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="single">Single answer</MenuItem>
                <MenuItem value="multiple">Multiple answer</MenuItem>
              </Select>
              <Select
                value={activeQuestion.assessmentType}
                onChange={(e) => handleChange("assessmentType", e.target.value)}
                sx={{ minWidth: 200 }}
              >
                {assessmentTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              <FormControlLabel
                control={
                  <Switch
                    checked={activeQuestion.enabled}
                    onChange={(event) => handleChange("enabled", event.target.checked)}
                  />
                }
                label="Enabled"
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Correct answer(s)
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {activeQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={activeQuestion.correctAnswers.includes(index) ? "contained" : "outlined"}
                    onClick={() => handleCorrectToggle(index)}
                  >
                    {`Option ${index + 1}`}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={submitQuestion}>
            {isEditMode ? "Save changes" : "Create question"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={typeDialogOpen} onClose={handleTypeClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Assessment Heading</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 1 }}>
            <TextField
              label="Heading ID (e.g., machine-learning)"
              value={newType.id}
              onChange={(e) => handleTypeChange("id", e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              helperText="Use lowercase with hyphens, no spaces"
            />
            <TextField
              label="Display Name (e.g., Machine Learning)"
              value={newType.name}
              onChange={(e) => handleTypeChange("name", e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTypeClose}>Cancel</Button>
          <Button variant="contained" onClick={submitType}>
            Add Heading
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}

export default QuestionsPage;
