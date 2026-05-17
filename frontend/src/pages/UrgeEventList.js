import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { habitApi, urgeEventApi } from "../api";
import UrgeEventItemForm from "../components/UrgeEventItemForm";
import UrgeEventItemDeleteDialog from "../components/UrgeEventItemDeleteDialog";

const TRIGGER_COLORS = { Stress: "#ff6b6b", Boredom: "#ffb432", Loneliness: "#7eb8f7", Other: "#aaa" };

export default function UrgeEventList() {
  const { habitId } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [deleteEvent, setDeleteEvent] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [h, ev] = await Promise.all([habitApi.get(habitId), urgeEventApi.list(habitId)]);
      setHabit(h);
      setEvents(ev.urgeEventList);
    } catch {
      setError("Could not load data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [habitId]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(body) { await urgeEventApi.create(body); await load(); }
  async function handleUpdate(body) { await urgeEventApi.update(body); await load(); }
  async function handleDelete(id) { await urgeEventApi.delete(id); await load(); }

  const resisted = events.filter((e) => e.resisted).length;
  const slipped = events.filter((e) => !e.resisted).length;
  const isActive = habit?.status === "Active";
  const isPaused = habit?.status === "Paused";
  const isResolved = habit?.status === "Resolved";

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate("/habits")} style={{ marginBottom: 24 }}>
        ← Back to Habits
      </button>

      {loading ? <p style={{ color: "var(--text-muted)" }}>Loading...</p> : error ? (
        <div className="error-banner">{error}</div>
      ) : (
        <>
          <div className="page-header">
            <div>
              <h1 className="page-title">// {habit?.name}</h1>
              <p className="page-subtitle">{habit?.replacementAction && <>Replace with: {habit.replacementAction}</>}</p>
            </div>
            {/* Only show Log Urge button when habit is Active */}
            {isActive && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Log Urge</button>
            )}
          </div>

          {/* Status banner for non-active habits */}
          {!isActive && (
            <div style={{
              background: isPaused ? "rgba(255,180,50,0.08)" : "rgba(100,100,100,0.08)",
              border: `1px solid ${isPaused ? "rgba(255,180,50,0.3)" : "rgba(100,100,100,0.3)"}`,
              borderRadius: 8, padding: "12px 16px", marginBottom: 24, fontSize: 14,
              color: isPaused ? "#ffb432" : "var(--text-muted)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span>
                {isPaused && "⏸ This habit is paused — urge logging is disabled."}
                {isResolved && "✓ This habit is resolved — great work breaking it!"}
              </span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate("/habits")}
              >
                Manage habit →
              </button>
            </div>
          )}

          {events.length > 0 && (
            <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
              <div className="card" style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 28, fontFamily: "var(--font-mono)", color: "var(--text)" }}>{events.length}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Total Urges</div>
              </div>
              <div className="card" style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 28, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{resisted}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Resisted</div>
              </div>
              <div className="card" style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 28, fontFamily: "var(--font-mono)", color: "var(--accent2)" }}>{slipped}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Slipped</div>
              </div>
            </div>
          )}

          {events.length === 0 ? (
            <div className="empty-state">
              <div className="icon">◎</div>
              <p>{isActive ? "No urge events logged yet. Press \"Log Urge\" when you feel the urge." : "No urge events logged for this habit."}</p>
            </div>
          ) : (
            <div>
              {[...events].reverse().map((ev) => (
                <div key={ev.id} className={"urge-item " + (ev.resisted ? "resisted" : "slipped")}>
                  <div className={"urge-dot " + (ev.resisted ? "resisted" : "slipped")} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: TRIGGER_COLORS[ev.triggerTag] || "#aaa" }}>
                        {ev.triggerTag}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{new Date(ev.occurredAt).toLocaleString()}</span>
                      {ev.urgeDurationSec && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{ev.urgeDurationSec}s</span>}
                    </div>
                    <div style={{ fontSize: 13, color: ev.resisted ? "var(--accent)" : "var(--accent2)" }}>
                      {ev.resisted ? "✓ Resisted" : "✗ Slipped"}
                    </div>
                    {ev.slipUpNote && (
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, fontStyle: "italic" }}>"{ev.slipUpNote}"</div>
                    )}
                  </div>
                  {/* Edit/delete only available when habit is active */}
                  {isActive && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditEvent(ev)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteEvent(ev)}>Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showForm && <UrgeEventItemForm habitId={habitId} onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
      {editEvent && <UrgeEventItemForm event={editEvent} habitId={habitId} onSubmit={handleUpdate} onClose={() => setEditEvent(null)} />}
      {deleteEvent && <UrgeEventItemDeleteDialog event={deleteEvent} onDelete={handleDelete} onClose={() => setDeleteEvent(null)} />}
    </div>
  );
}
