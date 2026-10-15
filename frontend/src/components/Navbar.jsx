// ─────────────────────────────────────────────────
//  Navbar.jsx — Top navigation bar
// ─────────────────────────────────────────────────
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Left: brand */}
      <div className="navbar__brand">
        <div className="navbar__logo">H</div>
        <div>
          <div className="navbar__name">
            Hire<span>Pro</span>
          </div>
          <div className="navbar__tagline">Job Application Tracker</div>
        </div>
      </div>
    </nav>
  );
}
