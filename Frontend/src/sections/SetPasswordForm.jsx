import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import signupImage from "../assets/signup-person-image.png";

const SetPasswordForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract pass_token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const pass_token = queryParams.get("token");

    // State variables
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Toggle password visibility
    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
    const toggleConfirmPasswordVisibility = () =>
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

    // Handle password input change
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        validatePassword(value);
    };

    // Handle confirm password input change
    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (value !== password) {
            setPasswordError("Passwords do not match.");
            setIsPasswordValid(false);
        } else {
            setPasswordError("");
            setIsPasswordValid(true);
        }
    };

    // Validate password (minimum 8 characters)
    const validatePassword = (password) => {
        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters long.");
            setIsPasswordValid(false);
        } else {
            setPasswordError("");
            setIsPasswordValid(confirmPassword === password);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsLoading(true);

        if (!pass_token) {
            setMessage("Invalid or missing token.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/auth/set-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pass_token, new_password: password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Success:", data);
                setMessage("Password successfully set. Redirecting to login...");
                setTimeout(() => navigate("/login"), 3000);
            } else {
                const errorText = await response.text();
                console.error("Failed:", errorText);
                setMessage("Failed to set password. Please try again.");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            setMessage("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center p-5 max-w-5xl mx-auto shadow-lg rounded-lg bg-white my-8 font-montserrat">
            <div className="w-full md:flex-1 p-5">
                <h1 className="text-3xl md:text-4xl mb-4 text-center">
                    Set <span className="text-green-600">Password</span>
                </h1>
                <p className="text-sm text-gray-600 mb-5 text-center md:text-left">
                    Create a strong password to secure your account.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="relative mb-4">
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            name="password"
                            placeholder="New Password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="w-full p-3 text-lg rounded border border-gray-300"
                            required
                        />
                        <span
                            className="absolute right-3 top-3 text-gray-600 cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >
                            {isPasswordVisible ? "Hide" : "View"}
                        </span>
                    </div>
                    <div className="relative mb-4">
                        <input
                            type={isConfirmPasswordVisible ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className="w-full p-3 text-lg rounded border border-gray-300"
                            required
                        />
                        <span
                            className="absolute right-3 top-3 text-gray-600 cursor-pointer"
                            onClick={toggleConfirmPasswordVisibility}
                        >
                            {isConfirmPasswordVisible ? "Hide" : "View"}
                        </span>
                    </div>
                    {passwordError && (
                        <p className="text-sm text-red-500 mb-2">{passwordError}</p>
                    )}
                    <button
                        type="submit"
                        className={`p-3 text-lg rounded text-white ${isLoading || !isPasswordValid
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                            }`}
                        disabled={isLoading || !isPasswordValid}
                    >
                        {isLoading ? "Submitting..." : "Set Password"}
                    </button>
                </form>
                {message && (
                    <p
                        className={`mt-4 text-center text-lg ${message.includes("successfully")
                            ? "text-green-600"
                            : "text-red-500"
                            }`}
                    >
                        {message}
                    </p>
                )}
                <p className="text-center mt-4">
                    Already set your password?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-green-600 font-bold cursor-pointer hover:underline"
                    >
                        Login
                    </span>
                </p>
            </div>
            <div className="hidden md:flex w-full md:flex-1 justify-center items-center mt-5 md:mt-0">
                <img
                    src={signupImage}
                    alt="Set Password visual"
                    className="max-w-full h-auto rounded-lg"
                />
            </div>
        </div>
    );
};

export default SetPasswordForm;
