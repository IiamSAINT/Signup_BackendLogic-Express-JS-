import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Get username from localStorage or redirect to login
    const storedUsername = localStorage.getItem("username");
    const storedToken = localStorage.getItem("token");

    if (!storedToken || !storedUsername) {
      navigate("/");
      return;
    }

    setUsername(storedUsername);
    setToken(storedToken);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const callProtectedRoute = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/protected", {
        method: "GET",
        headers: {
          "Authorization": token,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-lg mb-6">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="py-2 px-6 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, {username}! 👋
          </h2>
          <p className="text-gray-600 mb-6">
            You have successfully logged in. Here are your options:
          </p>

          {/* Alert Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">⚠️ {error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm font-medium">✓ {success}</p>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                👤 Profile
              </h3>
              <p className="text-blue-600 text-sm mb-4">
                View and manage your profile information
              </p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium">
                View Profile
              </button>
            </div>

            {/* Settings Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                ⚙️ Settings
              </h3>
              <p className="text-indigo-600 text-sm mb-4">
                Update your account settings and preferences
              </p>
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium">
                Go to Settings
              </button>
            </div>
          </div>
        </div>

        {/* Protected Route Access Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            🔒 Protected Route
          </h3>
          <p className="text-gray-600 mb-4">
            Test accessing a protected route on the backend that requires authentication:
          </p>
          <button
            onClick={callProtectedRoute}
            disabled={loading}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Loading...
              </>
            ) : (
              "Call Protected Route"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
