import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import UrgeEventList from "./pages/UrgeEventList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="habits" element={<Dashboard />} />
          <Route path="habits/:habitId/urges" element={<UrgeEventList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
