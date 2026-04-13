import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    Typography,
    Button,
    Chip,
    Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Layout from "../components/Layout";
import { generatePDF } from "../utils/generatePDF";

function ResultPage() {
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState(null);

    useEffect(() => {
        const data = sessionStorage.getItem("qh_quiz_results");
        if (!data) {
            navigate("/", { replace: true });
            return;
        }
        setQuizData(JSON.parse(data));
    }, [navigate]);

    if (!quizData) return null;

    const { studentInfo, assessmentType, assessmentName, results, score, totalQuestions, submittedAt } = quizData;
    const percentage = ((score / totalQuestions) * 100).toFixed(1);

    const getScoreColor = () => {
        if (percentage >= 80) return "success.main";
        if (percentage >= 50) return "warning.main";
        return "error.main";
    };

    const handleDownloadPDF = () => {
        generatePDF(quizData);
    };

    return (
        <Layout>
            {/* Score Summary Card */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    mb: 3,
                    textAlign: "center",
                    border: "1px solid",
                    borderColor: "divider",
                    background: "linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)",
                }}
            >
                <EmojiEventsIcon
                    sx={{ fontSize: 48, color: getScoreColor(), mb: 1 }}
                />
                <Typography variant="h5" gutterBottom>
                    Assessment Complete!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {studentInfo.name} ({studentInfo.email})
                </Typography>
                <Typography variant="body1" fontWeight={600} color="primary.main" sx={{ mb: 1 }}>
                    {studentInfo.collegeName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Assessment type: {assessmentName || assessmentType}
                </Typography>

                <Box
                    sx={{
                        display: "inline-flex",
                        alignItems: "baseline",
                        gap: 0.5,
                        mb: 1,
                    }}
                >
                    <Typography
                        variant="h2"
                        fontWeight={800}
                        sx={{ color: getScoreColor() }}
                    >
                        {score}
                    </Typography>
                    <Typography variant="h5" color="text.secondary">
                        / {totalQuestions}
                    </Typography>
                </Box>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                    {percentage}%
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadPDF}
                    sx={{ px: 4 }}
                >
                    Download PDF Report
                </Button>
            </Paper>

            {/* Detailed Breakdown */}
            <Typography variant="h6" sx={{ mb: 2 }}>
                Detailed Breakdown
            </Typography>

            {results.map((r, index) => (
                <Paper
                    key={r.id}
                    elevation={0}
                    sx={{
                        p: 2.5,
                        mb: 1.5,
                        border: "1px solid",
                        borderColor: r.isCorrect ? "success.light" : "error.light",
                        borderLeftWidth: 4,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1,
                            mb: 1,
                        }}
                    >
                        {r.isCorrect ? (
                            <CheckCircleIcon color="success" sx={{ fontSize: 20, mt: 0.3 }} />
                        ) : (
                            <CancelIcon color="error" sx={{ fontSize: 20, mt: 0.3 }} />
                        )}
                        <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
                            Q{index + 1}. {r.question}
                        </Typography>
                        <Chip
                            label={r.isCorrect ? "Correct" : "Wrong"}
                            size="small"
                            color={r.isCorrect ? "success" : "error"}
                            variant="outlined"
                        />
                    </Box>

                    <Box sx={{ pl: 3.5 }}>
                        <Typography variant="caption" color="text.secondary">
                            Your answer:{" "}
                            <strong>
                                {r.studentAnswer.length > 0
                                    ? r.studentAnswer.map((i) => r.options[i]).join(", ")
                                    : "Not answered"}
                            </strong>
                        </Typography>
                        {!r.isCorrect && (
                            <>
                                <br />
                                <Typography variant="caption" color="success.main">
                                    Correct answer:{" "}
                                    <strong>
                                        {r.correctAnswers.map((i) => r.options[i]).join(", ")}
                                    </strong>
                                </Typography>
                            </>
                        )}
                    </Box>
                </Paper>
            ))}
        </Layout>
    );
}

export default ResultPage;
