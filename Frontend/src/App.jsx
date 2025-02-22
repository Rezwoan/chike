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
import WithdrawPage from "./pages/WithdrawPage";

// Admin Panel Components
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminLayout from "./pages/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import UserManagementPage from "./pages/UserManagementPage";
import ReferralManagementPage from "./pages/ReferralManagementPage";
import WinnerManagementPage from "./pages/WinnerManagementPage";
import WithdrawalManagementPage from "./pages/WithdrawalManagementPage";

const App = () => {
    const [userAnswers, setUserAnswers] = useState(null);
    const [userId, setUserId] = useState(null);

    return (
        <Router>
            <div>
                <Routes>
                    {/* User Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/reset-password"
                        element={<ResetPasswordPage />}
                    />
                    <Route path="/set-password" element={<SetPasswordPage />} />
                    <Route path="/welcome" element={<WelcomeAboard />} />
                    <Route
                        path="/profile"
                        element={
                            <ProfilePage
                                userId={userId}
                                setUserId={setUserId}
                            />
                        }
                    />
                    <Route path="/withdraw" element={<WithdrawPage />} />
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

                    {/* Admin Panel Routes */}
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="users" element={<UserManagementPage />} />
                        <Route
                            path="referrals"
                            element={<ReferralManagementPage />}
                        />
                        <Route
                            path="winners"
                            element={<WinnerManagementPage />}
                        />
                        <Route
                            path="withdrawals"
                            element={<WithdrawalManagementPage />}
                        />
                    </Route>
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
