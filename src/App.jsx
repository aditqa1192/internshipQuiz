import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import StudentInfoPage from "./pages/StudentInfoPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import AlreadySubmittedPage from "./pages/AlreadySubmittedPage";
import AdminLoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import QuestionsPage from "./pages/admin/QuestionsPage";
import SubmissionsPage from "./pages/admin/SubmissionsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import AdminGuard from "./components/AdminGuard";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StudentInfoPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/already-submitted" element={<AlreadySubmittedPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminGuard><DashboardPage /></AdminGuard>} />
          <Route path="/admin/questions" element={<AdminGuard><QuestionsPage /></AdminGuard>} />
          <Route path="/admin/submissions" element={<AdminGuard><SubmissionsPage /></AdminGuard>} />
          <Route path="/admin/settings" element={<AdminGuard><SettingsPage /></AdminGuard>} />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
