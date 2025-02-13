import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import WelcomeAboard from "./pages/WelcomeAbroad";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SetPasswordPage from "./pages/SetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import TriviaGame from "./pages/TriviaGame";
import TriviaResult from "./pages/TriviaResult";

const App = () => {
    const [userAnswers, setUserAnswers] = useState(null); // Store user answers

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/reset-password"
                        element={<ResetPasswordPage />}
                    />
                    <Route path="/set-password" element={<SetPasswordPage />} />
                    <Route path="/welcome" element={<WelcomeAboard />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route
                        path="/trivia"
                        element={
                            <TriviaGame
                                onFinish={(answers) => setUserAnswers(answers)}
                            />
                        }
                    />
                    <Route
                        path="/trivia/results"
                        element={
                            userAnswers ? (
                                <TriviaResult userAnswers={userAnswers} />
                            ) : (
                                <LandingPage />
                            )
                        }
                    />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
