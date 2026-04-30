import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User as UserIcon,
  Settings,
  LogOut,
  Bell,
  Search,
  Activity,
  CreditCard,
  Users,
  TrendingUp,
  ChevronRight
} from "lucide-react";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/protected", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
      });
  }, []);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full"
      />
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const stats = [
    { label: "Total Logins", value: "24", icon: Activity, trend: "+12%" },
    { label: "Session Time", value: "1.2h", icon: TrendingUp, trend: "+5%" },
    { label: "Accounts", value: "1", icon: Users, trend: "0%" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0b0f1a] text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/5 hidden md:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">ModernApp</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${activeTab === item.id
                  ? "bg-white/10 text-white border border-white/10"
                  : "hover:bg-white/5 text-slate-400 hover:text-slate-200"
                }`}
            >
              <item.icon className="w-4.5 h-4.5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-all mt-auto border border-transparent hover:border-red-400/10"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 glass sticky top-0 z-10 border-b border-white/5">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-lg border border-white/5 w-80">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-primary rounded-full border border-[#0b0f1a]"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-white">{user.username}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Standard User</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-8 max-w-6xl mx-auto min-h-[calc(100vh-64px)]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-1">Hello, {user.username}</h2>
              <p className="text-slate-500 text-sm">Dashboard overview and account activity.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="glass-card p-6 rounded-xl border border-white/5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                      <stat.icon className="w-5 h-5 text-slate-300" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                      }`}>
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-tight mb-1">{stat.label}</p>
                  <h3 className="text-xl font-bold text-white">{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Activity</h3>
                <button className="text-xs text-slate-400 hover:text-white transition-colors font-semibold">
                  View All
                </button>
              </div>

              <div className="">
                {[1, 2, 3].map((item, idx) => (
                  <div key={item} className={`flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer border-b border-white/5 last:border-0`}>
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">System login detected</p>
                        <p className="text-xs text-slate-500">macOS • Safari Browser</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-400">{2 + idx}h ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;