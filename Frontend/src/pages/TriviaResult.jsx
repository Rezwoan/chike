import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TriviaResult = ({ userAnswers }) => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userAnswers) {
            navigate("/"); // Redirect to home if no answers
            return;
        }

        const checkResults = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:5000/trivia/check_results",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ answers: userAnswers }),
                    }
                );

                const data = await response.json();
                setResult(data);
                setLoading(false);
            } catch (error) {
                console.error("Error checking results:", error);
                setLoading(false);
            }
        };

        checkResults();
    }, [userAnswers, navigate]);

    if (loading)
        return (
            <div className="flex h-screen justify-center items-center text-xl">
                Loading results...
            </div>
        );

    const totalQuestions = 10;
    const correctAnswers = result.score;
    const wrongAnswers = totalQuestions - correctAnswers;
    const notAnswered = totalQuestions - Object.keys(userAnswers).length;
    const totalPoints = correctAnswers * 10;

    return (
        <div className="flex flex-col h-screen items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full text-center">
                <h2 className="text-3xl font-bold mb-6">Trivia Result</h2>

                {/* Result Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-200 p-6 rounded-lg shadow-md">
                        <p className="text-lg font-medium">Total Questions</p>
                        <p className="text-2xl font-bold">{totalQuestions}</p>
                    </div>
                    <div className="bg-gray-200 p-6 rounded-lg shadow-md">
                        <p className="text-lg font-medium">Answered</p>
                        <p className="text-2xl font-bold">
                            {totalQuestions - notAnswered}
                        </p>
                    </div>
                    <div className="bg-gray-200 p-6 rounded-lg shadow-md">
                        <p className="text-lg font-medium">Not Answered</p>
                        <p className="text-2xl font-bold">{notAnswered}</p>
                    </div>
                    <div className="bg-gray-200 p-6 rounded-lg shadow-md">
                        <p className="text-lg font-medium">Wrong Answers</p>
                        <p className="text-2xl font-bold text-red-600">
                            {wrongAnswers}
                        </p>
                    </div>
                </div>

                {/* Bigger Correct Answers Box */}
                <div className="mt-4 p-6 bg-green-100 rounded-lg shadow-md">
                    <p className="text-lg font-medium text-green-700">
                        Correct Answers
                    </p>
                    <p className="text-4xl font-bold text-green-700">
                        {correctAnswers}
                    </p>
                </div>

                {/* Profile Button */}
                <button
                    className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg text-lg font-semibold"
                    onClick={() => navigate("/profile")}
                >
                    Go to Profile
                </button>
            </div>
        </div>
    );
};

export default TriviaResult;
