import React from "react";
import referralImage from "../assets/referral-image.png"; // Replace with the actual image path
import iconShare from "../assets/icon-share.png"; // Share icon
import iconEmail from "../assets/icon-email.png"; // Email icon
import iconSocial from "../assets/icon-social.png"; // Social media icon

const ReferralCodes = () => {
    return (
        <section className="px-8 md:px-24 lg:px-56 py-10 lg:py-16 lg:bg-[#67358E] bg-white">
            {/* Desktop View */}
            <div className="hidden lg:flex flex-col lg:flex-row items-center justify-between">
                {/* Left Side: Text Content */}
                <div className="text-white max-w-lg space-y-6 lg:mr-8">
                    <h2 className="text-4xl font-extrabold">
                        Get <span className="text-green-500">Exclusive</span>{" "}
                        <br />
                        Referral Codes
                    </h2>

                    {/* Cards */}
                    <div className="space-y-4">
                        <div className="bg-[#5C2C80] p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold">
                                Share with Friends
                            </h3>
                            <p className="text-sm mt-2">
                                Invite your friends to join the waitlist using
                                your unique referral code.
                            </p>
                        </div>
                        <div className="bg-[#5C2C80] p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold">
                                Email Contacts
                            </h3>
                            <p className="text-sm mt-2">
                                Reach out to your network and share your
                                exclusive referral code.
                            </p>
                        </div>
                        <div className="bg-[#5C2C80] p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold">
                                Post on Social Media
                            </h3>
                            <p className="text-sm mt-2">
                                Spread the word on your social channels and let
                                your followers know about the app.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Image */}
                <div className="mt-8 lg:mt-0">
                    <img
                        src={referralImage}
                        alt="Referral"
                        className="w-full max-w-sm lg:max-w-md rounded-lg shadow-lg"
                    />
                </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden">
                <h2 className="text-left text-3xl font-extrabold text-black mb-8">
                    Get Exclusive Referral Codes
                </h2>

                {/* Cards */}
                <div className="space-y-10">
                    {/* Card 1 */}
                    <div className="flex flex-col items-start">
                        <img
                            src={iconShare}
                            alt="Share with Friends"
                            className="w-12 h-12 mb-4"
                        />
                        <div>
                            <h3 className="text-lg font-bold">
                                Share with Friends
                            </h3>
                            <p className="text-gray-700 mt-2">
                                Invite your friends to join the waitlist using
                                your unique referral code.
                            </p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="flex flex-col items-start">
                        <img
                            src={iconEmail}
                            alt="Email Contacts"
                            className="w-12 h-12 mb-4"
                        />
                        <div>
                            <h3 className="text-lg font-bold">
                                Email Contacts
                            </h3>
                            <p className="text-gray-700 mt-2">
                                Reach out to your network and share your
                                exclusive referral code.
                            </p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="flex flex-col items-start">
                        <img
                            src={iconSocial}
                            alt="Post on Social Media"
                            className="w-12 h-12 mb-4"
                        />
                        <div>
                            <h3 className="text-lg font-bold">
                                Post on Social Media
                            </h3>
                            <p className="text-gray-700 mt-2">
                                Spread the word on your social channels and let
                                your followers know about the app.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReferralCodes;
