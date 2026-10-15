// ─────────────────────────────────────────────────
//  ApplicationForm.jsx — Add / Edit modal form
//
//  Props:
//    initial   — existing application object when editing, null when adding
//    onSave    — called with form data object when user submits
//    onClose   — called when user clicks Cancel or ✕
// ─────────────────────────────────────────────────
import { useState } from "react";
import "./ApplicationForm.css";

// Blank template used for a new application
const EMPTY = {
  company: "",
  role: "",
  jobLink: "",
  salaryExpectation: "",
  applicationDate: new Date().toISOString().slice(0, 10), // "YYYY-MM-DD"
  status: "Applied",
  interviewDates: "",   // stored as comma-separated string in the form
  notes: "",
};

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

export default function ApplicationForm({ initial, onSave, onClose }) {
  // If editing, populate form with existing data;
  // convert interviewDates array → comma-separated string for the input
  const [form, setForm] = useState(() => {
    if (!initial) return EMPTY;
    return {
      ...initial,
      interviewDates: (initial.interviewDates || []).join(", "),
    };
  });

  // Validation errors keyed by field name
  const [errors, setErrors] = useState({});

  // Loading flag prevents double-submit
  const [loading, setLoading] = useState(false);

  // ── Generic change handler for all inputs ──────
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  // ── Validate required fields before submit ─────
  function validate() {
    const newErrors = {};
    if (!form.company.trim()) newErrors.company = "Company name is required";
    if (!form.role.trim())    newErrors.role    = "Role is required";
    if (!form.status)         newErrors.status  = "Status is required";
    return newErrors;
  }

  // ── Submit handler ─────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();

    // Run validation; stop if there are errors
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    // Convert interviewDates from "date1, date2" string to an array
    const interviewDatesArray = form.interviewDates
      ? form.interviewDates.split(",").map((d) => d.trim()).filter(Boolean)
      : [];

    // Call onSave (defined in the parent Dashboard) with the cleaned data
    await onSave({ ...form, interviewDates: interviewDatesArray });
    setLoading(false);
  }

  return (
    // Clicking the dark overlay closes the modal
    <div className="modal-overlay" onClick={onClose}>
      {/* Stop clicks inside the modal from closing it */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal__header">
          <h3 className="modal__title">
            {initial ? "✏️ Edit Application" : "➕ New Application"}
          </h3>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        {/* Form body */}
        <form className="app-form" onSubmit={handleSubmit}>

          {/* Row 1: Company + Role */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company *</label>
              <input
                className="form-control"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. Google"
              />
              {errors.company && <span className="form-error">{errors.company}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Role *</label>
              <input
                className="form-control"
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="e.g. Software Engineer"
              />
              {errors.role && <span className="form-error">{errors.role}</span>}
            </div>
          </div>

          {/* Row 2: Status + Application Date */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status *</label>
              <select
                className="form-control"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              {errors.status && <span className="form-error">{errors.status}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Application Date</label>
              <input
                type="date"
                className="form-control"
                name="applicationDate"
                value={form.applicationDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 3: Job Link + Salary */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Job Link</label>
              <input
                className="form-control"
                name="jobLink"
                value={form.jobLink}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Salary Expectation</label>
              <input
                className="form-control"
                name="salaryExpectation"
                value={form.salaryExpectation}
                onChange={handleChange}
                placeholder="e.g. $80,000"
              />
            </div>
          </div>

          {/* Interview Dates */}
          <div className="form-group">
            <label className="form-label">Interview Dates (comma-separated)</label>
            <input
              className="form-control"
              name="interviewDates"
              value={form.interviewDates}
              onChange={handleChange}
              placeholder="e.g. 2026-11-01, 2026-11-10"
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-control"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any extra details..."
            />
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? "Saving…" : initial ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
