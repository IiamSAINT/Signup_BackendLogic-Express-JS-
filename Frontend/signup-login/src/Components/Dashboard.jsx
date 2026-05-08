import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };
    
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] text-white">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto glass rounded-2xl p-8 border border-white/5 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 tracking-tight">Dashboard</h1>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-xl mb-2 font-medium">Welcome, {user.email}</h2>
          <p className="text-slate-400 text-sm font-mono bg-black/20 p-2 rounded inline-block mt-2">ID: {user.id}</p>
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