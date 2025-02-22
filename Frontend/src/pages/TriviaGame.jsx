import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TriviaGame = ({ userId, onFinish }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(10);
    const [loading, setLoading] = useState(true);
    const [showAd, setShowAd] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            console.error("User ID is required");
            return;
        }

        const fetchQuestions = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:5000/trivia/get_questions",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ user_id: userId }),
                    }
                );

                const data = await response.json();

                if (data.error) {
                    alert(data.error); // Show cooldown message
                    navigate("/profile");
                } else {
                    setQuestions(data.questions);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching trivia questions:", error);
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [userId, navigate]);

    // Initialize the Google Ad once showAd is set to true
    useEffect(() => {
        if (showAd) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("Google Ads error:", e);
            }
        }
    }, [showAd]);

    useEffect(() => {
        if (timeLeft === 0) {
            handleNextQuestion(null);
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleAnswerSelect = (answer) => {
        const questionId = questions[currentQuestionIndex].id;
        setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
        handleNextQuestion(answer);
    };

    const handleNextQuestion = (answer) => {
        const questionId = questions[currentQuestionIndex]?.id;
        if (questionId) {
            setUserAnswers((prev) => ({
                ...prev,
                [questionId]: answer || "No Answer",
            }));
        }

        setTimeLeft(10); // Reset timer

        if (currentQuestionIndex < questions.length - 1) {
            setTimeout(
                () => setCurrentQuestionIndex(currentQuestionIndex + 1),
                500
            );
        } else {
            setTimeout(() => {
                setShowAd(true);
            }, 500);
        }
    };

    const handleViewResults = async () => {
        try {
            onFinish(userAnswers);
            navigate("/trivia/results", { state: { userId, userAnswers } }); // Pass userId & answers
        } catch (error) {
            console.error("Error navigating to results:", error);
        }
    };

    if (loading)
        return (
            <div className="flex h-screen justify-center items-center text-xl">
                Loading...
            </div>
        );

    if (showAd) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-gray-100 p-6">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                    <h2 className="text-2xl font-bold mb-4">Sponsored Ad</h2>
                    {/* Google AdSense Ad */}
                    <ins
                        className="adsbygoogle"
                        style={{ display: "block" }}
                        data-ad-client="ca-pub-9201425175707137"
                        data-ad-slot="6686755904"
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                    ></ins>
                    <button
                        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold"
                        onClick={handleViewResults}
                    >
                        View Results
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progressPercentage = (timeLeft / 10) * 100;

    return (
        <div className="flex flex-col h-screen items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full text-center">
                {/* Circular Timer */}
                <div className="relative w-20 h-20 mx-auto mb-4">
                    <svg
                        className="absolute top-0 left-0"
                        width="80"
                        height="80"
                    >
                        <circle
                            cx="40"
                            cy="40"
                            r="35"
                            stroke="gray"
                            strokeWidth="5"
                            fill="none"
                        />
                        <circle
                            cx="40"
                            cy="40"
                            r="35"
                            stroke="green"
                            strokeWidth="5"
                            fill="none"
                            strokeDasharray="220"
                            strokeDashoffset={
                                220 - (220 * progressPercentage) / 100
                            }
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                        {timeLeft}
                    </div>
                </div>

                {/* Question Number */}
                <div className="text-2xl font-bold text-gray-700 mb-2">
                    Question {currentQuestionIndex + 1} / {questions.length}
                </div>

                {/* Question Text */}
                <h2 className="text-lg font-semibold mb-6">
                    {currentQuestion.question}
                </h2>

                {/* Answer Options */}
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className={`w-full py-3 rounded-lg text-lg font-medium border shadow-md 
                                ${
                                    userAnswers[currentQuestion.id] === option
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200"
                                }`}
                            onClick={() => handleAnswerSelect(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TriviaGame;
