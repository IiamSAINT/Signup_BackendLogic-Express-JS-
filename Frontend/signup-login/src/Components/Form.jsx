import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, ArrowRight, KeyRound, Mail, CheckCircle2 } from "lucide-react";
import { supabase } from "../supabaseClient";
import "../index.css";

const Form = () => {
  const navigate = useNavigate();
  // actions: "login" (password), "signup" (password), "login_otp" (passwordless)
  const [action, setAction] = useState("login");
  const [step, setStep] = useState("form"); // "form" or "verify_otp"
  const [otpType, setOtpType] = useState(""); // "signup" or "magiclink"
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (action === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        setSuccess("OTP sent to your email!");
        setOtpType("signup");
        setStep("verify_otp");
      } 
      else if (action === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        setSuccess("Login successful!");
        setTimeout(() => navigate("/dashboard"), 1000);
      }
      else if (action === "login_otp") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
        });
        
        if (error) throw error;
        
        setSuccess("OTP sent to your email!");
        setOtpType("magiclink");
        setStep("verify_otp");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: otpType,
      });

      if (error) throw error;

      setSuccess("Verification successful!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setError(err.message || "Invalid OTP code");
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
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5">
              {step === "verify_otp" ? (
                <KeyRound className="w-6 h-6 text-indigo-400" />
              ) : (
                <Lock className="w-6 h-6 text-slate-300" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              {step === "verify_otp" 
                ? "Enter Verification Code" 
                : action === "signup" 
                  ? "Create Account" 
                  : action === "login" 
                    ? "Welcome Back" 
                    : "Passwordless Login"}
            </h1>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              {step === "verify_otp" 
                ? "We sent a code to your email" 
                : action === "signup" 
                  ? "Join us today" 
                  : "Sign in to your account"}
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

            {step === "form" ? (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-widest">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all text-sm text-white"
                    />
                  </div>
                </div>

                {action !== "login_otp" && (
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
                )}

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
                      <span>
                        {action === "signup" ? "Create Account" : action === "login" ? "Sign In" : "Send OTP"}
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-widest">
                    6-Digit Code
                  </label>
                  <div className="relative group">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all text-sm text-white tracking-widest"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-3.5 font-bold transition-all mt-4 disabled:opacity-50 flex items-center justify-center gap-2 group text-sm uppercase tracking-widest"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("form");
                    setOtp("");
                    setSuccess("");
                    setError("");
                  }}
                  className="w-full text-slate-500 hover:text-white text-xs font-semibold transition-colors mt-4 uppercase tracking-widest"
                >
                  Back to {action === "signup" ? "Sign Up" : "Login"}
                </button>
              </form>
            )}

            {step === "form" && (
              <div className="mt-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[#0b0f1a] px-4 text-slate-600 uppercase tracking-[0.2em] font-bold text-[9px]">Alternative Access</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {action === "login" && (
                    <button 
                      onClick={() => { setAction("login_otp"); setError(""); setSuccess(""); }}
                      className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-xl py-2.5 transition-all text-slate-400 hover:text-white text-xs uppercase tracking-widest font-bold"
                    >
                      <Mail className="w-4 h-4" /> Login with Email OTP
                    </button>
                  )}
                  {action === "login_otp" && (
                    <button 
                      onClick={() => { setAction("login"); setError(""); setSuccess(""); }}
                      className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-xl py-2.5 transition-all text-slate-400 hover:text-white text-xs uppercase tracking-widest font-bold"
                    >
                      <Lock className="w-4 h-4" /> Login with Password
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {step === "form" && (
            <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 text-center flex flex-col gap-2">
              <div>
                <p className="text-slate-500 text-xs font-medium inline-block mr-2">
                  {action === "signup"
                    ? "Already a member?"
                    : "First time around?"}
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
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Form;