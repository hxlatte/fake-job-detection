import React from "react";

export function ToggleSwitch({
  label,
  active,
  onClick
}) {
  return (
    <div
      className={`toggle-switch-wrapper ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="toggle-switch"></div>
      <span className="toggle-label">{label}</span>
    </div>
  );
}
