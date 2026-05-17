import React from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
  return (
    <div className="layout">
      <nav className="navbar">
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <span className="navbar-brand">◉ BreakLoop</span>
        </NavLink>
        <div className="navbar-links">
          <NavLink
            to="/habits"
            className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}
          >
            Habits
          </NavLink>
        </div>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
