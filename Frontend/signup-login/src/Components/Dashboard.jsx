import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      let accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken) {
        navigate("/");
        return;
      }

      let response = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.status === 401 && refreshToken) {
        const refreshResponse = await fetch(`${API_URL}/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ refreshToken })
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          accessToken = data.accessToken;
          localStorage.setItem("accessToken", accessToken);

          response = await fetch(`${API_URL}/profile`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
        }
      }

      if (!response.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/");
        return;
      }

      const data = await response.json();
      setUser(data.user);
      setLoading(false);
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken })
      });
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] text-white">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto glass rounded-2xl p-8 border border-white/5 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 tracking-tight">Dashboard</h1>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-xl mb-2 font-medium">Welcome, {user.username}</h2>
          <p className="text-slate-400 text-sm font-mono bg-black/20 p-2 rounded inline-block mt-2">ID: {user.id}</p>
          <p className="text-slate-400 text-sm font-mono bg-black/20 p-2 rounded inline-block mt-2 ml-2">Role: {user.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl px-6 py-3 transition-colors font-bold uppercase tracking-widest text-xs flex items-center gap-2"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
