import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        if (data.token) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.user);
          // Redirect to dashboard after 1 second
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
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

  const callProtectedRoute = async () => {
    if (!token) {
      setError("Please login first to access protected route");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/protected", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
      } else {
        setError(data.message || "Failed to access protected route");
      }
    } catch (err) {
      setError("Failed to connect to the backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <h1 className="text-4xl font-bold text-white text-center mb-2">
              {action === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-blue-100 text-center text-sm">
              {action === "login"
                ? "Sign in to your account"
                : "Join us today"}
            </p>
          </div>

          {/* Form Content */}
          <div className="px-6 py-8">
            {/* Alert Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium"> {error}</p>
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm font-medium">✓ {success}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Confirm Password Input (for signup) */}
              {action === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 mt-6 ${
                  action === "login"
                    ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                    : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
                } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Loading...
                  </>
                ) : action === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>

          {/* Toggle Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm mb-4">
              {action === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
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
              className="w-full py-2 px-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition duration-200"
            >
              {action === "login" ? "Sign Up Instead" : "Sign In Instead"}
            </button>
          </div>
        </div>

       

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2026 Your App. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Form;