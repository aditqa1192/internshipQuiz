import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Button,
    Chip,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
    Backdrop,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Layout from "../components/Layout";
import questionsCyberSecurity from "../data/questions";
import questionsGenAI from "../data/questions_old";
import { generatePDF } from "../utils/generatePDF";

const STORAGE_KEY = "qh_quiz_submitted";

function QuizPage() {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [assessmentType, setAssessmentType] = useState("cybersecurity");

    useEffect(() => {
        // Check if already submitted
        if (localStorage.getItem(STORAGE_KEY) === "true") {
            navigate("/already-submitted", { replace: true });
            return;
        }

        // Check if student info exists
        const studentInfo = sessionStorage.getItem("qh_student_info");
        if (!studentInfo) {
            navigate("/", { replace: true });
            return;
        }

        // Check assessment type and set quiz questions
        const storedType = sessionStorage.getItem("qh_assessment_type");
        const selectedType = storedType === "gen-ai" ? "gen-ai" : "cybersecurity";
        setAssessmentType(selectedType);
        setQuestions(selectedType === "gen-ai" ? questionsGenAI : questionsCyberSecurity);
    }, [navigate]);

    const handleSingleAnswer = (questionId, optionIndex) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: [parseInt(optionIndex)],
        }));
    };

    const handleMultipleAnswer = (questionId, optionIndex, checked) => {
        setAnswers((prev) => {
            const current = prev[questionId] || [];
            if (checked) {
                return { ...prev, [questionId]: [...current, optionIndex] };
            } else {
                return {
                    ...prev,
                    [questionId]: current.filter((i) => i !== optionIndex),
                };
            }
        });
    };

    const answeredCount = Object.keys(answers).length;
    const totalQuestions = questions.length;
    const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

    const handleSubmitClick = () => {
        setConfirmOpen(true);
    };

    const handleConfirmSubmit = async () => {
        setConfirmOpen(false);
        setIsUploading(true);

        try {
            // Calculate results
            const results = questions.map((q) => {
                const studentAnswer = answers[q.id] || [];
                const isCorrect =
                    studentAnswer.length === q.correctAnswers.length &&
                    studentAnswer.every((a) => q.correctAnswers.includes(a));
                return {
                    ...q,
                    studentAnswer,
                    isCorrect,
                };
            });

            const score = results.filter((r) => r.isCorrect).length;
            const studentInfo = JSON.parse(
                sessionStorage.getItem("qh_student_info") || "{}"
            );

            const submittedAt = new Date().toISOString();
            const quizResults = {
                studentInfo,
                assessmentType,
                results,
                score,
                totalQuestions,
                submittedAt,
            };

            // 1. Generate PDF data for upload
            const pdfData = await generatePDF({ ...quizResults, returnOutput: true });

            // Convert ArrayBuffer to Base64 manually for the API
            const base64String = btoa(
                new Uint8Array(pdfData).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                )
            );

            const fileName = `QuanHack_Assessment_${studentInfo.name.replace(/\s+/g, "_")}_${studentInfo.collegeName.replace(/\s+/g, "_")}.pdf`;

            // 2. Upload to Azure via API
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName,
                    pdfBase64: base64String
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Upload failed');
            }

            // 3. Store results in sessionStorage for the results page
            sessionStorage.setItem("qh_quiz_results", JSON.stringify(quizResults));

            // 4. Mark as submitted and navigate
            localStorage.setItem(STORAGE_KEY, "true");
            navigate("/result");
        } catch (error) {
            console.error("Submission error:", error);
            alert("Submission failed. Please try again. Error: " + error.message);
        } finally {
            setIsUploading(false);
        }
    };


    return (
        <Layout>
            {/* Progress Bar */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                    }}
                >
                    <Typography variant="body2" fontWeight={600}>
                        Progress
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {answeredCount} / {totalQuestions} answered
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "grey.200",
                        "& .MuiLinearProgress-bar": {
                            borderRadius: 4,
                        },
                    }}
                />
            </Paper>

            {/* Questions */}
            {questions.map((q, index) => (
                <Paper
                    key={q.id}
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 2,
                        border: "1px solid",
                        borderColor: answers[q.id] ? "primary.light" : "divider",
                        transition: "border-color 0.2s",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5,
                            mb: 2,
                        }}
                    >
                        <Chip
                            label={`Q${index + 1}`}
                            size="small"
                            color={answers[q.id] ? "primary" : "default"}
                            sx={{ fontWeight: 700, mt: 0.3 }}
                        />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" fontWeight={500}>
                                {q.question}
                            </Typography>
                            {q.type === "multiple" && (
                                <Typography
                                    variant="caption"
                                    color="secondary.main"
                                    sx={{ mt: 0.5, display: "block" }}
                                >
                                    Select all that apply
                                </Typography>
                            )}
                        </Box>
                        {answers[q.id] && (
                            <CheckCircleOutlineIcon
                                color="primary"
                                sx={{ fontSize: 20, mt: 0.3 }}
                            />
                        )}
                    </Box>

                    {q.type === "single" ? (
                        <RadioGroup
                            value={answers[q.id] ? answers[q.id][0].toString() : ""}
                            onChange={(e) => handleSingleAnswer(q.id, e.target.value)}
                        >
                            {q.options.map((option, optIdx) => (
                                <FormControlLabel
                                    key={optIdx}
                                    value={optIdx.toString()}
                                    control={<Radio size="small" />}
                                    label={
                                        <Typography variant="body2">{option}</Typography>
                                    }
                                    sx={{
                                        mx: 0,
                                        py: 0.5,
                                        px: 1.5,
                                        mb: 0.5,
                                        borderRadius: 1.5,
                                        "&:hover": { bgcolor: "action.hover" },
                                        ...(answers[q.id]?.includes(optIdx) && {
                                            bgcolor: "primary.main",
                                            color: "white",
                                            "& .MuiTypography-root": { color: "white" },
                                            "& .MuiRadio-root": { color: "white" },
                                        }),
                                    }}
                                />
                            ))}
                        </RadioGroup>
                    ) : (
                        <FormGroup>
                            {q.options.map((option, optIdx) => (
                                <FormControlLabel
                                    key={optIdx}
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={answers[q.id]?.includes(optIdx) || false}
                                            onChange={(e) =>
                                                handleMultipleAnswer(q.id, optIdx, e.target.checked)
                                            }
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">{option}</Typography>
                                    }
                                    sx={{
                                        mx: 0,
                                        py: 0.5,
                                        px: 1.5,
                                        mb: 0.5,
                                        borderRadius: 1.5,
                                        "&:hover": { bgcolor: "action.hover" },
                                        ...(answers[q.id]?.includes(optIdx) && {
                                            bgcolor: "primary.main",
                                            color: "white",
                                            "& .MuiTypography-root": { color: "white" },
                                            "& .MuiCheckbox-root": { color: "white" },
                                        }),
                                    }}
                                />
                            ))}
                        </FormGroup>
                    )}
                </Paper>
            ))}

            {/* Submit Button */}
            <Box sx={{ textAlign: "center", my: 3 }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmitClick}
                    sx={{ px: 6, py: 1.5 }}
                >
                    Submit Assessment
                </Button>
                {answeredCount < totalQuestions && (
                    <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        You have {totalQuestions - answeredCount} unanswered question(s)
                    </Typography>
                )}
            </Box>

            {/* Confirmation Dialog */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Submit Assessment?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {answeredCount < totalQuestions
                            ? `You have answered ${answeredCount} out of ${totalQuestions} questions. Unanswered questions will be marked as incorrect. Are you sure you want to submit?`
                            : "You have answered all questions. Are you sure you want to submit? You will not be able to retake this assessment."}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Go Back</Button>
                    <Button
                        onClick={handleConfirmSubmit}
                        variant="contained"
                        color="primary"
                    >
                        Confirm Submit
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Loading Overlay */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: 'column', gap: 2 }}
                open={isUploading}
            >
                <CircularProgress color="inherit" />
                <Typography variant="h6">Submitting Assessment...</Typography>
                <Typography variant="body2">Generating PDF report...</Typography>
            </Backdrop>
        </Layout>
    );
}

export default QuizPage;
