import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar2 from "../components/Navbar2";

const WithdrawPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { availableBalance, userId } = location.state || {};

    // Redirect if required data is missing
    if (!availableBalance || !userId) {
        navigate("/");
    }

    // Local state for current balance to reflect deductions on successful withdrawal
    const [currentBalance, setCurrentBalance] = useState(availableBalance);
    const [amount, setAmount] = useState("");
    const [withdrawMethod, setWithdrawMethod] = useState("bank");

    // Bank details
    const [bankName, setBankName] = useState("");
    const [otherBank, setOtherBank] = useState("");
    const [accountName, setAccountName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");

    // Mobile details
    const [mobileNetwork, setMobileNetwork] = useState("");
    const [otherMobileNetwork, setOtherMobileNetwork] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const MIN_WITHDRAWAL_AMOUNT = 10.0; // Must match backend

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const withdrawAmount = parseFloat(amount);
        if (isNaN(withdrawAmount) || withdrawAmount < MIN_WITHDRAWAL_AMOUNT) {
            setError(
                `Withdrawal amount must be at least $${MIN_WITHDRAWAL_AMOUNT}.`
            );
            return;
        }
        if (withdrawAmount > currentBalance) {
            setError("Withdrawal amount exceeds your available balance.");
            return;
        }

        // Gather payment info based on selected method
        let paymentInfo = {};
        if (withdrawMethod === "bank") {
            // Use otherBank if "Other" is selected
            const finalBankName = bankName === "Other" ? otherBank : bankName;
            if (!finalBankName || !accountName || !accountNumber) {
                setError("Please fill in all bank details.");
                return;
            }
            paymentInfo = {
                bankName: finalBankName,
                accountName,
                accountNumber,
            };
        } else if (withdrawMethod === "mobile") {
            const finalMobileNetwork =
                mobileNetwork === "Other" ? otherMobileNetwork : mobileNetwork;
            if (!finalMobileNetwork || !mobileNumber) {
                setError("Please fill in all mobile details.");
                return;
            }
            paymentInfo = {
                mobileNetwork: finalMobileNetwork,
                mobileNumber,
            };
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/withdrawal/withdrawals",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: userId,
                        amount: withdrawAmount,
                        payment_info: paymentInfo,
                    }),
                }
            );
            const data = await response.json();
            if (!response.ok) {
                setError(data.message || "Withdrawal request failed.");
            } else {
                setSuccess("Withdrawal request submitted successfully!");
                // Deduct the withdrawn amount from the current balance
                setCurrentBalance((prev) => prev - withdrawAmount);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
            <Navbar2 />
            <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg font-montserrat">
                <h1 className="text-2xl font-bold text-center text-[#67358E] mb-4">
                    Withdrawal Request
                </h1>
                <p className="text-center text-green-600 mb-6">
                    Available Balance: ${currentBalance}
                </p>
                <form onSubmit={handleSubmit}>
                    {/* Amount Input */}
                    <div className="mb-4">
                        <label
                            htmlFor="amount"
                            className="block text-[#67358E] font-bold mb-2"
                        >
                            Amount ($)
                        </label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    {/* Withdrawal Method */}
                    <div className="mb-4">
                        <label className="block text-[#67358E] font-bold mb-2">
                            Withdrawal Method
                        </label>
                        <div className="flex gap-6">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="method"
                                    value="bank"
                                    checked={withdrawMethod === "bank"}
                                    onChange={() => setWithdrawMethod("bank")}
                                    className="form-radio"
                                />
                                <span className="ml-2">Bank</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="method"
                                    value="mobile"
                                    checked={withdrawMethod === "mobile"}
                                    onChange={() => setWithdrawMethod("mobile")}
                                    className="form-radio"
                                />
                                <span className="ml-2">Mobile Money</span>
                            </label>
                        </div>
                    </div>

                    {/* Bank Withdrawal Fields */}
                    {withdrawMethod === "bank" && (
                        <div className="mb-4">
                            <div className="mb-4">
                                <label
                                    htmlFor="bankName"
                                    className="block text-[#67358E] font-bold mb-2"
                                >
                                    Bank Name
                                </label>
                                <select
                                    id="bankName"
                                    value={bankName}
                                    onChange={(e) =>
                                        setBankName(e.target.value)
                                    }
                                    className="w-full p-2 border rounded-lg"
                                    required
                                >
                                    <option value="">Select Bank</option>
                                    <option value="GTBank">GTBank</option>
                                    <option value="Zenith Bank">
                                        Zenith Bank
                                    </option>
                                    <option value="Access Bank">
                                        Access Bank
                                    </option>
                                    <option value="UBA">UBA</option>
                                    <option value="First Bank">
                                        First Bank
                                    </option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {bankName === "Other" && (
                                <div className="mb-4">
                                    <label
                                        htmlFor="otherBank"
                                        className="block text-[#67358E] font-bold mb-2"
                                    >
                                        Enter Bank Name
                                    </label>
                                    <input
                                        type="text"
                                        id="otherBank"
                                        value={otherBank}
                                        onChange={(e) =>
                                            setOtherBank(e.target.value)
                                        }
                                        className="w-full p-2 border rounded-lg"
                                        required
                                    />
                                </div>
                            )}
                            <div className="mb-4">
                                <label
                                    htmlFor="accountName"
                                    className="block text-[#67358E] font-bold mb-2"
                                >
                                    Account Name
                                </label>
                                <input
                                    type="text"
                                    id="accountName"
                                    value={accountName}
                                    onChange={(e) =>
                                        setAccountName(e.target.value)
                                    }
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="accountNumber"
                                    className="block text-[#67358E] font-bold mb-2"
                                >
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    id="accountNumber"
                                    value={accountNumber}
                                    onChange={(e) =>
                                        setAccountNumber(e.target.value)
                                    }
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Mobile Withdrawal Fields */}
                    {withdrawMethod === "mobile" && (
                        <div className="mb-4">
                            <div className="mb-4">
                                <label
                                    htmlFor="mobileNetwork"
                                    className="block text-[#67358E] font-bold mb-2"
                                >
                                    Mobile Network
                                </label>
                                <select
                                    id="mobileNetwork"
                                    value={mobileNetwork}
                                    onChange={(e) =>
                                        setMobileNetwork(e.target.value)
                                    }
                                    className="w-full p-2 border rounded-lg"
                                    required
                                >
                                    <option value="">
                                        Select Mobile Network
                                    </option>
                                    <option value="MTN">MTN</option>
                                    <option value="Airtel">Airtel</option>
                                    <option value="Glo">Glo</option>
                                    <option value="9mobile">9mobile</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {mobileNetwork === "Other" && (
                                <div className="mb-4">
                                    <label
                                        htmlFor="otherMobileNetwork"
                                        className="block text-[#67358E] font-bold mb-2"
                                    >
                                        Enter Mobile Network
                                    </label>
                                    <input
                                        type="text"
                                        id="otherMobileNetwork"
                                        value={otherMobileNetwork}
                                        onChange={(e) =>
                                            setOtherMobileNetwork(
                                                e.target.value
                                            )
                                        }
                                        className="w-full p-2 border rounded-lg"
                                        required
                                    />
                                </div>
                            )}
                            <div className="mb-4">
                                <label
                                    htmlFor="mobileNumber"
                                    className="block text-[#67358E] font-bold mb-2"
                                >
                                    Mobile Number
                                </label>
                                <input
                                    type="text"
                                    id="mobileNumber"
                                    value={mobileNumber}
                                    onChange={(e) =>
                                        setMobileNumber(e.target.value)
                                    }
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 mt-6 text-lg font-bold rounded-full bg-[#67358E] text-white hover:bg-[#8B5FBF] transition-all"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Withdrawal"}
                    </button>
                    {error && (
                        <p className="text-center text-red-500 mt-4">{error}</p>
                    )}
                    {success && (
                        <p className="text-center text-green-600 mt-4">
                            {success}
                        </p>
                    )}
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    You’ll receive the payment within 3–5 working days after
                    submitting.
                </p>
            </div>
        </div>
    );
};

export default WithdrawPage;
