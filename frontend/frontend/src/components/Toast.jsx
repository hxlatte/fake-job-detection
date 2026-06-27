import React, { useEffect } from "react";

export function Toast({
  id,
  message,
  type = "success",
  onClose
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getIcon = () => {
    if (type === "success") {
      return (
        <svg className="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <path d="M9 12l2 2 4-4" strokeWidth="2"/>
        </svg>
      );
    }
    if (type === "error") {
      return (
        <svg className="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
          <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
        </svg>
      );
    }
    return (
      <svg className="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
        <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2"/>
        <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2"/>
      </svg>
    );
  };

  return (
    <div className={`toast toast-${type}`}>
      {getIcon()}
      <div className="toast-content">{message}</div>
      <button className="toast-close" onClick={() => onClose(id)} aria-label="Close Toast">
        ✕
      </button>
    </div>
  );
}
