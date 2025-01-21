import React from "react";
// Import icons from the assets directory
import ShareIcon from "../assets/Rules_icon1.png";
import CoinsIcon from "../assets/Rules_icon2.png";
import RankIcon from "../assets/Rules_icon3.png";

const InviteSection = () => {
    return (
        <section className="bg-[#67358E] text-white py-12 px-6">
            <div className="max-w-5xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">
                    Ways to WIN Cash<strong>!</strong>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Daily Reward */}
                    <div className="bg-[#552C72] p-6 rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                        <div className="flex justify-center mb-4">
                            <img
                                src={ShareIcon}
                                alt="Daily Reward Icon"
                                className="w-12 h-12"
                            />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Daily Top Referrer
                        </h3>
                        <p className="text-justify">
                            Get{" "}
                            <span className="font-bold text-yellow-300">
                                $1
                            </span>{" "}
                            daily! Refer 20+ people and be the top contributor.
                        </p>
                    </div>

                    {/* Weekly Reward */}
                    <div className="bg-[#552C72] p-6 rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                        <div className="flex justify-center mb-4">
                            <img
                                src={CoinsIcon}
                                alt="Weekly Reward Icon"
                                className="w-12 h-12"
                            />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Weekly Top Referrer
                        </h3>
                        <p className="text-justify">
                            Win{" "}
                            <span className="font-bold text-yellow-300">
                                $5
                            </span>{" "}
                            weekly! Refer 100+ people and be the top
                            contributor.
                        </p>
                    </div>

                    {/* Qualifying Rules */}
                    <div className="bg-[#552C72] p-6 rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                        <div className="flex justify-center mb-4">
                            <img
                                src={RankIcon}
                                alt="Rules Icon"
                                className="w-12 h-12"
                            />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Rules to Qualify
                        </h3>
                        <p className="text-justify">
                            - <strong>Daily:</strong> Refer 20+ people, and the
                            top contributor wins{" "}
                            <span className="font-bold text-yellow-300">
                                $1
                            </span>
                            .<br />- <strong>Weekly:</strong> Refer 100+ people,
                            and the top contributor wins{" "}
                            <span className="font-bold text-yellow-300">
                                $5
                            </span>
                            .<br />- <strong>Payout:</strong> Ensure you sign up
                            with your legal name to receive rewards.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InviteSection;
