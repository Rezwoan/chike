import React from "react";
import iconReferral from "../assets/icon-referral.png"; // Icon for Referral System
import iconRanking from "../assets/icon-ranking.png"; // Icon for Leaderboard Ranking
import iconRewards from "../assets/icon-rewards.png"; // Icon for Rewards and Prizes

const LeaderboardSection = () => {
    return (
        <section className="px-8 md:px-20 lg:px-40 py-10">
            {/* Container with Rounded Border */}
            <div className="bg-white rounded-lg p-10 lg:shadow-[0_10px_15px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                    {/* Left Side: Title and Text */}
                    <div className="w-full lg:w-1/2 pr-8 text-center">
                        <h2 className="text-3xl lg:text-5xl font-bold leading-snug">
                            Climb the
                            <br className="hidden lg:block" />
                            <span className="text-green-500"> Leaderboard</span>
                        </h2>
                        <div className="mt-6"></div>
                    </div>

                    {/* Right Side for Desktop */}
                    <div className="hidden lg:block w-full lg:w-1/2 space-y-10">
                        {/* Card 1 */}
                        <div className="relative flex items-center">
                            <div className="absolute -left-16 flex items-center justify-center w-14 h-14 bg-[#67358E] rounded-2xl font-bold text-xl text-white">
                                1
                            </div>
                            <div className="flex-1 ml-6 bg-[#67358E] text-white p-6 rounded-lg shadow-md">
                                <img
                                    src={iconReferral}
                                    alt="Referral System"
                                    className="w-6 h-6 mb-2"
                                />
                                <h3 className="text-lg font-bold">
                                    Referral System
                                </h3>
                                <p className="text-sm mt-2">
                                    Earn coins for every new user who signs up
                                    using your referral code.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="relative flex items-center">
                            <div className="absolute -left-16 flex items-center justify-center w-14 h-14 bg-[#67358E] rounded-2xl font-bold text-xl text-white">
                                2
                            </div>
                            <div className="flex-1 ml-6 bg-[#67358E] text-white p-6 rounded-lg shadow-md">
                                <img
                                    src={iconRanking}
                                    alt="Leaderboard Ranking"
                                    className="w-6 h-6 mb-2"
                                />
                                <h3 className="text-lg font-bold">
                                    Leaderboard Ranking
                                </h3>
                                <p className="text-sm mt-2">
                                    Check your position on the leaderboard and
                                    see how you measure up against other users.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="relative flex items-center">
                            <div className="absolute -left-16 flex items-center justify-center w-14 h-14 bg-[#67358E] rounded-2xl font-bold text-xl text-white">
                                3
                            </div>
                            <div className="flex-1 ml-6 bg-[#67358E] text-white p-6 rounded-lg shadow-md">
                                <img
                                    src={iconRewards}
                                    alt="Rewards and Prizes"
                                    className="w-6 h-6 mb-2"
                                />
                                <h3 className="text-lg font-bold">
                                    Rewards and Prizes
                                </h3>
                                <p className="text-sm mt-2">
                                    The top referrers will receive exclusive
                                    rewards and the chance to win exciting
                                    prizes.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side for Mobile */}
                    <div className="lg:hidden w-full space-y-10">
                        {/* Card 1 */}
                        <div className="flex items-start">
                            <div className="w-12 bg-[#67358E] aspect-square flex items-center justify-center text-white font-bold text-lg mr-4">
                                1
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">
                                    Referral System
                                </h3>
                                <p className="text-sm mt-2 text-gray-700">
                                    Earn coins for every new user who signs up
                                    using your referral code.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="flex items-start">
                            <div className="w-12 bg-[#67358E] aspect-square flex items-center justify-center text-white font-bold text-lg mr-4">
                                2
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">
                                    Leaderboard Ranking
                                </h3>
                                <p className="text-sm mt-2 text-gray-700">
                                    Check your position on the leaderboard and
                                    see how you measure up against other users.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="flex items-start">
                            <div className="w-12 bg-[#67358E] aspect-square flex items-center justify-center text-white font-bold text-lg mr-4">
                                3
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">
                                    Rewards and Prizes
                                </h3>
                                <p className="text-sm mt-2 text-gray-700">
                                    The top referrers will receive exclusive
                                    rewards and the chance to win exciting
                                    prizes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LeaderboardSection;
