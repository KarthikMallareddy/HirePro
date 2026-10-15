// ─────────────────────────────────────────────────
//  Sidebar.jsx — Fixed dark left navigation panel
//  Shows brand mark, live stats, and user profile
// ─────────────────────────────────────────────────
import "./Sidebar.css";

// Config for the five stat rows
const STAT_ROWS = [
  { key: "total",     label: "All Jobs",   dot: "dot--total"     },
  { key: "Applied",   label: "Applied",    dot: "dot--applied"   },
  { key: "Interview", label: "Interview",  dot: "dot--interview" },
  { key: "Offer",     label: "Offer",      dot: "dot--offer"     },
  { key: "Rejected",  label: "Rejected",   dot: "dot--rejected"  },
];

export default function Sidebar({ stats, user, onLogout }) {
  // Compute initials (e.g., "Alex Doe" -> "AD")
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <aside className="sidebar">

      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <div className="sidebar__logo-mark">HP</div>
          <div>
            <div className="sidebar__logo-name">
              Hire<span>Pro</span>
            </div>
            <div className="sidebar__tagline">Placement Tracker</div>
          </div>
        </div>
      </div>

      {/* Live stats */}
      <div className="sidebar__section-label">Overview</div>
      <div className="sidebar__stats">
        {STAT_ROWS.map(({ key, label, dot }) => (
          <div className="sidebar__stat" key={key}>
            <span className="sidebar__stat-left">
              <span className={`sidebar__stat-dot ${dot}`} />
              {label}
            </span>
            <span className="sidebar__stat-count">{stats[key] ?? 0}</span>
          </div>
        ))}
      </div>

      {/* User Profile Section */}
      {user && (
        <div className="sidebar__user">
          <div className="sidebar__user-info">
            <div className="sidebar__avatar">{initials}</div>
            <div className="sidebar__user-details">
              <div className="sidebar__user-name" title={user.name}>
                {user.name}
              </div>
              <div className="sidebar__user-email" title={user.email}>
                {user.email}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="sidebar__logout-btn"
            onClick={onLogout}
            title="Sign out of HirePro"
          >
            ← Sign Out
          </button>
        </div>
      )}

      {/* Status Footer */}
      <div className="sidebar__footer">
        <span className="sidebar__footer-dot" />
        Authenticated Session
      </div>
    </aside>
  );
}
