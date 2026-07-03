import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosPublic from "../../../utils/axiosPublic";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosPublic.post("/api/forgot-password", { email });
      toast.success(res.data.message || "Reset link sent to your email");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full p-6 shadow rounded-lg space-y-4 bg-base-100"
      >
        <h2 className="text-2xl font-bold text-center text-[#0fb894]">
          Forgot Password
        </h2>
        <p className="text-center text-gray-500 mb-4">
          Enter your email and we'll send you a reset link
        </p>

        <input
          type="email"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
          className="input input-bordered w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn text-white bg-[#0fb894] outline-none border-none w-full"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="text-center mt-4">
          <Link to="/login" className="text-[#0fb894] font-bold">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
