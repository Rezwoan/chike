import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupImage from "../assets/signup-person-image.png";

const LoginForm = () => {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // Validation and loading states
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Password visibility toggle state
    const [showPassword, setShowPassword] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "email") validateEmail(value);

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Validate email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setIsEmailValid(false);
            setEmailError("Please enter a valid email address.");
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
            const response = await fetch(
                "http://127.0.0.1:5000/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                }
            );

            const result = await response.json();

            if (response.ok) {
                setMessage("Login successful!");
                setFormData({
                    email: "",
                    password: "",
                });

                // Redirect to home/dashboard
                navigate("/profile");
            } else {
                setMessage(
                    result.error || "Invalid credentials. Please try again."
                );
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage(
                "An error occurred. Please check your network connection."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center p-5 max-w-5xl mx-auto shadow-lg rounded-lg bg-white my-8 font-montserrat">
            <div className="w-full md:flex-1 p-5">
                <h1 className="text-3xl md:text-4xl mb-4 text-center">
                    Login <span className="text-green-600">Now!</span>
                </h1>
                <p className="text-sm text-gray-600 mb-5 text-center md:text-left">
                    Welcome back! Enter your credentials to access your account.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mb-2 p-3 text-lg rounded border border-gray-300"
                        required
                    />
                    {emailError && (
                        <p className="text-sm text-red-500 mb-2">
                            {emailError}
                        </p>
                    )}
                    <div className="relative mb-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="p-3 text-lg rounded border border-gray-300 w-full"
                            required
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 cursor-pointer text-gray-500"
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </span>
                    </div>
                    <button
                        type="submit"
                        className={`p-3 text-lg rounded text-white ${
                            isLoading || !isEmailValid
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                        }`}
                        disabled={isLoading || !isEmailValid}
                    >
                        {isLoading ? "Loading..." : "Login"}
                    </button>
                </form>
                {message && (
                    <p
                        className={`mt-4 text-center text-lg ${
                            message.includes("successful")
                                ? "text-green-600"
                                : "text-red-500"
                        }`}
                    >
                        {message}
                    </p>
                )}
                {/* Reset Password and Signup Links */}
                <div className="flex flex-col items-center mt-4 space-y-2">
                    <p>
                        Forgot your password?{" "}
                        <span
                            onClick={() => navigate("/reset-password")}
                            className="text-green-600 font-bold cursor-pointer hover:underline"
                        >
                            Reset Password
                        </span>
                    </p>
                    <p>
                        Don’t have an account?{" "}
                        <span
                            onClick={() => navigate("/signup")}
                            className="text-green-600 font-bold cursor-pointer hover:underline"
                        >
                            Signup
                        </span>
                    </p>
                </div>
            </div>
            <div className="hidden md:flex w-full md:flex-1 justify-center items-center mt-5 md:mt-0">
                <img
                    src={signupImage}
                    alt="Login visual"
                    className="max-w-full h-auto rounded-lg"
                />
            </div>
        </div>
    );
};

export default LoginForm;
