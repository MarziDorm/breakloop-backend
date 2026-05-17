import React, { useState } from "react";

const TRIGGERS = ["Stress", "Boredom", "Loneliness", "Other"];

export default function UrgeEventItemForm({ habitId, event, onSubmit, onClose }) {
  const [triggerTag, setTriggerTag] = useState(event?.triggerTag || "");
  const [resisted, setResisted] = useState(event?.resisted ?? null);
  const [slipUpNote, setSlipUpNote] = useState(event?.slipUpNote || "");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!triggerTag) {
      setError("Please select a trigger.");
      return;
    }

    if (resisted === null) {
      setError("Please select whether you resisted or slipped.");
      return;
    }

    if (resisted === false && !slipUpNote.trim()) {
      setError("Please describe what happened.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const body = event
        ? {
            id: event.id,
            triggerTag,
            resisted,
          }
        : {
            habitId,
            triggerTag,
            resisted,
          };
      if (resisted === false) {
        body.slipUpNote = slipUpNote.trim();
      }

      await onSubmit(body);
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
          <h2>{event ? "Edit Urge Event" : "Log Urge Event"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="field">
          <label>What triggered it?</label>
          <div className="chip-group">
            {TRIGGERS.map((t) => (
              <button
                key={t}
                type="button"
                className={"chip" + (triggerTag === t ? " selected" : "")}
                onClick={() => setTriggerTag(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Did you resist?</label>
          <div className="chip-group">
            <button
              type="button"
              className={"chip" + (resisted === true ? " selected" : "")}
              onClick={() => setResisted(true)}
            >
              ✓ Resisted
            </button>

            <button
              type="button"
              className={"chip" + (resisted === false ? " selected" : "")}
              onClick={() => setResisted(false)}
              style={
                resisted === false
                  ? {
                      background: "var(--accent2)",
                      borderColor: "var(--accent2)",
                      color: "white",
                    }
                  : {}
              }
            >
              ✗ Slipped
            </button>
          </div>
        </div>

        {resisted === false && (
          <div className="field">
            <label>What will you try next time?</label>
            <textarea
              value={slipUpNote}
              onChange={(e) => setSlipUpNote(e.target.value)}
              placeholder="No judgment — just learning."
              rows={3}
              maxLength={1000}
              style={{ resize: "vertical" }}
            />
          </div>
        )}

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
