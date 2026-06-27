import React, { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

// Custom Hooks
import { useTheme } from "./hooks/useTheme";

// Global Layout Components
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Toast } from "./components/Toast";

// Page Views
import { Home } from "./pages/Home";
import { AnalyzeJob } from "./pages/AnalyzeJob";
import { History } from "./pages/History";
import { About } from "./pages/About";
import { NotFound } from "./pages/NotFound";

// Styles
import "./styles/index.css";
import "./styles/main.css";

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [toasts, setToasts] = useState([]);

  // Toast notifier helper
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <HashRouter>
      <div className="app-wrapper">
        {/* Glow and grid mesh background layer */}
        <div className="bg-grid"></div>
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>

        {/* Global sticky header */}
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        {/* Dynamic content routing slot */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<AnalyzeJob addToast={addToast} />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Global footer */}
        <Footer />

        {/* Float notifications system */}
        <div id="toast-container" className="toast-container">
          {toasts.map(t => (
            <Toast
              key={t.id}
              id={t.id}
              message={t.message}
              type={t.type}
              onClose={removeToast}
            />
          ))}
        </div>
      </div>
    </HashRouter>
  );
}
