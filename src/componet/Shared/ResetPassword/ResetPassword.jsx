import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosPublic from "../../../utils/axiosPublic";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      const res = await axiosPublic.post("/api/reset-password", { token, newPassword });
      toast.success(res.data.message || "Password reset successful");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired token");
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
          Reset Password
        </h2>
        <p className="text-center text-gray-500 mb-4">
          Enter your new password below
        </p>

        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
          required
          className="input input-bordered w-full"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          required
          className="input input-bordered w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn text-white bg-[#0fb894] outline-none border-none w-full"
        >
          {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
