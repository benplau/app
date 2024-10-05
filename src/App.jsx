import "./App.css";
import React from "react";
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import LatePaymentInterestPage from "./components/LatePaymentInterestPage";
import { AuthProvider } from "./AuthContext";
import CreateAccountPage from "./components/CreateAccountPage";
import SignInPage from "./components/SignInPage";
import RelevantInformationPage from "./components/RelevantInformationPage";
import PastRecordsPage from "./components/PastRecordsPage";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route index element={<LatePaymentInterestPage />} />
              <Route
                path="judgment-debt"
                element={<LatePaymentInterestPage />}
              />
              <Route path="login" element={<SignInPage />} />
              <Route path="create-account" element={<CreateAccountPage />} />
              <Route path="past-records" element={<PastRecordsPage />} />
              <Route
                path="relevant-information"
                element={<RelevantInformationPage />}
              />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
