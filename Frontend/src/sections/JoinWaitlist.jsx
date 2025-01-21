import React from "react";
import personImage from "../assets/person-image.png"; // Replace with the actual image path
import icon1 from "../assets/JoinWaitlist_icon1.png"; // First icon
import icon2 from "../assets/JoinWaitlist_icon2.png"; // Second icon
import icon3 from "../assets/JoinWaitlist_icon3.png"; // Third icon

const JoinWaitlist = () => {
    return (
        <section className="px-6 py-10 md:px-20 lg:px-40 bg-gradient-to-b from-gray-100 to-gray-300">
            {/* Desktop View */}
            <div className="hidden lg:flex bg-white rounded-lg shadow-md p-8 lg:p-12 items-center justify-between">
                {/* Left Side: Image */}
                <div className="mb-8 lg:mb-0 lg:mr-8">
                    <img
                        src={personImage}
                        alt="Join the Waitlist"
                        className="w-full max-w-sm lg:max-w-md"
                    />
                </div>

                {/* Right Side: Content */}
                <div className="space-y-6 lg:space-y-8 max-w-lg">
                    <h2 className="text-4xl font-extrabold text-gray-900">
                        Join the <br />
                        <span className="text-[#67358E]">Waitlist Today</span>
                    </h2>

                    {/* Cards */}
                    <div className="space-y-4">
                        <div className="flex items-start bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                                <img
                                    src={icon1}
                                    alt="Be the First to Know"
                                    className="w-6 h-6"
                                />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-bold text-gray-900">
                                    Be the First to Know
                                </h3>
                                <p className="text-gray-700">
                                    Get early access to our live trivia app and
                                    be the first to experience the excitement.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start bg-green-100 p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center justify-center w-10 h-10 bg-green-300 rounded-full">
                                <img
                                    src={icon2}
                                    alt="Exclusive Perks"
                                    className="w-6 h-6"
                                />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-bold text-gray-900">
                                    Exclusive Perks
                                </h3>
                                <p className="text-gray-700">
                                    Waitlist members will receive special
                                    offers, referral codes, and a chance to win
                                    cash and prizes.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                                <img
                                    src={icon3}
                                    alt="Signup Now"
                                    className="w-6 h-6"
                                />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-bold text-gray-900">
                                    Signup Now
                                </h3>
                                <p className="text-gray-700">
                                    Get and share your referral code to win cash
                                    and prizes as spots are limited.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Join Waitlist Today
                </h2>
                <div className="flex justify-center mt-2">
                    <div className="w-12 h-1 bg-gray-900 rounded"></div>
                </div>

                {/* Cards */}
                <div className="space-y-4 mt-6">
                    <div className="bg-[#67358E] p-4 rounded-lg">
                        <h3 className="text-white font-bold text-lg">
                            Be the First to Know
                        </h3>
                        <p className="text-white mt-2">
                            Get early access to our live trivia app and be the
                            first to experience the excitement.
                        </p>
                    </div>
                    <div className="bg-[#67358E] p-4 rounded-lg">
                        <h3 className="text-white font-bold text-lg">
                            Exclusive Perks
                        </h3>
                        <p className="text-white mt-2">
                            Waitlist members will receive special offers,
                            referral codes, and a chance to win cash prizes.
                        </p>
                    </div>
                    <div className="bg-[#67358E] p-4 rounded-lg">
                        <h3 className="text-white font-bold text-lg">
                            Signup Now
                        </h3>
                        <p className="text-white mt-2">
                            Get and share your referral code to win cash and
                            prizes as spots are limited.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JoinWaitlist;
