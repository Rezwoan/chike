import React from "react";
import phoneImage from "../assets/phone-image.png"; // Replace with the actual path to the phone image
import Navbar2 from "../components/Navbar2";


const WelcomeAboard = () => {
    return (
        <>
            <Navbar2/>
            <section className="px-8 md:px-20 lg:px-40 py-10 bg-gradient-to-b from-white to-gray-100">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                    {/* Left Side: Heading, Text, and Image */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Welcome <span className="text-green-500">Aboard!</span>
                        </h2>
                        <p className="text-gray-700 text-base md:text-lg mb-6">
                            Excited to have you join us. Now the{" "}
                            <span className="text-green-500 font-bold">FUN</span>{" "}
                            part begins. <br />
                            Follow these instructions for your chance to win{" "}
                            <span className="font-bold">BIG!</span>
                        </p>
                        <img
                            src={phoneImage}
                            alt="App Preview"
                            className="w-full max-w-sm h-auto aspect-auto mx-auto"
                        />
                    </div>

                    {/* Right Side: Instruction Cards */}
                    <div className="w-full lg:w-1/2 space-y-6 mt-8 lg:mt-0">
                        {/* Card 1 */}
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-black">
                            <h3 className="text-lg md:text-xl font-bold">
                                Your Referral Code
                            </h3>
                            <p className="text-gray-700 mt-2 text-sm md:text-base">
                                Check your email for your unique referral code!
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-black">
                            <h3 className="text-lg md:text-xl font-bold">
                                Share the Fun
                            </h3>
                            <p className="text-gray-700 mt-2 text-sm md:text-base">
                                Share your referral code with friends and family as
                                often as you can and earn rewards for every
                                referral!
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-black">
                            <h3 className="text-lg md:text-xl font-bold">
                                Follow Us
                            </h3>
                            <p className="text-gray-700 mt-2 text-sm md:text-base">
                                Like and subscribe to our social media profiles for
                                updates on new games and exciting prize giveaways!
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-black">
                            <h3 className="text-lg md:text-xl font-bold">
                                Check Daily
                            </h3>
                            <p className="text-gray-700 mt-2 text-sm md:text-base">
                                Don't forget to check your email and the leaderboard
                                daily for updates on your progress and ranking.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default WelcomeAboard;