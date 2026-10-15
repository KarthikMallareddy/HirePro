// ─────────────────────────────────────────────────
//  App.jsx — Root Application Shell with Auth
//  Renders AuthView if not logged in, or the
//  modular Dashboard + Sidebar workspace when logged in.
// ─────────────────────────────────────────────────

import { useState, useEffect } from "react";
import Sidebar   from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AuthView  from "./pages/AuthView";
import { getCurrentUser } from "./api";
import "./index.css";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser]   = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [stats, setStats] = useState({
    total: 0,
    Applied: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0
  });

  // Verify token validity on load
  useEffect(() => {
    if (token) {
      getCurrentUser()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(() => {
          // Token expired or invalid
          handleLogout();
        });
    }
  }, [token]);

  // Auth callback from login / signup
  function handleAuthSuccess(authenticatedUser) {
    setUser(authenticatedUser);
    setToken(localStorage.getItem("token"));
  }

  // Logout handler
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  // If unauthenticated, show sharp Auth screen
  if (!token) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  // Authenticated workspace
  return (
    <div className="shell">
      <Sidebar
        stats={stats}
        user={user}
        onLogout={handleLogout}
      />
      <main className="shell__main">
        <Dashboard onStatsUpdate={setStats} />
      </main>
    </div>
  );
}
