import React from "react";

export function TextareaField({
  label,
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  error = "",
  invalid = false
}) {
  return (
    <div className={`form-group ${invalid ? "invalid" : ""}`}>
      <label htmlFor={id}>
        {label} {required && <span className="required">*</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
      {invalid && error && <span className="error-msg">{error}</span>}
    </div>
  );
}
