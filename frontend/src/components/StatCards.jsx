// ─────────────────────────────────────────────────
//  StatCards.jsx — Bento Box Grid with Soft Gradients
// ─────────────────────────────────────────────────
import "./StatCards.css";

const METRICS = [
  { key: "total",     label: "Total Pipeline", cls: "stat-card-total"     },
  { key: "Applied",   label: "Applied",        cls: "stat-card-applied"   },
  { key: "Interview", label: "Interview",      cls: "stat-card-interview" },
  { key: "Offer",     label: "Offer",          cls: "stat-card-offer"     },
  { key: "Rejected",  label: "Rejected",       cls: "stat-card-rejected"  },
];

export default function StatCards({ stats }) {
  return (
    <div className="bento-grid">
      {METRICS.map(({ key, label, cls }) => (
        <div className={`stat-card ${cls}`} key={key}>
          <div className="stat-card__num">{stats[key] ?? 0}</div>
          <div className="stat-card__label">{label}</div>
        </div>
      ))}
    </div>
  );
}
