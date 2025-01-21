import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupImage from "../assets/signup-person-image.png";

const ResetPasswordForm = () => {
    const navigate = useNavigate();

    // Form state
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Handle email input change
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        validateEmail(value);
    };

    // Validate email for a minimum of 8 characters
    const validateEmail = (email) => {
        if (email.length < 8) {
            setIsEmailValid(false);
            setEmailError("Email must be at least 8 characters long.");
        } else {
            setIsEmailValid(true);
            setEmailError("");
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsLoading(true);

        try {
            // Make a request to the backend
            const response = await fetch(
                "https://backend-python.playchike.com/auth/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            if (response.ok) {
                // Show a success message regardless of whether the email exists
                setMessage(
                    "If this email is attached to an account, you will receive a password reset email shortly."
                );
            } else {
                // Generic message for security reasons
                setMessage(
                    "If this email is attached to an account, you will receive a password reset email shortly."
                );
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center p-5 max-w-5xl mx-auto shadow-lg rounded-lg bg-white my-8 font-montserrat">
            <div className="w-full md:flex-1 p-5">
                <h1 className="text-3xl md:text-4xl mb-4 text-center">
                    Reset <span className="text-green-600">Password</span>
                </h1>
                <p className="text-sm text-gray-600 mb-5 text-center md:text-left">
                    Enter your email address, and we'll send you instructions to
                    reset your password.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                        className="mb-2 p-3 text-lg rounded border border-gray-300"
                        required
                    />
                    {emailError && (
                        <p className="text-sm text-red-500 mb-2">
                            {emailError}
                        </p>
                    )}
                    <button
                        type="submit"
                        className={`p-3 text-lg rounded text-white ${
                            isLoading || !isEmailValid
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                        }`}
                        disabled={isLoading || !isEmailValid}
                    >
                        {isLoading ? "Sending..." : "Reset Password"}
                    </button>
                </form>
                {message && (
                    <p
                        className={`mt-4 text-center text-lg ${
                            message.includes("instructions")
                                ? "text-green-600"
                                : "text-red-500"
                        }`}
                    >
                        {message}
                    </p>
                )}
                {/* Link to Login Page */}
                <p className="text-center mt-4">
                    Remembered your password?{" "}
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
                    alt="Reset Password visual"
                    className="max-w-full h-auto rounded-lg"
                />
            </div>
        </div>
    );
};

export default ResetPasswordForm;
