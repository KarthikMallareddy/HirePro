// ─────────────────────────────────────────────────
//  AuthView.jsx — Sign In / Create Account Component
//  Handles login, registration, and quick demo login
// ─────────────────────────────────────────────────

import { useState } from "react";
import { loginUser, registerUser } from "../api";
import "./AuthView.css";

export default function AuthView({ onAuthSuccess }) {
  const [isLogin, setIsLogin]   = useState(true);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Form submission handler ─────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!isLogin && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await loginUser({ email, password });
      } else {
        res = await registerUser({ name, email, password });
      }

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      onAuthSuccess(user);
    } catch (err) {
      const msg = err.response?.data?.message || "Authentication failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  // ── Quick one-click preset login ────────────────
  async function handlePresetLogin(targetEmail, targetPassword) {
    setError("");
    setLoading(true);
    try {
      const res = await loginUser({
        email: targetEmail,
        password: targetPassword
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      onAuthSuccess(user);
    } catch (err) {
      setError("Login failed. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-brand">
            <div className="auth-logo">HP</div>
            <div className="auth-title">
              Hire<span>Pro</span>
            </div>
          </div>
          <div className="auth-desc">
            {isLogin
              ? "Sign in to manage your placement pipeline"
              : "Create an account to start tracking applications"}
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${isLogin ? "auth-tab--active" : ""}`}
            onClick={() => { setIsLogin(true); setError(""); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${!isLogin ? "auth-tab--active" : ""}`}
            onClick={() => { setIsLogin(false); setError(""); }}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div className="auth-body">
          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="form-label">Password</label>
                <button
                  type="button"
                  style={{ background: "none", border: "none", color: "var(--indigo)", fontSize: "0.74rem", cursor: "pointer", fontWeight: 600 }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide password" : "Show password"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
              />
              {isLogin && (
                <div style={{ fontSize: "0.72rem", color: "#64748B", marginTop: "4px" }}>
                  💡 Password for Karthik is <strong style={{ color: "var(--indigo)" }}>karthik123</strong>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="auth-btn-submit"
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          {/* Quick Preset Accounts */}
          <div className="auth-divider">
            <span className="auth-divider__line" />
            <span className="auth-divider__text">OR INSTANT SIGN IN</span>
            <span className="auth-divider__line" />
          </div>

          <div className="auth-demo-group">
            <button
              type="button"
              className="auth-btn-account"
              onClick={() => handlePresetLogin("mrkarthik1811@gmail.com", "karthik123")}
              disabled={loading}
            >
              <span>👤 Login as <strong>Karthik</strong></span>
              <span className="badge-num">15 Drives</span>
            </button>

            <button
              type="button"
              className="auth-btn-account"
              onClick={() => handlePresetLogin("navadeep3108@gmail.com", "navadeep123")}
              disabled={loading}
            >
              <span>👤 Login as <strong>Navadeep</strong></span>
              <span className="badge-num">14 Drives</span>
            </button>

            <button
              type="button"
              className="auth-btn-account"
              onClick={() => handlePresetLogin("demo@hirepro.com", "password123")}
              disabled={loading}
            >
              <span>👤 Login as <strong>Demo User</strong></span>
              <span className="badge-num">24 Drives</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
