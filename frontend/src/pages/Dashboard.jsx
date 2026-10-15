// ─────────────────────────────────────────────────
//  Dashboard.jsx — Main Application View
//  Renders sticky topbar, Bento stat cards,
//  toolbar filters, and job card stream with empty-state
// ─────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import {
  getApplications,
  getStats,
  createApplication,
  updateStatus,
  updateApplication,
  deleteApplication,
} from "../api";
import StatCards       from "../components/StatCards";
import ApplicationCard from "../components/ApplicationCard";
import ApplicationForm from "../components/ApplicationForm";
import "./Dashboard.css";

// Status chips shown in the toolbar
const CHIPS = ["All", "Applied", "Interview", "Offer", "Rejected"];

export default function Dashboard({ onStatsUpdate }) {
  const [applications, setApplications] = useState([]);
  const [stats,        setStats]        = useState({ total: 0, Applied: 0, Interview: 0, Offer: 0, Rejected: 0 });
  const [activeStatus, setActiveStatus] = useState("All");
  const [sort,         setSort]         = useState("");
  const [search,       setSearch]       = useState("");
  const [showForm,     setShowForm]     = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState("");

  // Auto-dismiss success notification
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(t);
  }, [success]);

  // Fetch applications and aggregate stats from backend
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (activeStatus !== "All") params.status = activeStatus;
      if (sort) params.sort = sort;

      const [appsRes, statsRes] = await Promise.all([
        getApplications(params),
        getStats(),
      ]);
      setApplications(appsRes.data);
      setStats(statsRes.data);
      if (onStatsUpdate) onStatsUpdate(statsRes.data);
    } catch {
      setError("Cannot reach the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, [activeStatus, sort, onStatsUpdate]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Client-side search across company and role
  const displayed = applications.filter((app) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      app.company.toLowerCase().includes(q) ||
      app.role.toLowerCase().includes(q)
    );
  });

  // ── Event Handlers ──────────────────────────────

  async function handleSave(formData) {
    try {
      if (editTarget) {
        await updateApplication(editTarget._id, formData);
        setSuccess("Application updated.");
      } else {
        await createApplication(formData);
        setSuccess("Application added.");
      }
      setShowForm(false);
      fetchAll();
    } catch {
      setError("Save failed. Please try again.");
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      await updateStatus(id, newStatus);
      setSuccess(`Status changed to ${newStatus}.`);
      fetchAll();
    } catch {
      setError("Status update failed.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this application? This cannot be undone.")) return;
    try {
      await deleteApplication(id);
      setSuccess("Application deleted.");
      fetchAll();
    } catch {
      setError("Delete failed.");
    }
  }

  // ── Render ───────────────────────────────────────
  return (
    <>
      {/* Sticky top bar */}
      <div className="topbar">
        <div className="topbar__left">
          <div className="topbar__title">Placement Dashboard</div>
          <div className="topbar__sub">{stats.total} total opportunities tracked</div>
        </div>
        <button
          className="btn--add"
          onClick={() => {
            setEditTarget(null);
            setShowForm(true);
          }}
        >
          + Add Application
        </button>
      </div>

      {/* Page body */}
      <div className="dashboard">
        {/* Feedback banners */}
        {error && <div className="alert alert--error">{error}</div>}
        {success && <div className="alert alert--success">{success}</div>}

        {/* Loading bar */}
        {loading && <div className="loading-bar" />}

        {/* Bento Box Stats Strip with Soft Gradients */}
        <StatCards stats={stats} />

        {/* Filter Toolbar */}
        <div className="toolbar">
          {/* Status chip filter */}
          <div className="chip-group">
            {CHIPS.map((s) => {
              const isActive = activeStatus === s;
              const activeClass = isActive
                ? s === "All"
                  ? "chip--active-all"
                  : `chip--active-${s}`
                : "";

              return (
                <button
                  key={s}
                  type="button"
                  className={`chip ${activeClass}`}
                  onClick={() => setActiveStatus(s)}
                >
                  {s}
                </button>
              );
            })}
          </div>

          <div className="toolbar__divider" />

          {/* Search bar */}
          <input
            className="toolbar__search"
            type="text"
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="toolbar__divider" />

          {/* Sort dropdown */}
          <select
            className="toolbar__sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort: Newest first</option>
            <option value="company">Sort: Company A-Z</option>
          </select>
        </div>

        {/* Result count */}
        {!loading && (
          <div className="result-label">
            {displayed.length} application{displayed.length !== 1 ? "s" : ""}
            {activeStatus !== "All" ? ` in ${activeStatus}` : ""}
            {search ? ` matching "${search}"` : ""}
          </div>
        )}

        {/* Applications list */}
        {!loading && displayed.length > 0 && (
          <div className="apps-list">
            {displayed.map((app) => (
              <ApplicationCard
                key={app._id}
                app={app}
                onStatusChange={handleStatusChange}
                onEdit={(a) => {
                  setEditTarget(a);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* 6. Empty State Handling */}
        {!loading && displayed.length === 0 && (
          <div className="empty-state">
            <p>No job applications found matching your search.</p>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {showForm && (
        <ApplicationForm
          initial={editTarget}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}
