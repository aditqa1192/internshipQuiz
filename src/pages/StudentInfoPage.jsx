import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Layout from "../components/Layout";

const STORAGE_KEY = "qh_quiz_submitted";

function StudentInfoPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        collegeName: "",
        collegeId: "",
        department: "",
        assessmentType: "gen-ai",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Redirection must happen in useEffect, NOT during render
        if (localStorage.getItem(STORAGE_KEY) === "true") {
            navigate("/already-submitted", { replace: true });
        }
    }, [navigate]);


    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }
        if (!formData.collegeName.trim())
            newErrors.collegeName = "College name is required";
        if (!formData.collegeId.trim())
            newErrors.collegeId = "College ID is required";
        if (!formData.department.trim())
            newErrors.department = "department or degree is required";
        if (!formData.assessmentType) newErrors.assessmentType = "Select an assessment type";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        // Store student info and selected assessment type in sessionStorage for use in quiz and results
        sessionStorage.setItem("qh_student_info", JSON.stringify(formData));
        sessionStorage.setItem("qh_assessment_type", formData.assessmentType);
        const startTime = Date.now();
        const timeLimitMs = 5 * 60 * 1000; // 5 minutes
        sessionStorage.setItem("qh_quiz_end_time", (startTime + timeLimitMs).toString());
        navigate("/quiz");
    };

    const handleChange = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

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
                        p: 4,
                        width: "100%",
                        maxWidth: 480,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Box sx={{ textAlign: "center", mb: 2 }}> {/* Reduced from 3 */}
                        <Box
                            sx={{
                                width: 48, // Reduced from 56
                                height: 48, // Reduced from 56
                                borderRadius: "50%",
                                bgcolor: "primary.main",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                                mb: 1.5, // Reduced from 2
                            }}
                        >
                            <PersonOutlineIcon sx={{ color: "white", fontSize: 24 }} /> {/* Reduced from 28 */}
                        </Box>
                        <Typography variant="h5" gutterBottom>
                            Welcome!
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Please enter your details to begin the assessment.
                        </Typography>
                    </Box>

                    <Alert severity="info" sx={{ mb: 2, py: 0.5 }}> {/* Reduced mb and added py */}
                        You will have only <strong>one attempt</strong> to complete this
                        assessment.
                    </Alert>

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="Full Name"
                            fullWidth
                            value={formData.name}
                            onChange={handleChange("name")}
                            error={!!errors.name}
                            helperText={errors.name}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Email Address"
                            type="email"
                            fullWidth
                            value={formData.email}
                            onChange={handleChange("email")}
                            error={!!errors.email}
                            helperText={errors.email}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="College Name"
                            fullWidth
                            value={formData.collegeName}
                            onChange={handleChange("collegeName")}
                            error={!!errors.collegeName}
                            helperText={errors.collegeName}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="College ID"
                            fullWidth
                            value={formData.collegeId}
                            onChange={handleChange("collegeId")}
                            error={!!errors.collegeId}
                            helperText={errors.collegeId}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="department/Degree"
                            fullWidth
                            value={formData.department}
                            onChange={handleChange("department")}
                            error={!!errors.department}
                            helperText={errors.department}
                            sx={{ mb: 2 }}
                        />
            
                        <FormControl component="fieldset" sx={{ mb: 3 }} error={!!errors.assessmentType}>
                            <FormLabel component="legend">Select Assessment Type</FormLabel>
                            <RadioGroup
                                row
                                value={formData.assessmentType}
                                onChange={(e) => setFormData((prev) => ({ ...prev, assessmentType: e.target.value }))}
                            >
                                <FormControlLabel
                                    value="gen-ai"
                                    control={<Radio />}
                                    label="Generative AI aptitude"
                                />
                                <FormControlLabel
                                    value="cybersecurity"
                                    control={<Radio />}
                                    label="Cybersecurity aptitude"
                                />
                            </RadioGroup>
                            {errors.assessmentType && (
                                <Typography variant="caption" color="error.main">
                                    {errors.assessmentType}
                                </Typography>
                            )}
                        </FormControl>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ py: 1.5 }}
                        >
                            Start Assessment
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Layout>
    );
}

export default StudentInfoPage;
