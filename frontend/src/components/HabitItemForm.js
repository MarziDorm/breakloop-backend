import React, { useState, useEffect } from "react";

export default function HabitItemForm({ habit, onSubmit, onClose }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    triggerDescription: "",
    replacementAction: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (habit) {
      setForm({
        name: habit.name || "",
        description: habit.description || "",
        triggerDescription: habit.triggerDescription || "",
        replacementAction: habit.replacementAction || "",
      });
    }
  }, [habit]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit() {
    if (!form.name.trim()) { setError("Habit name is required."); return; }
    setLoading(true);
    setError(null);
    try {
      await onSubmit(habit ? { id: habit.id, ...form } : form);
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{habit ? "Edit Habit" : "New Habit"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="field">
          <label>Habit name *</label>
          <input value={form.name} onChange={set("name")} placeholder="e.g. Nail biting" maxLength={100} />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea value={form.description} onChange={set("description")} placeholder="Describe the habit and its impact..." rows={2} maxLength={500} style={{ resize: "vertical" }} />
        </div>
        <div className="field">
          <label>Trigger description</label>
          <textarea value={form.triggerDescription} onChange={set("triggerDescription")} placeholder="e.g. Stress at work, boredom in the evening" rows={2} maxLength={500} style={{ resize: "vertical" }} />
        </div>
        <div className="field">
          <label>Replacement action</label>
          <input value={form.replacementAction} onChange={set("replacementAction")} placeholder="e.g. Stretch for 2 minutes" maxLength={250} />
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
