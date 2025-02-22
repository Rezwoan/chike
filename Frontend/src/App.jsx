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
import WithdrawPage from "./pages/WithdrawPage"; // New import for withdrawal page

const App = () => {
    const [userAnswers, setUserAnswers] = useState(null);
    const [userId, setUserId] = useState(null); // Store userId globally

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

                    {/* Profile Page - Receives userId from trivia & login */}
                    <Route
                        path="/profile"
                        element={
                            <ProfilePage
                                userId={userId}
                                setUserId={setUserId}
                            />
                        }
                    />

                    {/* Withdraw Page */}
                    <Route path="/withdraw" element={<WithdrawPage />} />

                    {/* Trivia Game - Pass userId */}
                    <Route
                        path="/trivia"
                        element={
                            userId ? (
                                <TriviaGame
                                    userId={userId}
                                    onFinish={(answers) =>
                                        setUserAnswers(answers)
                                    }
                                />
                            ) : (
                                <LandingPage />
                            )
                        }
                    />

                    {/* Trivia Results - Pass userId and userAnswers */}
                    <Route
                        path="/trivia/results"
                        element={
                            userId && userAnswers ? (
                                <TriviaResult
                                    userId={userId}
                                    userAnswers={userAnswers}
                                />
                            ) : (
                                <WelcomeAboard />
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
