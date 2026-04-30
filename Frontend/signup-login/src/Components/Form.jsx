import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, ArrowRight, Globe, Command } from "lucide-react";
import "../index.css";

const Form = () => {
  const navigate = useNavigate();
  const [action, setAction] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (action === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const endpoint = action === "login" ? "/login" : "/signup";
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        if (data.token) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        } else if (action === "signup") {
          // If signup was successful but no token, switch to login
          setTimeout(() => {
            setAction("login");
            setSuccess("Account created! Please sign in.");
          }, 1500);
        }
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      setError("Failed to connect to the backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] p-4 font-sans relative overflow-hidden">
      {/* Background subtle depth instead of gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.05),transparent)] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass rounded-2xl overflow-hidden shadow-2xl border border-white/5">
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5">
              <Lock className="w-6 h-6 text-slate-300" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              {action === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              {action === "login"
                ? "Sign in to your account"
                : "Join us today"}
            </p>
          </div>

          {/* Form Content */}
          <div className="px-8 pb-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-3 bg-red-400/5 border border-red-400/10 rounded-xl"
                >
                  <p className="text-red-400 text-[10px] font-bold text-center uppercase tracking-widest">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-3 bg-emerald-400/5 border border-emerald-400/10 rounded-xl"
                >
                  <p className="text-emerald-400 text-[10px] font-bold text-center uppercase tracking-widest">✓ {success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="johndoe"
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
                    placeholder="••••••••"
                    required
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all text-sm text-white"
                  />
                </div>
              </div>

              {action === "signup" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-1.5"
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
                      placeholder="••••••••"
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
                    <span>{action === "login" ? "Sign In" : "Create Account"}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#0b0f1a] px-4 text-slate-600 uppercase tracking-[0.2em] font-bold text-[9px]">Alternative Access</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-xl py-2.5 transition-all text-slate-400 hover:text-white">
                  <Command className="w-4 h-4" />
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-xl py-2.5 transition-all text-slate-400 hover:text-white">
                  <Globe className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Toggle */}
          <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 text-center">
            <p className="text-slate-500 text-xs font-medium inline-block mr-2">
              {action === "login"
                ? "First time around?"
                : "Already a member?"}
            </p>
            <button
              type="button"
              onClick={() => {
                setAction(action === "login" ? "signup" : "login");
                setError("");
                setSuccess("");
                setUsername("");
                setPassword("");
              }}
              className="text-white font-bold text-xs hover:underline underline-offset-4 decoration-white/30 tracking-wide"
            >
              {action === "login" ? "Create Account" : "Sign In"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Form;