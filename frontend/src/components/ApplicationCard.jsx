// ─────────────────────────────────────────────────
//  ApplicationCard.jsx — Elevated Card Component
//  Includes Clearbit logo, Subway Stepper,
//  Color-coded border, "Days Ago" tag, and View Job link
// ─────────────────────────────────────────────────

import { useState } from "react";
import "./ApplicationCard.css";

// ── Helper 1: Calculate "Days Ago" ────────────────
function getDaysAgo(dateString) {
  if (!dateString) return null;
  const days = Math.floor((Date.now() - new Date(dateString)) / (1000 * 60 * 60 * 24));
  if (isNaN(days)) return null;
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

// ── Helper 2: Format Salary Consistently ──────────
function formatSalary(amount) {
  if (!amount) return "N/A";
  const num = Number(amount);
  if (!isNaN(num) && num > 0) {
    return "$" + num.toLocaleString();
  }
  return String(amount);
}

// ── Helper 3: Format Date (e.g. "Oct 15, 2026") ───
function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export default function ApplicationCard({ app, onStatusChange, onEdit, onDelete }) {
  const [logoFailed, setLogoFailed] = useState(false);

  // Clean company name to form Clearbit domain query
  const cleanDomain = app.company.toLowerCase().replace(/[^a-z0-9]/g, "");
  const logoUrl = `https://logo.clearbit.com/${cleanDomain}.com`;

  // Initials fallback for logo
  const initials = app.company
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "CO";

  // Dynamic status class for color-coded left border (e.g. "border-applied")
  const statusClass = `border-${app.status.toLowerCase()}`;

  const daysAgo = getDaysAgo(app.applicationDate);

  return (
    <div className={`job-card ${statusClass}`}>
      {/* ── Top Row: Logo, Company/Role, Actions ──── */}
      <div className="card-top-row">
        <div className="company-header">
          <div className="company-logo-wrapper">
            {!logoFailed ? (
              <img
                src={logoUrl}
                alt={`${app.company} logo`}
                className="company-logo"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <div className="company-logo-fallback">{initials}</div>
            )}
          </div>

          <div className="company-info">
            <h4 className="company-title">{app.company}</h4>
            <p className="company-role">{app.role}</p>
          </div>
        </div>

        {/* Top Right: Status Badge & Actions */}
        <div className="card-top-actions">
          <span className={`status-pill status-pill--${app.status.toLowerCase()}`}>
            {app.status}
          </span>
          <button
            type="button"
            className="btn-icon"
            title="Edit Application"
            onClick={() => onEdit(app)}
          >
            ✎
          </button>
          <button
            type="button"
            className="btn-icon btn-icon--danger"
            title="Delete Application"
            onClick={() => onDelete(app._id)}
          >
            ×
          </button>
        </div>
      </div>

      {/* ── Middle Row: Chips (Days Ago, Salary, View Job) ── */}
      <div className="meta-row">
        {/* Dynamic "Days Ago" tag */}
        {daysAgo && (
          <span className="badge time-badge" title={`Applied on ${formatDate(app.applicationDate)}`}>
            ⏳ {daysAgo}
          </span>
        )}

        {/* Consistently formatted salary */}
        <span className="badge salary-badge">
          💰 {formatSalary(app.salaryExpectation)}
        </span>

        {/* Wire "View Job" Link (conditionally hidden if missing) */}
        {app.jobLink && app.jobLink.trim() && (
          <a
            href={app.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            className="view-job-btn"
          >
            View Job ↗
          </a>
        )}

        {/* Interview Dates Badge */}
        {app.interviewDates?.length > 0 && (
          <span className="badge time-badge">
            🗓️ Interview: {app.interviewDates.map(formatDate).join(", ")}
          </span>
        )}
      </div>

      {/* Notes / Highlights */}
      {app.notes && (
        <div className="notes-snippet" title={app.notes}>
          📝 {app.notes}
        </div>
      )}

      {/* ── Bottom Row: Subway Map Stepper ───────── */}
      <div className="card-bottom-row">
        <div className="status-stepper">
          <button
            type="button"
            className={`step ${app.status === "Applied" ? "step--active-applied" : ""}`}
            onClick={() => onStatusChange(app._id, "Applied")}
            title="Set stage to Applied"
          >
            Applied
          </button>

          <div className="step-line" />

          <button
            type="button"
            className={`step ${app.status === "Interview" ? "step--active-interview" : ""}`}
            onClick={() => onStatusChange(app._id, "Interview")}
            title="Set stage to Interview"
          >
            Interview
          </button>

          <div className="step-line" />

          <button
            type="button"
            className={`step ${app.status === "Offer" ? "step--active-offer" : ""}`}
            onClick={() => onStatusChange(app._id, "Offer")}
            title="Set stage to Offer"
          >
            Offer
          </button>

          <div className="step-line" />

          <button
            type="button"
            className={`step ${app.status === "Rejected" ? "step--active-rejected" : ""}`}
            onClick={() => onStatusChange(app._id, "Rejected")}
            title="Set stage to Rejected"
          >
            Rejected
          </button>
        </div>
      </div>
    </div>
  );
}
