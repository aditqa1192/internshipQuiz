import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import StudentInfoPage from "./pages/StudentInfoPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import AlreadySubmittedPage from "./pages/AlreadySubmittedPage";

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
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
