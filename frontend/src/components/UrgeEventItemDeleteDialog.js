import React, { useState } from "react";

export default function UrgeEventItemDeleteDialog({ event, onDelete, onClose }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await onDelete(event.id);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete Urge Event</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Are you sure you want to delete this urge event? This action cannot be undone.
        </p>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
