import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { habitApi } from "../api";
import HabitItemForm from "../components/HabitItemForm";
import HabitItemDeleteDialog from "../components/HabitItemDeleteDialog";

const STATUS_COLORS = { Active: "badge-active", Paused: "badge-paused", Resolved: "badge-resolved" };
const STATUS_MESSAGE = {
  Paused: "This habit is paused. Resume it to log urges.",
  Resolved: "This habit is resolved. You broke it! 🎉",
};

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [deleteHabit, setDeleteHabit] = useState(null);
  const [filter, setFilter] = useState("Active");
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await habitApi.list();
      setHabits(data.habitList);
    } catch {
      setError("Could not load habits. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(body) { await habitApi.create(body); await load(); }
  async function handleUpdate(body) { await habitApi.update(body); await load(); }
  async function handleDelete(id) { await habitApi.delete(id); await load(); }
  async function handleStatusChange(habit, status) {
    await habitApi.update({ id: habit.id, status });
    await load();
  }

  const filtered = filter === "All" ? habits : habits.filter((h) => h.status === filter);
  const counts = {
    Active: habits.filter((h) => h.status === "Active").length,
    Paused: habits.filter((h) => h.status === "Paused").length,
    Resolved: habits.filter((h) => h.status === "Resolved").length,
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">// Habits</h1>
          <p className="page-subtitle">Track and manage the habits you want to break.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Habit</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["Active", "Paused", "Resolved", "All"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 16px", borderRadius: 999, border: "1px solid",
              borderColor: filter === f ? "var(--accent)" : "var(--border)",
              background: filter === f ? "rgba(200,245,90,0.1)" : "transparent",
              color: filter === f ? "var(--accent)" : "var(--text-muted)",
              fontSize: 13, cursor: "pointer", fontFamily: "var(--font-mono)",
            }}
          >
            {f} {f !== "All" && <span style={{ opacity: 0.6 }}>({counts[f] || 0})</span>}
          </button>
        ))}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">◎</div>
          <p>{filter === "Active" ? "No active habits. Add one to get started." : `No ${filter.toLowerCase()} habits.`}</p>
        </div>
      ) : (
        <div className="card-grid">
          {filtered.map((h) => {
            const isActive = h.status === "Active";
            const isPaused = h.status === "Paused";
            const isResolved = h.status === "Resolved";
            return (
              <div key={h.id} className="card" style={{ opacity: isResolved ? 0.65 : 1 }}>
                {!isActive && (
                  <div style={{
                    background: isPaused ? "rgba(255,180,50,0.08)" : "rgba(100,100,100,0.08)",
                    border: `1px solid ${isPaused ? "rgba(255,180,50,0.2)" : "rgba(100,100,100,0.2)"}`,
                    borderRadius: 6, padding: "6px 10px", fontSize: 12, marginBottom: 12,
                    color: isPaused ? "#ffb432" : "var(--text-muted)",
                  }}>
                    {STATUS_MESSAGE[h.status]}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <h3 style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: isResolved ? "var(--text-muted)" : "var(--text)" }}>
                    {isResolved ? <s>{h.name}</s> : h.name}
                  </h3>
                  <span className={"badge " + (STATUS_COLORS[h.status] || "badge-active")}>{h.status}</span>
                </div>
                {h.description && <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{h.description}</p>}
                {h.triggerDescription && (
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                    <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>trigger:</span> {h.triggerDescription}
                  </p>
                )}
                {h.replacementAction && (
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
                    <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>replace:</span> {h.replacementAction}
                  </p>
                )}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "auto" }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/habits/${h.id}/urges`)}>
                    View Urges
                  </button>
                  {!isResolved && <button className="btn btn-ghost btn-sm" onClick={() => setEditHabit(h)}>Edit</button>}
                  {isActive && (
                    <>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleStatusChange(h, "Paused")}>Pause</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleStatusChange(h, "Resolved")} style={{ color: "var(--accent)" }}>✓ Resolved</button>
                    </>
                  )}
                  {isPaused && (
                    <>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleStatusChange(h, "Active")}>Resume</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleStatusChange(h, "Resolved")} style={{ color: "var(--accent)" }}>✓ Resolved</button>
                    </>
                  )}
                  {isResolved && (
                    <button className="btn btn-ghost btn-sm" onClick={() => handleStatusChange(h, "Active")}>Reopen</button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteHabit(h)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && <HabitItemForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
      {editHabit && <HabitItemForm habit={editHabit} onSubmit={handleUpdate} onClose={() => setEditHabit(null)} />}
      {deleteHabit && <HabitItemDeleteDialog habit={deleteHabit} onDelete={handleDelete} onClose={() => setDeleteHabit(null)} />}
    </div>
  );
}
