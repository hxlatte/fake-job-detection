import React from "react";

export function Dropdown({
  label,
  id,
  value,
  onChange,
  options = []
}) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <div className="custom-select-wrapper">
        <select id={id} value={value} onChange={onChange}>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value !== undefined ? opt.value : opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
