import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { API_URL } from "../config";
import "../index.css";

const Form = () => {
  const navigate = useNavigate();
  const [action, setAction] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const saveTokens = ({ accessToken, refreshToken }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const sendAuthRequest = async (path) => {
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (action === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        await sendAuthRequest("/signup");
        setSuccess("Account created. Sign in with your new account.");
        setAction("login");
        setPassword("");
        setConfirmPassword("");
        return;
      }

      const data = await sendAuthRequest("/login");
      saveTokens(data);
      setSuccess("Login successful!");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] p-4 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.05),transparent)] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass rounded-2xl overflow-hidden shadow-2xl border border-white/5">
          <div className="px-8 pt-10 pb-6 text-center">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5">
              <Lock className="w-6 h-6 text-slate-300" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              {action === "signup" ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              {action === "signup" ? "Join us today" : "Sign in to your account"}
            </p>
          </div>

          <div className="px-8 pb-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-3 bg-red-400/5 border border-red-400/10 rounded-xl overflow-hidden"
                >
                  <p className="text-red-400 text-[10px] font-bold text-center uppercase tracking-widest">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-3 bg-emerald-400/5 border border-emerald-400/10 rounded-xl overflow-hidden"
                >
                  <p className="text-emerald-400 text-[10px] font-bold text-center uppercase tracking-widest flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-3 h-3" /> {success}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-widest">
                  Username
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="yourusername"
                    required
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all text-sm text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-widest">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all text-sm text-white"
                  />
                </div>
              </div>

              {action === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-widest">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all text-sm text-white"
                    />
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-slate-200 rounded-xl py-3.5 font-bold transition-all mt-4 disabled:opacity-50 flex items-center justify-center gap-2 group text-sm uppercase tracking-widest"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{action === "signup" ? "Create Account" : "Sign In"}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 text-center flex flex-col gap-2">
            <div>
              <p className="text-slate-500 text-xs font-medium inline-block mr-2">
                {action === "signup" ? "Already a member?" : "First time around?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setAction(action === "signup" ? "login" : "signup");
                  setError("");
                  setSuccess("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-white font-bold text-xs hover:underline underline-offset-4 decoration-white/30 tracking-wide"
              >
                {action === "signup" ? "Sign In" : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Form;
