import React from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero-image.png"; // Desktop image
import mobileImage from "../assets/mobile-image.png"; // Mobile image

const Hero = ({ leaderboardRef }) => {
    const navigate = useNavigate();

    // Handle scroll to leaderboard
    const scrollToLeaderboard = () => {
        if (leaderboardRef && leaderboardRef.current) {
            leaderboardRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            {/* Hero Section for Desktop and Tablet */}
            <section className="hidden sm:flex items-center justify-between px-10 md:px-20 lg:px-40 py-16 md:py-20 bg-gradient-to-b from-white to-gray-100">
                {/* Left Side Content */}
                <div className="max-w-md md:max-w-lg space-y-6 md:space-y-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                        Win Big with <br />
                        Our Live{" "}
                        <span className="text-green-600">Trivia Game!</span>
                    </h1>
                    <p className="text-gray-700 text-base md:text-lg lg:text-xl">
                        Join the waitlist and get exclusive access to our live
                        trivia challenge. Compete with friends, climb the
                        leaderboard, and earn cash and rewards for new sign-ups.
                    </p>
                    {/* Buttons */}
                    <div className="flex space-x-4 md:space-x-6">
                        <button
                            onClick={() => navigate("/signup")}
                            className="bg-[#67358E] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg hover:bg-[#542C71] transition duration-200"
                        >
                            Join Waitlist
                        </button>
                        <button
                            onClick={scrollToLeaderboard}
                            className="bg-white border-2 border-[#67358E] text-[#67358E] px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg hover:bg-[#67358E] hover:text-white transition duration-200"
                        >
                            Leaderboard
                        </button>
                    </div>
                </div>

                {/* Right Side Image */}
                <div className="pl-6 md:pl-10">
                    <img
                        src={heroImage}
                        alt="Hero Mockups"
                        className="w-full max-w-sm md:max-w-md lg:max-w-lg"
                    />
                </div>
            </section>

            {/* Mobile View */}
            <section className="sm:hidden flex flex-col items-center justify-center px-6 py-10 bg-gradient-to-b from-white to-gray-100">
                {/* Text Content */}
                <div className="text-center space-y-4 mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Win Big with our <br />
                        Live{" "}
                        <span className="text-green-600">Trivia Game!</span>
                    </h1>
                    <p className="text-gray-700 text-base">
                        Join the waitlist and get exclusive access to our live
                        trivia challenge. Compete with friends, climb the
                        leaderboard, and earn cash and rewards for new sign-ups.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col space-y-4 w-full max-w-sm">
                    <button
                        onClick={() => navigate("/signup")}
                        className="bg-green-600 text-white py-3 rounded-full font-semibold text-lg hover:bg-green-700 transition duration-200"
                    >
                        Join the Waitlist
                    </button>
                    <button
                        onClick={scrollToLeaderboard}
                        className="bg-white border-2 border-purple-600 text-purple-600 py-3 rounded-full font-semibold text-lg hover:bg-purple-600 hover:text-white transition duration-200"
                    >
                        Leaderboard
                    </button>
                </div>

                {/* Bottom Image */}
                <div className="mt-8">
                    <img
                        src={mobileImage}
                        alt="Mobile Mockups"
                        className="w-full max-w-xs"
                    />
                </div>
            </section>
        </>
    );
};

export default Hero;
